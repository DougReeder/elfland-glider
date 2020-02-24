// elfland-utils.js - common functions for Elfland Glider
// Copyright © 2018-2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0


function goFullscreenLandscape() {
    // desktop is fine without fullscreen (which can be enabled via headset button, anyway)
    if (!isMagicWindow()) {return;}

    let canvasEl = document.querySelector('canvas.a-canvas');
    let requestFullscreen =
        canvasEl.requestFullscreen ||
        canvasEl.webkitRequestFullscreen ||
        canvasEl.mozRequestFullScreen ||  // The capitalized `S` is not a typo.
        canvasEl.msRequestFullscreen;
    let promise;
    if (requestFullscreen) {
        promise = requestFullscreen.apply(canvasEl);
    }
    if (!(promise && promise.then)) {
        promise = Promise.resolve();
    }
    promise.then(lockLandscapeOrientation, lockLandscapeOrientation);
}

function lockLandscapeOrientation() {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").then(response => {
            console.log("screen orientation locked:", response);
        }).catch(err => {
            console.warn("screen orientation didn't lock:", err);
        });
    }
}


function isDesktop() {
    return ! (AFRAME.utils.device.isMobile() || AFRAME.utils.device.isMobileVR());
}

function isMagicWindow() {
    return AFRAME.utils.device.isMobile() && ! AFRAME.scenes[0].is("vr-mode");
}


function calcPosChange(verticalAngleDeg, horizontalAngleDeg, distance) {
    let verticalAngleRad = verticalAngleDeg/180*Math.PI;
    let altitudeChange = distance * Math.sin(verticalAngleRad);

    let horizontalDistance = distance * Math.cos(verticalAngleRad);
    let horizontalAngleRad = horizontalAngleDeg/180*Math.PI;
    return {x: horizontalDistance * Math.cos(horizontalAngleRad),
        y: altitudeChange,
        z: -horizontalDistance * Math.sin(horizontalAngleRad)};
}


var environmentalSound = null;

/**
 * Sets the background sound for a world. It is paused when the tab is hidden.
 * @param url string or Array of strings
 * @param volume number between 0.0 and 1.0
 */
function setEnvironmentalSound(url, volume) {
    environmentalSound = new Howl({
        src: url,
        autoplay: true,
        loop: true,
        volume: volume || 1.0,
        html5: false,
        onplayerror: function() {
            environmentalSound.once('unlock', function() {
                environmentalSound.play();
            });
        }
    });
}

/** Starts the background sound for a world, if it wasn't already started. */
function pokeEnvironmentalSound() {
    if (environmentalSound && ! environmentalSound.playing()) {
        environmentalSound.play();
    }
}

document.addEventListener('visibilitychange', () => {
    if (environmentalSound) {
        if (document.hidden) {
            environmentalSound.pause();
        } else {
            environmentalSound.play();
        }
    }
}, false);


function barFromHands(leftHand, rightHand) {
    let position = {
        x:(leftHand.x + rightHand.x) / 2,
        y:(leftHand.y + rightHand.y) / 2,
        z:(leftHand.z + rightHand.z) / 2
    };
    if (leftHand.x - rightHand.x > -0.02) {   // limit rotation
        leftHand = {x:position.x - 0.01, y:leftHand.y, z:leftHand.z};
        rightHand = {x:position.x + 0.01, y:rightHand.y, z:rightHand.z};
    }
    let rotation = {
        x:0,
        y:Math.atan2(rightHand.z - leftHand.z, rightHand.x - leftHand.x) * -180 / Math.PI,
        z:Math.atan2(rightHand.y - leftHand.y, rightHand.x - leftHand.x) * 180 / Math.PI
    };
    return {position, rotation};
}

/** Gosper curve implementation by Jos Dirksen in "Learn Three.js" */
function gosper(a, b) {
    var turtle = [0, 0, 0];
    var points = [];
    var count = 0;

    rg(a, b, turtle);

    return points;


    function rt(x) {
        turtle[2] += x;
    }

    function lt(x) {
        turtle[2] -= x;
    }

    function fd(dist) {
        points.push(turtle[0] + ' 0 ' + turtle[1]);

        var dir = turtle[2] * (Math.PI / 180);
        turtle[0] += Math.cos(dir) * dist;
        turtle[1] += Math.sin(dir) * dist;

        points.push(turtle[0] + ' 0 ' + turtle[1]);
    }

    function rg(st, ln, turtle) {

        st--;
        ln = ln / 2.6457;
        if (st > 0) {
            rg(st, ln, turtle);
            rt(60);
            gl(st, ln, turtle);
            rt(120);
            gl(st, ln, turtle);
            lt(60);
            rg(st, ln, turtle);
            lt(120);
            rg(st, ln, turtle);
            rg(st, ln, turtle);
            lt(60);
            gl(st, ln, turtle);
            rt(60);
        }
        if (st == 0) {
            fd(ln);
            rt(60);
            fd(ln);
            rt(120);
            fd(ln);
            lt(60);
            fd(ln);
            lt(120);
            fd(ln);
            fd(ln);
            lt(60);
            fd(ln);
            rt(60)
        }
    }

    function gl(st, ln, turtle) {
        st--;
        ln = ln / 2.6457;
        if (st > 0) {
            lt(60);
            rg(st, ln, turtle);
            rt(60);
            gl(st, ln, turtle);
            gl(st, ln, turtle);
            rt(120);
            gl(st, ln, turtle);
            rt(60);
            rg(st, ln, turtle);
            lt(120);
            rg(st, ln, turtle);
            lt(60);
            gl(st, ln, turtle);
        }
        if (st == 0) {
            lt(60);
            fd(ln);
            rt(60);
            fd(ln);
            fd(ln);
            rt(120);
            fd(ln);
            rt(60);
            fd(ln);
            lt(120);
            fd(ln);
            lt(60);
            fd(ln);
        }
    }
}


export {goFullscreenLandscape, isDesktop, isMagicWindow, calcPosChange, setEnvironmentalSound, pokeEnvironmentalSound,
    barFromHands, gosper};
