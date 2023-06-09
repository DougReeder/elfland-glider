/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/elfland-utils.js":
/*!******************************!*\
  !*** ./src/elfland-utils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calcPosChange": () => (/* binding */ calcPosChange),
/* harmony export */   "goFullscreenLandscape": () => (/* binding */ goFullscreenLandscape),
/* harmony export */   "isDesktop": () => (/* binding */ isDesktop),
/* harmony export */   "isMagicWindow": () => (/* binding */ isMagicWindow),
/* harmony export */   "placeholderTexture": () => (/* binding */ placeholderTexture),
/* harmony export */   "pokeEnvironmentalSound": () => (/* binding */ pokeEnvironmentalSound),
/* harmony export */   "setEnvironmentalSound": () => (/* binding */ setEnvironmentalSound)
/* harmony export */ });
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

function placeholderTexture(colorArg = '#808080', width = 1, height = 1) {
    const size = width * height;
    const data = new Uint8Array( 4 * size );

    let color;
    if (colorArg.isColor) {
        color = colorArg;
    } else {
        color = new THREE.Color(colorArg);
    }
    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; ++i ) {
        const stride = i * 4;
        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = 255;
    }

    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;
    return texture;
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


/** Web Monetization */
if (document.monetization)  {
    function handleMonetizationStart(evt) {
        console.log("monetization started:", evt);
    }
    document.monetization.addEventListener('monetizationstart', handleMonetizationStart);

    function handleMonetizationStop(evt) {
        console.log("monetization stopped:", evt);
    }
    document.monetization.addEventListener('monetizationstop', handleMonetizationStop);
} else {
    console.log("no monetization API");
}




/***/ }),

/***/ "./src/shim/requestIdleCallback.js":
/*!*****************************************!*\
  !*** ./src/shim/requestIdleCallback.js ***!
  \*****************************************/
/***/ (() => {

/*!
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
/*
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
window.requestIdleCallback = window.requestIdleCallback ||
  function (cb) {
    return setTimeout(function () {
      var start = Date.now();
      cb({ 
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  }

window.cancelIdleCallback = window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  } 

/***/ }),

/***/ "./src/state.js":
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shim_requestIdleCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shim/requestIdleCallback */ "./src/shim/requestIdleCallback.js");
/* harmony import */ var _shim_requestIdleCallback__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shim_requestIdleCallback__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elfland_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elfland-utils */ "./src/elfland-utils.js");
// state.js - state model for Elfland Glider
// Copyright © 2017-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//




