// state.js - state model for Elfland Glider
// Copyright © 2017-2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//

const GRAVITY = 9.807;   // m/s^2

AFRAME.registerState({
    initialState: {
        armatureEl: null,
        gliderEl: null,
        cameraEl: null,
        time: 0,
        gliderPosition: {x:-30, y:15, z:30},
        gliderPositionStart: {x:-30, y:15, z:30},
        gliderRotationX: 0,
        gliderRotationY: -45,
        isFlying: false,
        gliderSpeed: 5,
        numYellowStars: Math.POSITIVE_INFINITY,
        stars: 0,
        questComplete: false,
        inventory: {},   // keyed by object ID
        hudVisible: true,
        hudText: "",
        debug: false   // no way to enable this yet
    },

    handlers: {
        setState: function (state, values) {
            for (pName in values) {
                if (pName !== 'target') {
                    console.log("setting", pName, values[pName]);
                    state[pName] = values[pName];
                }
            }
        },

        setArmatureEl: function (state, armatureEl) {
            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
            console.log("isMobile:", AFRAME.utils.device.isMobile());

            state.armatureEl = armatureEl;
            state.gliderEl = armatureEl.querySelector('#glider');
            state.cameraEl = armatureEl.querySelector('[camera]');

            let headingTriangleEl = state.gliderEl.querySelector('#headingTriangle');
            let hudEl = armatureEl.querySelector('#hud');
            this.adjustForMagicWindow(headingTriangleEl, hudEl);
            AFRAME.scenes[0].addEventListener('enter-vr', (event) => {
                this.adjustForMagicWindow(headingTriangleEl, hudEl);
            });
            AFRAME.scenes[0].addEventListener('exit-vr', (event) => {
                this.adjustForMagicWindow(headingTriangleEl, hudEl);
            });

            state.gliderEl.addEventListener('raycaster-intersection', function (evt) {
                // Intersection w/ distance 0 is sometimes sent immediately
                if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
                    console.log("CRASH!", evt.detail.els[0].tagName, evt.detail.els[0].components.sound,
                        evt.detail.intersections[0].distance,
                        state.gliderEl.getAttribute('raycaster').far, state.gliderSpeed / 10);
                    AFRAME.scenes[0].emit('hover', {});
                    // The sound component wasn't working, and I couldn't figure out why.
                    var snd = new Audio("../assets/198876__bone666138__crash.mp3"); // buffers automatically when created
                    snd.play();

                    setTimeout(function () {
                        // console.log("setting start position");
                        state.gliderPosition.x = state.gliderPositionStart.x;
                        state.gliderPosition.y = state.gliderPositionStart.y;
                        state.gliderPosition.z = state.gliderPositionStart.z;
                        state.gliderRotationX = 0;
                        state.gliderRotationY = -45;
                        state.gliderSpeed = 5;
                        state.hudText = "";
                    }, 3000)
                }
            });

            armatureEl.addEventListener('hitstart', function (evt) {
                // console.log('hitstart armature:', evt.detail.intersectedEls);
                evt.detail.intersectedEls.forEach(function (el) {
                    if (el.classList.contains('powerup')) {
                        console.log("powerup");
                        state.gliderSpeed += 12;
                    } else if (el.classList.contains('star')) {
                       ++state.stars;
                       console.log("collected star", state.stars, "of", state.numYellowStars);
                       el.setAttribute('visible', 'false');
                       setTimeout(() => el.parentNode.removeChild(el), 2000);   // allow sound to finish
                   } else if (el.components.link) {
                       console.log("hit link");
                   }
                });
            });

            // state doesn't have an init, so we'll register this here.
            // desktop controls
            document.addEventListener('keydown', function(evt) {
                // console.log('keydown:', evt.code);
                var cameraRotation = state.cameraEl.getAttribute('rotation');
                switch (evt.code) {
                    case 'KeyA':
                    case 'ArrowLeft':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z+4});
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z-4});
                        break;
                    case 'KeyW':
                    case 'ArrowUp':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x+2, y: cameraRotation.y, z: cameraRotation.z});
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x-2, y: cameraRotation.y, z: cameraRotation.z});
                        break;
                    case 'Space':
                        if (!state.isFlying) {
                            AFRAME.scenes[0].emit('launch', evt);
                        } else {
                            if (state.debug) {
                                AFRAME.scenes[0].emit('hover', evt);
                            }
                        }
                        break;
                    case 'Enter':
                        state.hudVisible = ! state.hudVisible;
                        break;
                }
            }, false);
        },

        // aframe-button-controls: any controller button, or scene touch
        buttondown: function (state, action) {
            // console.log("buttondown", action);
            if (!state.isFlying) {
                AFRAME.scenes[0].emit('launch', action);
            } else {
                if (state.debug) {
                    AFRAME.scenes[0].emit('hover', action);
                }
            }
        },

        countYellowStars: function (state, action) {
            state.numYellowStars = AFRAME.scenes[0].querySelectorAll('.star').length;
            console.log("numYellowStars:", state.numYellowStars);
        },

        launch: function (state, action) {
            console.log("launch", action);

            state.isFlying = true;

            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            if (prelaunchHelp) {
                prelaunchHelp.parentNode.removeChild(prelaunchHelp);
            }

            let environmentalSound = AFRAME.scenes[0].querySelector('#environmentalSound');
            if (environmentalSound) {
                environmentalSound.components.sound.playSound();
            }
        },
        hover: function (state, action) {
            console.log("hover", action);

            state.isFlying = false;

            let environmentalSound = AFRAME.scenes[0].querySelector('#environmentalSound');
            if (environmentalSound) {
                environmentalSound.components.sound.pauseSound();
            }
        },

        iterate: function (state, action) {
            // A pause in the action is better than flying blind
            action.timeDelta = Math.min(action.timeDelta, 100);
            state.time += action.timeDelta;
            let cameraRotation = state.cameraEl.getAttribute('rotation');
            if (!cameraRotation) {
                console.warn("camera rotation not available");
                return;
            }
            let cameraRotX = this.isMagicWindow() ? cameraRotation.x + 20 : cameraRotation.x;
            let xDiff = cameraRotX - state.gliderRotationX;
            let xChange = (xDiff + Math.sign(xDiff)*15) * (action.timeDelta / 1000);
            if (Math.abs(xChange) > Math.abs(xDiff)) {
                xChange = xDiff;
            }
            let newXrot = state.gliderRotationX + xChange;
            newXrot = Math.max(newXrot, -89);
            newXrot = Math.min(newXrot, 89);
            state.gliderRotationX = newXrot;

            let deltaHeading = cameraRotation.z * action.timeDelta / 1000;
            state.gliderRotationY = (state.gliderRotationY + deltaHeading + 180) % 360 - 180;

            if (state.isFlying) {
                let distance = state.gliderSpeed * action.timeDelta / 1000;

                let posChange = this.calcPosChange(state, distance);
                let altitudeChange = posChange.y;
                state.gliderPosition.x += posChange.x;
                state.gliderPosition.y += altitudeChange;
                state.gliderPosition.z += posChange.z;

                let speedChange = (-Math.sign(altitudeChange) * Math.sqrt(2 * GRAVITY * Math.abs(altitudeChange)) -
                                0.0005 * state.gliderSpeed * state.gliderSpeed)
                        * action.timeDelta / 1000;
                state.gliderSpeed = Math.max(state.gliderSpeed + speedChange, 0.1);
                state.gliderSpeed = Math.min(state.gliderSpeed, 99.4);

                if (state.gliderSpeed < 9.95) {
                    state.hudText = (state.gliderSpeed).toFixed(1);
                } else {
                    state.hudText = (state.gliderSpeed).toFixed(0);
                }

                state.gliderEl.setAttribute('raycaster', 'far', state.gliderSpeed/10);
            }
        },

        placeInGliderPath: function (state, action) {
            // console.log("placeInGliderPath:", action);
            let posChange = this.calcPosChange(state, action.distance, action.variation);
            let newPos = {x: state.gliderPosition.x + posChange.x,
                y: state.gliderPosition.y + posChange.y,
                z: state.gliderPosition.z + posChange.z};
            action.el.setAttribute('position', newPos);
            action.el.setAttribute('rotation', 'y', state.gliderRotationY);
        },

        calcPosChange: function (state, distance, variation=0) {
            let verticalAngleRad = (state.gliderRotationX + (Math.random()-0.5) * variation)/180*Math.PI;
            let altitudeChange = distance * Math.sin(verticalAngleRad);

            let horizontalDistance = distance * Math.cos(verticalAngleRad);
            let horizontalAngleRad = (state.gliderRotationY + 90 + (Math.random()-0.5) * variation)/180*Math.PI;
            return {x: horizontalDistance * Math.cos(horizontalAngleRad),
                y: altitudeChange,
                z: -horizontalDistance * Math.sin(horizontalAngleRad)};
        },

        adjustForMagicWindow: function (headingTriangleEl, hudEl) {
            if (! this.isMagicWindow()) {
                headingTriangleEl.object3D.rotation.x = 0;
            } else {
                headingTriangleEl.object3D.rotation.x = THREE.Math.degToRad(-10.0);
            }

            if (AFRAME.scenes[0].is("vr-mode")) {
                hudEl.object3D.position.x = 0.2;
                hudEl.object3D.position.y = 0.42;
                hudEl.object3D.rotation.x = THREE.Math.degToRad(30.0);
                hudEl.object3D.rotation.y = THREE.Math.degToRad(-20.0);
            } else {
                hudEl.object3D.position.x = 0.85;
                hudEl.object3D.position.y = 0.5;
                hudEl.object3D.rotation.x = 0.0;
                hudEl.object3D.rotation.y = 0.0;
            }
        },

        isMagicWindow: function () {
            return AFRAME.utils.device.isMobile () &&
                ! AFRAME.utils.device.isGearVR() &&
                ! AFRAME.scenes[0].is("vr-mode")
        }
    },

    computeState: function (newState, payload) {
        let oldQuestComplete = newState.questComplete;
        newState.questComplete = newState.stars >= newState.numYellowStars;
        if (newState.questComplete && ! oldQuestComplete) {
            let snd = new Audio("../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3");
            snd.play();
        }
    }
});

AFRAME.registerComponent('armature-tick-state', {
    init: function () {
        AFRAME.scenes[0].emit('setArmatureEl', this.el);
    },

    tick: function (time, timeDelta) {
        AFRAME.scenes[0].emit('iterate', {time: time, timeDelta: timeDelta});
    }
});
