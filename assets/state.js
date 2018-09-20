// state.js - state model for Elfland Glider
// Copyright © 2017-2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//

const GRAVITY = 9.807;   // m/s^2
const DIFFICULTY_VR = 0.75;
const DIFFICULTY_MAGIC_WINDOW = 0.6;
const DIFFICULTY_KEYBOARD = 0.5;
const POWERUP_BOOST = 16;

AFRAME.registerState({
    initialState: {
        armatureEl: null,
        gliderEl: null,
        cameraEl: null,
        time: 0,
        difficulty: DIFFICULTY_MAGIC_WINDOW,
        gliderPosition: {x:-30, y:15, z:30},
        gliderPositionStart: {x:-30, y:15, z:30},
        gliderRotationX: 0,
        gliderRotationY: -45,
        gliderRotationYStart: -45,
        isFlying: false,
        gliderSpeed: 5,
        numYellowStars: Math.POSITIVE_INFINITY,
        stars: 0,
        questComplete: false,
        inventory: {},   // keyed by object ID
        hudVisible: true,
        hudText: "",
        controlsReminderDisplayed: false,
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
            this.powerup = new Howl({src: ['../assets/411460__inspectorj__power-up-bright-a.mp3']});

            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
            console.log("isMobile:", AFRAME.utils.device.isMobile());

            state.armatureEl = armatureEl;
            state.gliderEl = armatureEl.querySelector('#glider');
            state.cameraEl = armatureEl.querySelector('[camera]');

            let dustEl = AFRAME.scenes[0].querySelector('a-dust');
            if (dustEl) {
                requestIdleCallback(() => {   // delays setup until there's some slack time
                    dustEl.components.dust.setCamera(state.armatureEl);
                });
            }

            let bodyEl = state.armatureEl.querySelector('#body');
            let headingTriangleEl = state.gliderEl.querySelector('#headingTriangle');
            let hudEl = armatureEl.querySelector('#hud');
            this.adjustForMagicWindow(headingTriangleEl, hudEl);
            if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected()) {
                this.adjustHudForVR(hudEl);
                state.difficulty = DIFFICULTY_VR;
            } else {
                this.adjustHudForFlat(hudEl);
                if (AFRAME.utils.device.isMobile()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            }
            AFRAME.scenes[0].addEventListener('enter-vr', (event) => {
                if (AFRAME.utils.device.checkHeadsetConnected()) {
                    bodyEl.object3D.position.y = -1.6;
                    this.adjustHudForVR(hudEl);
                    this.adjustForMagicWindow(headingTriangleEl);
                    state.difficulty = DIFFICULTY_VR;
                }
            });
            AFRAME.scenes[0].addEventListener('exit-vr', (event) => {
                // bodyEl.object3D.position.y = 0;   // Why is this unnecessary?
                this.adjustHudForFlat(hudEl);
                this.adjustForMagicWindow(headingTriangleEl);
                if (AFRAME.utils.device.isMobile()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            });

            if (!AFRAME.utils.device.isMobile() && !AFRAME.utils.device.checkHeadsetConnected()) {
                console.log("desktop w/o headset; disabling look-fly-controls so keyboard controls can function");
                state.cameraEl.setAttribute('look-fly-controls', 'enabled', 'false');
            }

            state.gliderEl.addEventListener('raycaster-intersection', (evt) => {
                // Intersection w/ distance 0 is sometimes sent immediately
                if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
                    console.log("CRASH!", evt.detail.els[0].tagName,
                        evt.detail.intersections[0].distance,
                        state.gliderEl.getAttribute('raycaster').far, state.gliderSpeed / 10);
                    AFRAME.scenes[0].emit('hover', {});
                    let crash = new Howl({src: ['../assets/198876__bone666138__crash.mp3']});
                    crash.play();

                    setTimeout(() => {
                        // console.log("setting start position", state.gliderPositionStart);
                        state.gliderPosition.x = state.gliderPositionStart.x;
                        state.gliderPosition.y = state.gliderPositionStart.y;
                        state.gliderPosition.z = state.gliderPositionStart.z;
                        state.gliderRotationX = 0;
                        state.gliderRotationY = state.gliderRotationYStart;
                        state.gliderSpeed = 5;
                        state.hudText = "";
                        state.cameraEl.object3D.rotation.x = 0;   // only takes effect when look-fly-controls disabled
                        state.cameraEl.object3D.rotation.y = 0;
                        state.cameraEl.object3D.rotation.z = 0;
                        setTimeout(this.showControlsReminder.bind(this, state), 3000);
                    }, 3000)
                }
            });

            armatureEl.addEventListener('hitstart', (evt) => {
                // console.log('hitstart armature:', evt.detail.intersectedEls);
                evt.detail.intersectedEls.forEach( (el) => {
                    if (el.classList.contains('powerup')) {
                        console.log("powerup");
                        state.gliderSpeed += POWERUP_BOOST;
                        this.powerup.play();
                    } else if (el.classList.contains('star')) {
                       ++state.stars;
                       console.log("collected star", state.stars, "of", state.numYellowStars);
                        el.parentNode.removeChild(el);
                       this.ding.play();
                    } else if (el.classList.contains('proximitySound')) {
                        let url = el.getAttribute('data-sound-url');
                        let volume = el.getAttribute('data-sound-volume') || 1.0;
                        if (url) {
                            new Howl({src: url, volume: volume, autoplay: true});
                        }
                        let text = el.getAttribute('data-text');
                        let subtitle = AFRAME.scenes[0].querySelector('#subtitle');
                        if (text && subtitle) {
                            subtitle.setAttribute('value', text);
                            setTimeout(() => {
                                subtitle.setAttribute('value', "");
                            }, 5000);
                        }
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
                        state.cameraEl.object3D.rotation.z += 0.07;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        state.cameraEl.object3D.rotation.z -= 0.07;
                        break;
                    case 'KeyW':
                    case 'ArrowUp':
                        state.cameraEl.object3D.rotation.x += 0.045;
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        state.cameraEl.object3D.rotation.x -= 0.045;
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
            if (state.numYellowStars) {
                this.ding = new Howl({src: ['../assets/393633__daronoxus__ding.mp3']});
            }
        },

        launch: function (state, action) {
            console.log("launch", action);

            state.isFlying = true;

            state.controlsReminderDisplayed = false;
            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            if (prelaunchHelp) {
                prelaunchHelp.setAttribute('value', "");
            }
        },
        hover: function (state, action) {
            console.log("hover", action);

            state.isFlying = false;
        },

        loaded: function (state, action) {
            // console.log("loaded", state, action);
            let intro = document.getElementById('intro');
            if (!intro) {
                this.startInteraction(state);
            }
        },

        'enter-vr': function (state) {
            // console.log("enter-vr");
            this.startInteraction(state);
        },
        'exit-vr': function (state, action) {
            // console.log("exit-vr", action);
            if (state.controlsReminderDisplayed) {
                this.showControlsReminder(state);   // updates list of controls for flat screen
            }

            let intro = document.getElementById('intro');
            if (intro) {
                AFRAME.scenes[0].emit('hover', action);
            }
        },
        startInteraction: function (state) {
            if (state.controlsReminderDisplayed) {
                this.showControlsReminder(state);   // updates list of controls
            } else {
                setTimeout(this.showControlsReminder.bind(this, state), 6000);
            }
        },
        showControlsReminder: function (state) {
            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            let intro = document.getElementById('intro');
            if (prelaunchHelp && (!intro || AFRAME.scenes[0].is("vr-mode")) && !state.isFlying) {
                state.controlsReminderDisplayed = true;
                if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected() || AFRAME.utils.device.isGearVR()) {
                    prelaunchHelp.setAttribute('value', "The triangle above you\npoints where you're flying.\n\nTilt your head left: turn left\nTilt your head right: turn right\nTrigger or touchpad: launch");
                } else if (AFRAME.utils.device.isMobile()) {
                    prelaunchHelp.setAttribute('value', "The triangle above you\npoints where you're flying.\n\nRoll your device left: turn left\nRoll your device right: turn right\nTap screen: launch");
                } else {
                    prelaunchHelp.setAttribute('value', "The triangle above you\npoints where you're flying.\n\nA: turn left\nD: turn right\nW: climb (& slow down)\nS: descend (& speed up)\nSpace bar: launch");
                }
            }
        },

        iterate: function (state, action) {
            // A pause in the action is better than flying blind
            action.timeDelta = Math.min(action.timeDelta, 100);
            state.time += action.timeDelta * state.difficulty;
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

                let posChange = calcPosChange(state.gliderRotationX, state.gliderRotationY+90, distance);
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
            let verticalAngleDeg = state.gliderRotationX + (Math.random()-0.5) * action.variation;
            let horizontalAngleDeg = state.gliderRotationY + 90 + (Math.random()-0.5) * action.variation;
            let posChange = calcPosChange(verticalAngleDeg, horizontalAngleDeg, action.distance);
            let newPos = {x: state.gliderPosition.x + posChange.x,
                y: state.gliderPosition.y + posChange.y,
                z: state.gliderPosition.z + posChange.z};
            action.el.setAttribute('position', newPos);
            action.el.setAttribute('rotation', 'y', state.gliderRotationY);
        },

        adjustForMagicWindow: function (headingTriangleEl) {
            if (! this.isMagicWindow()) {
                headingTriangleEl.object3D.rotation.x = 0;
            } else {
                headingTriangleEl.object3D.rotation.x = THREE.Math.degToRad(-10.0);
            }
        },

        isMagicWindow: function () {
            return AFRAME.utils.device.isMobile () &&
                ! AFRAME.utils.device.isGearVR() &&
                ! AFRAME.scenes[0].is("vr-mode")
        },

        adjustHudForVR: function (hudEl) {
            hudEl.object3D.position.x = 0.2;
            hudEl.object3D.position.y = 0.42;
            hudEl.object3D.rotation.x = THREE.Math.degToRad(30.0);
            hudEl.object3D.rotation.y = THREE.Math.degToRad(-20.0);
        },

        adjustHudForFlat: function (hudEl) {
            hudEl.object3D.position.x = 0.85;
            hudEl.object3D.position.y = 0.5;
            hudEl.object3D.rotation.x = 0.0;
            hudEl.object3D.rotation.y = 0.0;
        }
    },

    computeState: function (newState, payload) {
        try {
            let oldQuestComplete = newState.questComplete;
            newState.questComplete = newState.stars >= newState.numYellowStars;
            if (newState.questComplete && ! oldQuestComplete) {
                let horncall = new Howl({src: ['../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3']});
                horncall.play();
            }
        } catch (err) {
            console.error(err);
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
