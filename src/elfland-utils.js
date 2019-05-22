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


function isMagicWindow() {
    return AFRAME.utils.device.isMobile () &&
        ! AFRAME.utils.device.isGearVR() &&
        ! AFRAME.scenes[0].is("vr-mode")
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
        html5: ! AFRAME.utils.device.isMobile(),   // on desktop, avoids wait for full download
        onplayerror: function() {
            environmentalSound.once('unlock', function() {
                environmentalSound.play();
            });
        }
    });

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


export {goFullscreenLandscape, isMagicWindow, calcPosChange, setEnvironmentalSound};
