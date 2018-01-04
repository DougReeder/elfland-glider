// state.js - state model for Elfland Glider
// Copyright © 2017 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//

const GRAVITY = 9.807;   // m/s^2

AFRAME.registerState({
    initialState: {
        armatureEl: null,
        cameraEl: null,
        time: 0,
        gliderPosition: {x:-30, y:15, z:30},
        gliderRotationX: 0,
        gliderRotationY: -45,
        isFlying: true,
        gliderSpeed: 5,
        stars: 0,
        questComplete: false,
        inventory: {},   // keyed by object ID
        hudVisible: true,
        hudText: ""
    },

    handlers: {
        setArmatureEl: function (state, armatureEl) {
            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);

            state.armatureEl = armatureEl;
            state.cameraEl = armatureEl.querySelector('[camera]');

            armatureEl.addEventListener('hitstart', function (evt) {
                // console.log('hitstart armature:', evt.detail.intersectedEls);
                evt.detail.intersectedEls.forEach(function (el) {
                   if (el.classList.contains('star')) {
                       console.log("collected star");
                       ++state.stars;
                   } else if (el.components.link) {
                       console.log("hit link");
                   }
                });
            });

            // state doesn't have an init, so we'll register this here.
            document.addEventListener('keydown', function(evt) {
                console.log('keydown:', evt.code);
                var cameraRotation = state.cameraEl.getAttribute('rotation');
                switch (evt.code) {
                    case 'KeyA':
                    case 'ArrowLeft':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z+2});
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z-2});
                        break;
                    case 'KeyW':
                    case 'ArrowUp':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x+1, y: cameraRotation.y, z: cameraRotation.z});
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x-1, y: cameraRotation.y, z: cameraRotation.z});
                        break;
                    case 'Space':
                        state.isFlying = ! state.isFlying;
                        break;
                    case 'Enter':
                        state.hudVisible = ! state.hudVisible;
                        break;
                }
            }, false);
        },

        iterate: function (state, action) {
            state.time = action.time;
            let cameraRotation = state.cameraEl.getAttribute('rotation');
            if (state.isFlying && cameraRotation) {
                let xDiff = cameraRotation.x - state.gliderRotationX;
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

                let distance = state.gliderSpeed * action.timeDelta / 1000;

                let verticalAngleRad = state.gliderRotationX/180*Math.PI;
                let altitudeChange = distance * Math.sin(verticalAngleRad);
                state.gliderPosition.y += altitudeChange;

                let horizontalDistance = distance * Math.cos(verticalAngleRad);
                let horizontalAngleRad = (state.gliderRotationY + 90)/180*Math.PI;
                state.gliderPosition.x += horizontalDistance * Math.cos(horizontalAngleRad);
                state.gliderPosition.z -= horizontalDistance * Math.sin(horizontalAngleRad);

                let speedChange = -Math.sign(altitudeChange) * Math.sqrt(2 * GRAVITY * Math.abs(altitudeChange)) * action.timeDelta / 1000;
                state.gliderSpeed = Math.max(state.gliderSpeed + speedChange, 0.1);
                state.gliderSpeed = Math.min(state.gliderSpeed, 100);

                state.hudText = (state.gliderSpeed).toFixed(1);
            }
        },

        decreaseStars: function (state, action) {
            state.stars -= action.points;
        },
        increaseStars: function (state, action) {
            state.stars += action.points;
        }
    },

    computeState: function (newState, payload) {
        newState.questComplete = newState.stars >= 10;
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
