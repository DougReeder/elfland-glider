// state.js - state model for Elfland Glider
// Copyright © 2017-2020 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//

import './shim/requestIdleCallback'
import {goFullscreenLandscape, isDesktop, isMagicWindow, calcPosChange, pokeEnvironmentalSound,
        barFromHands, gosper} from './elfland-utils'

const GRAVITY = 9.807;   // m/s^2
const HUMAN_EYE_ELBOW_DISTANCE = 0.56;   // m
const DIFFICULTY_VR = 0.75;
const DIFFICULTY_MAGIC_WINDOW = 0.6;
const DIFFICULTY_KEYBOARD = 0.5;
const POWERUP_BOOST = 16;

AFRAME.registerState({
    initialState: {
        armatureEl: null,
        gliderEl: null,
        cameraEl: null,
        leftHandEl: null,
        rightHandEl: null,
        controllerConnections: {},
        isAnyPressedLeft: false,
        isAnyPressedRight: false,
        xSetting: 0,
        zSetting: 0,
        controlBarEl: null,
        controlNeutralHeight: 0.95,
        controlMode: 'HEAD',   // or 'HANDS'
        controlSubmode: 'NONE',
        time: 0,
        difficulty: DIFFICULTY_MAGIC_WINDOW,
        gliderPosition: {x:-30, y:15, z:30},
        gliderPositionStart: {x:-30, y:15, z:30},
        gliderRotationX: 0,
        gliderRotationY: -45,
        gliderRotationZ: 0,
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
            for (let pName in values) {
                if (pName !== 'target') {
                    console.log("setting", pName, values[pName]);
                    state[pName] = values[pName];
                }
            }
        },

        setArmatureEl: function (state, armatureEl) {
            this.powerup = new Howl({src: ['../assets/411460__inspectorj__power-up-bright-a.mp3']});

            console.log("hasNativeWebXRImplementation:", window.hasNativeWebXRImplementation);
            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
            console.log("isMobile:", AFRAME.utils.device.isMobile());
            console.log("isMobileVR:", AFRAME.utils.device.isMobileVR());

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
            let wingEl = state.gliderEl.querySelector('#wing');
            let hudEl = armatureEl.querySelector('#hud');
            this.adjustForMagicWindow(wingEl);
            if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected()) {
                this.adjustHudForVR(hudEl);
                state.difficulty = DIFFICULTY_VR;
            } else {
                this.adjustHudForFlat(hudEl);
                if (isMagicWindow()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            }
            AFRAME.scenes[0].addEventListener('enter-vr', (event) => {
                if (AFRAME.utils.device.checkHeadsetConnected()) {
                    bodyEl.object3D.position.y = -1.6;
                    this.adjustHudForVR(hudEl);
                    this.adjustForMagicWindow(wingEl);
                    state.difficulty = DIFFICULTY_VR;
                }
                pokeEnvironmentalSound();
            });
            AFRAME.scenes[0].addEventListener('exit-vr', (event) => {
                // bodyEl.object3D.position.y = 0;   // Why is this unnecessary?
                this.adjustHudForFlat(hudEl);
                this.adjustForMagicWindow(wingEl);
                if (isMagicWindow()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            });

            if (isDesktop() && !AFRAME.utils.device.checkHeadsetConnected()) {
                console.log("desktop w/o headset; disabling look-controls so keyboard controls can function");
                state.cameraEl.setAttribute('look-controls', 'enabled', 'false');
            }

            state.gliderEl.addEventListener('raycaster-intersection', (evt) => {
                // Intersection w/ distance 0 is sometimes sent immediately
                if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
                    console.log("CRASH!", evt.detail.els[0].tagName,
                        evt.detail.intersections[0].distance,
                        state.gliderEl.getAttribute('raycaster').far, state.gliderSpeed/4);
                    AFRAME.scenes[0].emit('hover', {});
                    let crash = new Howl({src: ['../assets/198876__bone666138__crash.mp3']});
                    crash.play();

                    setTimeout(() => {
                        if (state.gliderSpeed >= 30) {
                            sessionStorage.setItem('returnWorld', location.pathname);
                            location.pathname = '/ginnungagap/'
                        } else {
                            // console.log("setting start position", state.gliderPositionStart);
                            state.gliderPosition.x = state.gliderPositionStart.x;
                            state.gliderPosition.y = state.gliderPositionStart.y;
                            state.gliderPosition.z = state.gliderPositionStart.z;
                            state.gliderRotationX = 0;
                            state.gliderRotationY = state.gliderRotationYStart;
                            state.gliderSpeed = 5;
                            this.controlBarToNeutral(state);
                            state.hudText = "";
                            state.cameraEl.object3D.rotation.x = 0;   // only takes effect when look-controls disabled
                            state.cameraEl.object3D.rotation.y = 0;
                            state.cameraEl.object3D.rotation.z = 0;
                            setTimeout(this.showControlsReminder.bind(this, state), 3000);
                        }
                    }, 2000)
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
                       if (location.pathname !== '/ginnungagap/') {
                           sessionStorage.setItem('previousWorld', location.pathname);
                       }
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

            // two-controller steering

            state.leftHandEl = document.getElementById("leftHand");
            state.rightHandEl = document.getElementById("rightHand");
            if (isDesktop()) {
                state.leftHandEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
                state.rightHandEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
            }

            this.leftDownHandler = this.handHandler.bind(this, 'LEFT', 'DOWN', state);
            this.leftUpHandler = this.handHandler.bind(this, 'LEFT', 'UP', state);
            this.rightDownHandler = this.handHandler.bind(this, 'RIGHT', 'DOWN', state);
            this.rightUpHandler = this.handHandler.bind(this, 'RIGHT', 'UP', state);

            state.controlBarEl = document.getElementById('controlBar');
        },

        controllerconnected: function (state, evt) {   // evt is name and component; this is state obj
            state.controllerConnections[evt.component.el.id] = true;
            this.adjustControlMode(state);
        },
        controllerdisconnected: function (state, evt) {
            state.controllerConnections[evt.component.el.id] = false;
            this.adjustControlMode(state);
        },
        adjustControlMode: function (state) {
            const oldControlMode =  state.controlMode;
            if (state.controllerConnections.leftHand || state.controllerConnections.rightHand) {
                state.controlMode = 'HANDS';
            } else {
                state.controlMode = 'HEAD';
            }
            if (state.controlMode !== oldControlMode) {
                console.log("changed control mode from", oldControlMode, "to", state.controlMode);
                if (state.controlMode === 'HANDS') {
                    state.leftHandEl.addEventListener('buttondown', this.leftDownHandler);
                    state.leftHandEl.addEventListener('buttonup', this.leftUpHandler);
                    state.rightHandEl.addEventListener('buttondown', this.rightDownHandler);
                    state.rightHandEl.addEventListener('buttonup', this.rightUpHandler);

                    this.controlBarToNeutral(state);
                    state.controlBarEl.object3D.visible = true;
                } else if (state.controlMode === 'HEAD') {
                    state.leftHandEl.removeEventListener('buttondown', this.leftDownHandler);
                    state.leftHandEl.removeEventListener('buttonup', this.leftUpHandler);
                    state.rightHandEl.removeEventListener('buttondown', this.rightDownHandler);
                    state.rightHandEl.removeEventListener('buttonup', this.rightUpHandler);

                    state.controlBarEl.object3D.visible = false;
                }
            }
        },
        handHandler: function handHandler(handedness, upDown, state, evt) {
            const gamepadLeft = state.leftHandEl.components['tracked-controls'].controller.gamepad;
            if (gamepadLeft && gamepadLeft.buttons) {
                state.isAnyPressedLeft = false;
                const buttonsLeft = gamepadLeft.buttons;
                for (let i = 0; i < buttonsLeft.length; ++i) {   // not a JavaScript array
                    if (buttonsLeft[i].pressed) {
                        state.isAnyPressedLeft = true;
                    }
                }
            } else if ('LEFT' === handedness) {
                state.isAnyPressedLeft = 'DOWN' === upDown;   // hack
            }

            const gamepadRight = state.rightHandEl.components['tracked-controls'].controller.gamepad;
            if (gamepadRight && gamepadRight.buttons) {
                state.isAnyPressedRight = false;
                const buttonsRight = gamepadRight.buttons;
                for (let i = 0; i < buttonsRight.length; ++i) {   // not a JavaScript array
                    if (buttonsRight[i].pressed) {
                        state.isAnyPressedRight = true;
                    }
                }
            } else if ('RIGHT' === handedness) {
                state.isAnyPressedRight = 'DOWN' === upDown;   // hack
            }

            if (state.isAnyPressedLeft && state.isAnyPressedRight) {
                state.controlSubmode = 'BOTH';
            } else if (state.isAnyPressedLeft) {
                state.controlSubmode = 'LEFT';
            } else if (state.isAnyPressedRight) {
                state.controlSubmode = 'RIGHT';
            } else {
                state.controlSubmode = 'NONE';
            }
        },
        controlBarToNeutral: function (state) {
            if (state.controlBarEl) {
                const cameraPos = state.cameraEl.getAttribute("position");
                state.controlNeutralHeight = cameraPos.y - HUMAN_EYE_ELBOW_DISTANCE;
                state.controlBarEl.setAttribute('position', {x: 0, y: state.controlNeutralHeight, z: -0.4});
                state.controlBarEl.setAttribute('rotation', {x: 0, y: 0, z: 90});
                state.xSetting = 0;
                state.zSetting = 0;

                if (! sessionStorage.getItem('previousWorld')) {
                    const bodyEl = document.getElementById('body');
                    let neutralIndicatorEl = bodyEl.querySelector("#neutralIndicator");
                    if (!neutralIndicatorEl) {
                        neutralIndicatorEl = document.createElement('a-lines');
                        neutralIndicatorEl.setAttribute('id', 'neutralIndicator');

                        const points = gosper(4, 0.3);
                        neutralIndicatorEl.setAttribute('points', points.join());
                        neutralIndicatorEl.setAttribute('color', 'white');
                        neutralIndicatorEl.setAttribute('opacity', '0.30');

                        bodyEl.appendChild(neutralIndicatorEl);
                    }
                    neutralIndicatorEl.setAttribute('position', {x: 0.04, y: state.controlNeutralHeight, z: -0.565});
                }
            }
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
            goFullscreenLandscape();

            let postlaunchHelp = AFRAME.scenes[0].querySelector('#postlaunchHelp');
            if (postlaunchHelp && postlaunchHelp.src) {
                let postlaunchHelpAudio = new Howl({src: [postlaunchHelp.src]});
                setTimeout(() => {
                    postlaunchHelpAudio.play();
                }, 60000);
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
                setTimeout(this.showControlsReminder.bind(this, state), 10000);
            }
        },
        showControlsReminder: function (state) {
            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            let intro = document.getElementById('intro');
            if (prelaunchHelp && (!intro || AFRAME.scenes[0].is("vr-mode")) && !state.isFlying) {
                state.controlsReminderDisplayed = true;
                if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected() || AFRAME.utils.device.isMobileVR()) {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nTilt left: turn left\nTilt right: turn right\nUp: climb & slow down\nDown: dive & speed up\nTrigger, button or touchpad: launch");
                } else if (AFRAME.utils.device.isMobile()) {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nRoll your device left: turn left\nRoll your device right: turn right\nTilt up: climb & slow down\nTilt down: dive & speed up\nTap screen: launch");
                } else {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nA: turn left\nD: turn right\nW: climb (& slow down)\nS: dive (& speed up)\nSpace bar: launch");
                }
            }
        },

        iterate: function (state, action) {
            // A pause in the action is better than flying blind
            action.timeDelta = Math.min(action.timeDelta, 100);
            state.time += action.timeDelta * state.difficulty;

            switch (state.controlMode) {
                case "HEAD":
                    let cameraRotation = state.cameraEl.getAttribute('rotation');
                    if (!cameraRotation) {
                        console.warn("camera rotation not available");
                        return;
                    }

                    let cameraRotX = isMagicWindow() ? cameraRotation.x + 20 : cameraRotation.x;
                    state.xSetting = cameraRotX;
                    state.zSetting = cameraRotation.z;
                    break;
                case "HANDS":
                    const leftHandPos = state.leftHandEl.getAttribute("position");
                    const rightHandPos = state.rightHandEl.getAttribute("position");
                    switch (state.controlSubmode) {
                        case "BOTH":
                            let {position, rotation} = barFromHands(leftHandPos, rightHandPos);

                            state.controlBarEl.setAttribute('position', position);
                            state.controlBarEl.setAttribute('rotation', {x:rotation.x, y:rotation.y, z:rotation.z+90});

                            state.xSetting = (position.y - state.controlNeutralHeight) * 150;
                            state.zSetting = rotation.z;
                            break;
                        case "LEFT":
                            const leftHandRot = state.leftHandEl.getAttribute('rotation');

                            state.controlBarEl.setAttribute('position', leftHandPos);
                            state.controlBarEl.setAttribute('rotation', leftHandRot);

                            state.xSetting = (leftHandPos.y - state.controlNeutralHeight) * 150;
                            state.zSetting = leftHandRot.z + 90;
                            break;
                        case "RIGHT":
                            const rightHandRot = state.rightHandEl.getAttribute('rotation');

                            state.controlBarEl.setAttribute('position', rightHandPos);
                            state.controlBarEl.setAttribute('rotation', rightHandRot);

                            state.xSetting = (rightHandPos.y - state.controlNeutralHeight) * 150;
                            state.zSetting = rightHandRot.z - 90;
                            break;
                        case "NONE":
                            break;
                    }
                    break;
            }
            let xDiff = state.xSetting - state.gliderRotationX;
            let xChange = (xDiff + Math.sign(xDiff)*15) * (action.timeDelta / 1000);
            if (Math.abs(xChange) > Math.abs(xDiff)) {
                xChange = xDiff;
            }
            let newXrot = state.gliderRotationX + xChange;
            newXrot = Math.max(newXrot, -75);
            newXrot = Math.min(newXrot, 75);
            state.gliderRotationX = newXrot;

            let zDiff = state.zSetting - state.gliderRotationZ;
            let zChange = (zDiff + Math.sign(zDiff)*15) * (action.timeDelta / 1000);
            if (Math.abs(zChange) > Math.abs(zDiff)) {
                zChange = zDiff;
            }
            let newZrot = state.gliderRotationZ + zChange;
            newZrot = Math.max(newZrot, -70);
            newZrot = Math.min(newZrot, 70);
            state.gliderRotationZ = newZrot;

            let deltaHeading = state.gliderRotationZ * action.timeDelta / 1000;
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

                state.gliderEl.setAttribute('raycaster', 'far', state.gliderSpeed/4);
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

        adjustForMagicWindow: function (wingEl) {
            if (! isMagicWindow()) {
                wingEl.object3D.rotation.x = 0;
                wingEl.object3D.scale.set(1, 1, 1);
            } else {
                wingEl.object3D.rotation.x = THREE.Math.degToRad(-30.0);
                wingEl.object3D.scale.set(1, 1, 3);
            }
        },

        adjustHudForVR: function (hudEl) {
            if (AFRAME.utils.device.isMobile()) {
                hudEl.object3D.position.x = 0.20;
                hudEl.object3D.position.y = 0.30;
            } else {
                hudEl.object3D.position.x = 0.20;
                hudEl.object3D.position.y = 0.42;
            }
            hudEl.object3D.rotation.x = THREE.Math.degToRad(30.0);
            hudEl.object3D.rotation.y = THREE.Math.degToRad(-20.0);
        },

        adjustHudForFlat: function (hudEl) {
            if (isDesktop()) {
                hudEl.object3D.position.x = 0.85;
                hudEl.object3D.position.y = 0.5;
                hudEl.object3D.rotation.x = 0.0;
                hudEl.object3D.rotation.y = 0.0;
            } else {
                hudEl.object3D.position.x = 0.70;
                hudEl.object3D.position.y = 0.20;
                hudEl.object3D.rotation.x = THREE.Math.degToRad(30.0);
                hudEl.object3D.rotation.y = THREE.Math.degToRad(-20.0);
            }
        }
    },

    computeState: function (newState, payload) {
        try {
            let oldQuestComplete = newState.questComplete;
            newState.questComplete = newState.numYellowStars <= 0 || newState.stars / newState.numYellowStars >= 0.95;
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