const GRAVITY = 9.807;   // m/s^2
const HUMAN_EYE_ELBOW_DISTANCE = 0.56;   // m
const DIFFICULTY_VR = 0.75;
const DIFFICULTY_MAGIC_WINDOW = 0.6;
const DIFFICULTY_KEYBOARD = 0.5;
const POWERUP_BOOST = 16;
const BAD_CRASH_SPEED = 30;

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
        controlStickEl: null,
        controlNeutralHeight: 0.95,
        controlMode: 'HEAD',   // or 'HANDS'
        controlSubmode: 'NONE',   // or 'LEFT' or 'RIGHT'
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

    nonBindedStateKeys: ['armatureEl', 'gliderEl', 'cameraEl', 'leftHandEl', 'rightHandEl',
        'controllerConnections', 'isAnyPressedLeft', 'xSetting', 'zSetting', 'controlStickEl',
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
                if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)()) {
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
                (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.pokeEnvironmentalSound)();
            });
            AFRAME.scenes[0].addEventListener('exit-vr', (event) => {
                // bodyEl.object3D.position.y = 0;   // Why is this unnecessary?
                this.adjustHudForFlat(hudEl);
                this.adjustForMagicWindow(wingEl);
                if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            });

            if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isDesktop)() && !AFRAME.utils.device.checkHeadsetConnected()) {
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

            state.leftHandEl = document.getElementById("leftHand");
            state.rightHandEl = document.getElementById("rightHand");
            if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isDesktop)()) {
                state.leftHandEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
                state.rightHandEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
            }

            this.leftDownHandler = this.handHandler.bind(this, 'LEFT', 'DOWN', state);
            this.leftUpHandler = this.handHandler.bind(this, 'LEFT', 'UP', state);
            this.rightDownHandler = this.handHandler.bind(this, 'RIGHT', 'DOWN', state);
            this.rightUpHandler = this.handHandler.bind(this, 'RIGHT', 'UP', state);

            state.controlStickEl = document.getElementById('controlStick');
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
                    state.leftHandEl?.addEventListener('buttondown', this.leftDownHandler);
                    state.leftHandEl?.addEventListener('buttonup', this.leftUpHandler);
                    state.rightHandEl?.addEventListener('buttondown', this.rightDownHandler);
                    state.rightHandEl?.addEventListener('buttonup', this.rightUpHandler);

                    this.controlStickToNeutral(state);
                    state.controlStickEl.object3D.visible = true;
                } else if (state.controlMode === 'HEAD') {
                    state.leftHandEl?.removeEventListener('buttondown', this.leftDownHandler);
                    state.leftHandEl?.removeEventListener('buttonup', this.leftUpHandler);
                    state.rightHandEl?.removeEventListener('buttondown', this.rightDownHandler);
                    state.rightHandEl?.removeEventListener('buttonup', this.rightUpHandler);

                    state.controlStickEl.object3D.visible = false;
                }
            }
        },
        handHandler: function handHandler(handedness, upDown, state, evt) {
            const wasAnyPressedLeft = state.isAnyPressedLeft;
            const trackedControlsLeft = state.leftHandEl?.components['tracked-controls'];
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
            const trackedControlsRight = state.rightHandEl?.components['tracked-controls'];
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
                    case 'LEFT':
                        state.controlSubmode = 'NONE';
                        break;
                    case 'RIGHT':
                    case 'NONE':
                        state.controlSubmode = 'LEFT';
                        break;
                }
            } else if (state.isAnyPressedRight && ! wasAnyPressedRight) {
                switch (state.controlSubmode) {
                    case 'RIGHT':
                        state.controlSubmode = 'NONE';
                        break;
                    case 'LEFT':
                    case 'NONE':
                        state.controlSubmode = 'RIGHT';
                        break;
                }
            }
            console.log("controlSubmode:", state.controlSubmode);
        },
        controlStickToNeutral: function (state) {
            state.controlSubmode = 'NONE';
            if (state.controlStickEl) {
                const cameraPos = state.cameraEl.getAttribute("position");
                state.controlNeutralHeight = cameraPos.y - HUMAN_EYE_ELBOW_DISTANCE;
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
            (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.goFullscreenLandscape)();

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

                    let cameraRotX = (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)() ? cameraRotation.x + 20 : cameraRotation.x;
                    state.xSetting = cameraRotX;
                    state.zSetting = cameraRotation.z;
                    break;
                case "HANDS":
                    let quaternion;
                    const leftHandPos = state.leftHandEl?.getAttribute("position");
                    const rightHandPos = state.rightHandEl?.getAttribute("position");
                    switch (state.controlSubmode) {
                        case "LEFT":
                            quaternion = state.leftHandEl.object3D.quaternion;

                            state.controlStickEl.setAttribute('position', leftHandPos);
                           break;
                        case "RIGHT":
                            quaternion = state.rightHandEl.object3D.quaternion;

                            state.controlStickEl.setAttribute('position', rightHandPos);
                            break;
                        case "NONE":
                            this.quaternion.identity();
                            quaternion = this.quaternion;
                            // TODO: slow decay to neutral?
                            break;
                    }
                    state.controlStickEl.object3D?.quaternion?.copy(quaternion)

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

                let posChange = (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.calcPosChange)(state.gliderRotationX, state.gliderRotationY+90, distance);
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
            let posChange = (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.calcPosChange)(verticalAngleDeg, horizontalAngleDeg, action.distance);
            let newPos = {x: state.gliderPosition.x + posChange.x,
                y: state.gliderPosition.y + posChange.y,
                z: state.gliderPosition.z + posChange.z};
            action.el.setAttribute('position', newPos);
            action.el.setAttribute('rotation', 'y', state.gliderRotationY);
        },

        adjustForMagicWindow: function (wingEl) {
            if (! (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)()) {
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
            if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isDesktop)()) {
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************!*\
  !*** ./ginnungagap/ginnungagap.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/elfland-utils */ "./src/elfland-utils.js");
/* harmony import */ var _src_state_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/state.js */ "./src/state.js");
// ginnungagap.js - the boring result of a high-speed crash in Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0





