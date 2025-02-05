// state.js - state model for Elfland Glider
// Copyright © 2017-2025 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//

import './shim/requestIdleCallback'
import {goFullscreenLandscape, isDesktop, isMagicWindow, calcPosChange, pokeEnvironmentalSound} from './elfland-utils'

const GRAVITY = 9.807;   // m/s^2
const HUMAN_EYE_ELBOW_DISTANCE = 0.45;   // m
const DIFFICULTY_VR = 0.75;
const DIFFICULTY_MAGIC_WINDOW = 0.6;
const DIFFICULTY_KEYBOARD = 0.5;
const POWERUP_BOOST = 16;
const BAD_CRASH_SPEED = 30;
const MAX_STICK_DISTANCE_SQ = 0.30 * 0.30;   // m^2
const MAX_METER_PER_SEC = 0.5;
const MAX_RAD_PER_SEC = 0.05 * 2 * Math.PI;

AFRAME.registerState({
    initialState: {
        armatureEl: null,
        gliderEl: null,
        cameraEl: null,
        leftControllerEl: null,
        rightControllerEl: null,
        leftHandEl: null,
        rightHandEl: null,
        controllerConnections: {},
        isAnyPressedLeft: false,
        isAnyPressedRight: false,
        xSetting: 0,
        zSetting: 0,
        controlStickEl: null,
        controlNeutralHeight: 1.15,
        controlMode: 'HEAD',   // or 'HANDS'
        controlSubmode: 'NONE',   // or 'LEFT_CONTROLLER', 'RIGHT_CONTROLLER', 'LEFT_HAND' or 'RIGHT_HAND'
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
        hudAirspeedAngle: 0,
        hudAirspeedColor: 'forestgreen',
        controlsReminderDisplayed: false,
        debug: false   // no way to enable this yet
    },

    nonBindedStateKeys: ['armatureEl', 'gliderEl', 'cameraEl',
        'leftControllerEl', 'rightControllerEl', 'leftHandEl', 'rightHandEl',
        'controllerConnections', 'isAnyPressedLeft', 'isAnyPressedRight',
        'xSetting', 'zSetting', 'controlStickEl',
        'controlNeutralHeight', 'controlMode', 'controlSubmode',
        'gliderPositionStart', 'gliderRotationYStart'],

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
            this.cacheSound(state, '../assets/411460__inspectorj__power-up-bright-a.mp3', 1.0, 'powerup');

            console.log("hasNativeWebXRImplementation:", window.hasNativeWebXRImplementation);
            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
            console.log("isMobile:", AFRAME.utils.device.isMobile());
            console.log("isMobileVR:", AFRAME.utils.device.isMobileVR());

            // It's best to re-use ThreeJS objects and not store objects in state.
            this.quaternion = new THREE.Quaternion();
            this.euler = new THREE.Euler();

            state.armatureEl = armatureEl;
            state.gliderEl = armatureEl.querySelector('#glider');
            state.cameraEl = armatureEl.querySelector('[camera]');

            let dustEl = AFRAME.scenes[0].querySelector('a-dust');
            if (dustEl) {
                requestIdleCallback(() => {   // delays setup until there's some slack time
                    dustEl.components.dust.setCamera(state.armatureEl);
                }, {timeout: 10_000});
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
                    this.cacheAndPlaySound(state, '../assets/198876__bone666138__crash.mp3');

                    setTimeout(() => {
                        if (state.gliderSpeed >= BAD_CRASH_SPEED) {
                            sessionStorage.setItem('returnWorld', location.pathname);
                            location.assign('../ginnungagap/');
                        } else {
                            // console.log("setting start position", state.gliderPositionStart);
                            state.gliderPosition.x = state.gliderPositionStart.x;
                            state.gliderPosition.y = state.gliderPositionStart.y;
                            state.gliderPosition.z = state.gliderPositionStart.z;
                            state.gliderRotationX = 0;
                            state.gliderRotationY = state.gliderRotationYStart;
                            state.gliderSpeed = 5;
                            this.controlStickToNeutral(state);
                            state.hudAirspeedAngle = 0;
                            state.hudAirspeedColor = 'forestgreen';
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
                        this.playSound(state, 'powerup');
                    } else if (el.classList.contains('star')) {
                        ++state.stars;
                        console.log("collected star", state.stars, "of", state.numYellowStars);
                        el.parentNode?.removeChild(el);
                        this.playSound(state, 'ding');
                    } else if ('key' === el.id) {
                        state.questComplete = true;
                        this.cacheAndPlaySound(state, '../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3');
                        el.parentNode?.removeChild(el);
                        const keyEnt = document.createElement('a-entity');
                        keyEnt.setAttribute('id', 'keyCaptured');
                        keyEnt.setAttribute('gltf-model', '#keyModel');
                        keyEnt.setAttribute('position', '-0.85 0.20 -1.00');
                        keyEnt.setAttribute('rotation', '0 0 90');
                        keyEnt.setAttribute('scale', '10 10 10');
                        state.gliderEl.appendChild(keyEnt);
                        for (const entity of document.querySelectorAll('[dark-elf]')) {
                            console.info("dark elf pursuing");
                            entity.setAttribute('dark-elf', 'goalSelector', '#armature');
                        }
                    } else if (el.classList.contains('proximitySound')) {
                        let url = el.getAttribute('data-sound-url');
                        let volume = el.getAttribute('data-sound-volume') || 1.0;
                        if (url) {
                            this.cacheAndPlaySound(state, url, volume);
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
                       if (! /ginnungagap/.test(location.pathname)) {
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

            state.leftControllerEl = document.getElementById("leftController");
            state.rightControllerEl = document.getElementById("rightController");
            if (isDesktop()) {
                state.leftControllerEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
                state.rightControllerEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
            }

            this.leftDownHandler = this.buttonHandler.bind(this, 'LEFT', 'DOWN', state);
            this.leftUpHandler = this.buttonHandler.bind(this, 'LEFT', 'UP', state);
            this.rightDownHandler = this.buttonHandler.bind(this, 'RIGHT', 'DOWN', state);
            this.rightUpHandler = this.buttonHandler.bind(this, 'RIGHT', 'UP', state);

            state.leftHandEl = document.getElementById('leftHand');
            state.rightHandEl = document.getElementById('rightHand');

            this.leftPinchStartedHandler = this.pinchStarted.bind(this, 'LEFT_HAND', state);
            this.rightPinchStartedHandler = this.pinchStarted.bind(this, 'RIGHT_HAND', state);

            state.controlStickEl = document.getElementById('controlStick');
            this.controlStickToNeutral(state);
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
            if (state.controllerConnections.leftController || state.controllerConnections.rightController ||
              state.controllerConnections.leftHand || state.controllerConnections.rightHand) {
                state.controlMode = 'HANDS';
            } else {
                state.controlMode = 'HEAD';
            }
            if (state.controlMode !== oldControlMode) {
                console.log("changed control mode from", oldControlMode, "to", state.controlMode);
                if (state.controlMode === 'HANDS') {
                    state.leftControllerEl?.addEventListener('buttondown', this.leftDownHandler);
                    state.leftControllerEl?.addEventListener('buttonup', this.leftUpHandler);
                    state.rightControllerEl?.addEventListener('buttondown', this.rightDownHandler);
                    state.rightControllerEl?.addEventListener('buttonup', this.rightUpHandler);
                    state.leftHandEl?.addEventListener('pinchstarted', this.leftPinchStartedHandler);
                    state.rightHandEl?.addEventListener('pinchstarted', this.rightPinchStartedHandler);

                    state.controlSubmode = 'NONE';
                    state.controlStickEl.object3D.visible = true;
                } else if (state.controlMode === 'HEAD') {
                    state.leftControllerEl?.removeEventListener('buttondown', this.leftDownHandler);
                    state.leftControllerEl?.removeEventListener('buttonup', this.leftUpHandler);
                    state.rightControllerEl?.removeEventListener('buttondown', this.rightDownHandler);
                    state.rightControllerEl?.removeEventListener('buttonup', this.rightUpHandler);
                    state.leftHandEl?.removeEventListener('pinchstarted', this.leftPinchStartedHandler);
                    state.rightHandEl?.removeEventListener('pinchstarted', this.rightPinchStartedHandler);

                    state.controlStickEl.object3D.visible = false;
                }
            }
        },
        buttonHandler: function handHandler(handedness, upDown, state, evt) {
            const wasAnyPressedLeft = state.isAnyPressedLeft;
            const trackedControlsLeft = state.leftControllerEl?.components['tracked-controls'];
            const buttonsLeft = trackedControlsLeft &&
                    trackedControlsLeft.controller &&
                    trackedControlsLeft.controller.gamepad &&
                    trackedControlsLeft.controller.gamepad.buttons;
            if (buttonsLeft) {
                state.isAnyPressedLeft = false;
                for (let i = 0; i < buttonsLeft.length; ++i) {   // not a JavaScript array
                    if (buttonsLeft[i].pressed) {
                        state.isAnyPressedLeft = true;
                    }
                }
            } else if ('LEFT' === handedness) {
                state.isAnyPressedLeft = 'DOWN' === upDown;   // hack
            }

            const wasAnyPressedRight = state.isAnyPressedRight;
            const trackedControlsRight = state.rightControllerEl?.components['tracked-controls'];
            const buttonsRight = trackedControlsRight &&
                    trackedControlsRight.controller &&
                    trackedControlsRight.controller.gamepad &&
                    trackedControlsRight.controller.gamepad.buttons;
            if (buttonsRight) {
                state.isAnyPressedRight = false;
                for (let i = 0; i < buttonsRight.length; ++i) {   // not a JavaScript array
                    if (buttonsRight[i].pressed) {
                        state.isAnyPressedRight = true;
                    }
                }
            } else if ('RIGHT' === handedness) {
                state.isAnyPressedRight = 'DOWN' === upDown;   // hack
            }

            if (state.isAnyPressedLeft && ! wasAnyPressedLeft) {
                switch (state.controlSubmode) {
                    case 'LEFT_CONTROLLER':
                        state.controlSubmode = 'NONE';
                        break;
                    case 'RIGHT_CONTROLLER':
                    case 'LEFT_HAND':
                    case 'RIGHT_HAND':
                    case 'NONE':
                        state.controlSubmode = 'LEFT_CONTROLLER';
                        break;
                }
            } else if (state.isAnyPressedRight && ! wasAnyPressedRight) {
                switch (state.controlSubmode) {
                    case 'RIGHT_CONTROLLER':
                        state.controlSubmode = 'NONE';
                        break;
                    case 'LEFT_CONTROLLER':
                    case 'LEFT_HAND':
                    case 'RIGHT_HAND':
                    case 'NONE':
                        state.controlSubmode = 'RIGHT_CONTROLLER';
                        break;
                }
            }
            console.log(`controllerHandler ${handedness} ${upDown} controlSubmode:`, state.controlSubmode);
        },
        pinchStarted: function (inputSource, state, evt) {
            if (state.controlSubmode !== inputSource) {
                const stickPosition = state.controlStickEl?.object3D?.position;
                if (stickPosition?.distanceToSquared?.(evt.detail?.position) <= MAX_STICK_DISTANCE_SQ) {
                    state.controlMode = 'HANDS';
                    state.controlSubmode = inputSource;
                }   // TODO: else play sad sound?
            } else {
                state.controlMode = 'HANDS';
                state.controlSubmode = 'NONE';
            }
            console.info(`${evt.type} ${inputSource} controlSubmode is now`, state.controlSubmode);
        },

        controlStickToNeutral: function (state) {
            state.controlSubmode = 'NONE';
            if (state.cameraEl) {
                const cameraPos = state.cameraEl.object3D?.position;
                if (cameraPos?.y > 0.50) {   // sanity check, camera might be at 0,0,0
                    state.controlNeutralHeight = cameraPos.y - HUMAN_EYE_ELBOW_DISTANCE;
                }
            }
            if (state.controlStickEl) {
                state.controlStickEl.setAttribute('position', {x: 0, y: state.controlNeutralHeight, z: -0.4});
                state.controlStickEl.object3D.quaternion.set(0, 0, 0, 1);
                state.xSetting = 0;
                state.zSetting = 0;
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
                this.cacheSound(state, '../assets/393633__daronoxus__ding.mp3', 1.0, 'ding');
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
                setTimeout(() => {
                    this.cacheAndPlaySound(state, postlaunchHelp.src)
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
            const existingHelp = prelaunchHelp?.getAttribute('value');
            if (prelaunchHelp && !existingHelp && (!intro || AFRAME.scenes[0].is("vr-mode")) && !state.isFlying) {
                state.controlsReminderDisplayed = true;
                if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected() || AFRAME.utils.device.isMobileVR()) {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nTilt left: turn left\nTilt right: turn right\nTilt back: climb & slow down\nTilt forward: dive & speed up\nTrigger, button or touchpad: launch");
                } else if (AFRAME.utils.device.isMobile()) {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nRoll your device left: turn left\nRoll your device right: turn right\nTilt up: climb & slow down\nTilt down: dive & speed up\nTap screen: launch");
                } else {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nA: turn left\nD: turn right\nW: climb (& slow down)\nS: dive (& speed up)\nSpace bar: launch");
                }
            }
        },

        iterate: function (state, action) {
            // If frames are dropped, ensures the user sees a pause in the action rather than flying blind.
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
                    let quaternion;
                    switch (state.controlSubmode) {
                        case "LEFT_CONTROLLER":
                            state.controlStickEl.object3D?.quaternion?.copy(state.leftControllerEl.object3D.quaternion);
                            state.controlStickEl.object3D.rotateX(-Math.PI/2);
                            quaternion = state.controlStickEl.object3D?.quaternion;

                            const leftControllerPos = state.leftControllerEl?.getAttribute("position");
                            state.controlStickEl.setAttribute('position', leftControllerPos);
                           break;
                        case "RIGHT_CONTROLLER":
                            state.controlStickEl.object3D?.quaternion?.copy(state.rightControllerEl.object3D.quaternion);
                            state.controlStickEl.object3D.rotateX(-Math.PI/2);
                            quaternion = state.controlStickEl.object3D?.quaternion;

                            const rightControllerPos = state.rightControllerEl?.getAttribute("position");
                            state.controlStickEl.setAttribute('position', rightControllerPos);
                            break;
                        case "LEFT_HAND":
                        case "RIGHT_HAND":
                            let finger, sign;
                            if ('LEFT_HAND' === state.controlSubmode) {
                                finger = state.leftHandEl?.object3D.getObjectByName('middle-finger-phalanx-proximal') ||
                                  state.leftHandEl?.object3D.getObjectByName('index-finger-phalanx-proximal');
                                sign = -1;
                            } else {
                                finger = state.rightHandEl?.object3D.getObjectByName('middle-finger-phalanx-proximal') ||
                                  state.rightHandEl?.object3D.getObjectByName('index-finger-phalanx-proximal');
                                sign = 1;
                            }
                            if (finger?.quaternion?.isQuaternion && Number.isFinite(finger.quaternion.x)
                              && Number.isFinite(finger.quaternion.y) && Number.isFinite(finger.quaternion.z)
                              && Number.isFinite(finger.quaternion.w)) {
                                state.controlStickEl.object3D?.quaternion?.copy(finger.quaternion);
                                state.controlStickEl.object3D.rotateZ(sign * Math.PI/2);
                                quaternion = state.controlStickEl.object3D?.quaternion;
                            }
                            if (Number.isFinite(finger?.position?.x) && Number.isFinite(finger?.position?.y)
                                && Number.isFinite(finger?.position?.z)) {
                                state.controlStickEl.object3D?.position?.copy(finger.position);
                                state.controlStickEl.object3D.position.x -= sign * 0.04;
                            }
                            break;
                        case "NONE":
                            state.controlStickEl?.object3D?.position?.lerp?.(
                              {x: 0, y: state.controlNeutralHeight, z: -0.4},
                              MAX_METER_PER_SEC * action.timeDelta / 1000);

                            this.quaternion.identity();
                            state.controlStickEl?.object3D?.quaternion?.rotateTowards(
                                this.quaternion, MAX_RAD_PER_SEC * action.timeDelta / 1000);
                            quaternion = state.controlStickEl?.object3D?.quaternion;
                            break;
                        default:
                            console.error(`unsupported controlSubmode:`, controlSubmode);
                    }

                    this.euler.setFromQuaternion(quaternion, 'XZY');
                    state.xSetting = this.euler.x * 180 / Math.PI;
                    this.euler.setFromQuaternion(quaternion, 'ZXY');
                    state.zSetting = this.euler.z * 180 / Math.PI;
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

                state.hudAirspeedAngle = Math.min(state.gliderSpeed * 9, 359);
                state.hudAirspeedColor = state.gliderSpeed < BAD_CRASH_SPEED ? 'forestgreen' : 'goldenrod';

                state.gliderEl.setAttribute('raycaster', 'far', state.gliderSpeed/4);
            }
        },

        cacheSound(_state, url, volume = 1.0, alias) {
            if (!this.sounds) {
                this.sounds = {};
            }
            if (! this.sounds[url]) {
                this.sounds[url] = new Howl({src: url, volume: volume, autoplay: false});
            }
            if (alias) {
                this.sounds[alias] = this.sounds[url];
            }
        },

        playSound(_state, urlOrAlias) {
            this.sounds?.[urlOrAlias]?.play();
        },

        cacheAndPlaySound(_state, url, volume = 1.0, alias) {
            if (!this.sounds) {
                this.sounds = {};
            }
            if (this.sounds[url]) {
                this.sounds[url].play();
            } else {
                this.sounds[url] = new Howl({src: url, volume: volume, autoplay: true});
                this.sounds[alias] = this.sounds[url];
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
                wingEl.object3D.rotation.x = THREE.MathUtils.degToRad(-30.0);
                wingEl.object3D.scale.set(1, 1, 3);
            }
        },

        adjustHudForVR: function (hudEl) {
            if (AFRAME.utils.device.isMobile()) {
                hudEl.object3D.position.x = 0.30;
                hudEl.object3D.position.y = 0.30;
            } else {
                hudEl.object3D.position.x = 0.40;
                hudEl.object3D.position.y = 0.42;
            }
            hudEl.object3D.rotation.x = THREE.MathUtils.degToRad(25.0);
            hudEl.object3D.rotation.y = THREE.MathUtils.degToRad(-15.0);
        },

        adjustHudForFlat: function (hudEl) {
            if (isDesktop()) {
                hudEl.object3D.position.x = 0.85;
                hudEl.object3D.position.y = 0.45;
                hudEl.object3D.rotation.x = 0.0;
                hudEl.object3D.rotation.y = 0.0;
            } else {
                hudEl.object3D.position.x = 0.70;
                hudEl.object3D.position.y = 0.15;
                hudEl.object3D.rotation.x = THREE.MathUtils.degToRad(15.0);
                hudEl.object3D.rotation.y = THREE.MathUtils.degToRad(-20.0);
            }
        }
    },

    computeState: function (newState, payload) {
        try {
            if (!newState.questComplete) {
                newState.questComplete = newState.numYellowStars <= 0 || newState.stars / newState.numYellowStars >= 0.95;
                if (newState.questComplete) {
                    AFRAME.scenes[0].emit('cacheAndPlaySound', '../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3');
                }
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