AFRAME.registerComponent('ginnungagap', {
    init: function () {
        let sceneEl = this.el;

        (0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.setEnvironmentalSound)('100495__jakobthiesen__light-rain-in-forest.ogg', 1.0);
        // rain visual is too resource-intensive for mobile
        if ((0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.isDesktop)()) {
            let rain = document.createElement('a-entity');
            rain.setAttribute('particle-system', {preset: 'rain', particleCount: 500});
            rain.setAttribute('bind__position', 'gliderPosition');
            sceneEl.appendChild(rain);
        }

        const maxClouds = (0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.isDesktop)() ? 1200 : 300;
        this.clouds = [];
        let clouds = this.clouds;
        setTimeout(() => {
            // adds clouds all around
            for (let i=Math.floor(maxClouds*0.5); i>0; --i) {
                placeCloud(200 + 1500*i/Math.floor(maxClouds*0.5), 270);
            }
        }, 4);
        // adds cloud in front of glider
        setInterval(placeCloud, 1000);
        function placeCloud(distance=900+Math.random()*300, variation=80) {
            if (clouds.length >= maxClouds) {
                sceneEl.components.pool__clouds.returnEntity(clouds.shift());
            }

            let cloudEl = sceneEl.components.pool__clouds.requestEntity(true);
            let opacity=0;
            cloudEl.setAttribute('material', 'opacity', opacity);
            let intervalID = setInterval( () => {
                opacity += 1 / 2400;
                cloudEl.setAttribute('material', 'opacity', opacity);
                if (opacity >= 0.5) {
                    clearInterval(intervalID);
                }
            }, 16);
            AFRAME.scenes[0].emit('placeInGliderPath', {el: cloudEl, distance: distance, variation:variation});
            // cloudEl.object3D.rotation.z = Math.floor(Math.random()*2) * Math.PI + (Math.random()-0.5) * 0.75;
            cloudEl.object3D.rotation.z = Math.random()*2*Math.PI;
            clouds.push(cloudEl);
        }

        this.armaturePosition = document.getElementById('armature').object3D.position;


        var returnPath = sessionStorage.getItem('returnWorld');
        if (returnPath) {
            var returnPortal = document.getElementById('returnPortal');
            returnPortal.setAttribute('link','href', returnPath);
            returnPortal.setAttribute('link','image', returnPath + 'screenshot.png');
        }

        setInterval( () => {
            let returnPortalEl = document.getElementById('returnPortal');
            returnPortalEl.setAttribute('visible', 'true');
            AFRAME.scenes[0].emit('placeInGliderPath', {el: returnPortalEl, distance: 100, variation:45});
        }, 60000);
    },

    play: function () {
        this.el.emit('launch', "ginnungagap play");
    },

    tick: function () {
        this.clouds.forEach(cloud => {
            if (this.armaturePosition.distanceTo(cloud.object3D.position) > 150) {
                let rotationZ = cloud.object3D.rotation.z;
                cloud.object3D.lookAt(this.armaturePosition);
                cloud.object3D.rotation.z = rotationZ;
            }
        });
    }
});

})();

/******/ })()
;
//# sourceMappingURL=ginnungagap.js.map