// state.js - state model for Elfland Glider
// Copyright © 2017 P. Douglas Reeder
//
// <a-entity id="glider" bind__position="gliderPosition" bind__rotation="gliderRotation" glider-tick-state>
//     <a-entity camera look-controls wasd-controls></a-entity>
//     <a-entity laser-controls="hand: right"></a-entity>
// </a-entity>


AFRAME.registerState({
    initialState: {
        gliderEl: null,
        cameraEl: null,
        time: 0,
        gliderPosition: {x:-30, y:15, z:30},
        gliderRotation: {x: 0, y:-45, z:0},
        isFlying: true,
        gliderSpeed: 5,
        stars: 0,
        questComplete: false,
        inventory: {},   // keyed by object ID
        hudVisible: false,
        hudText: ""
    },

    handlers: {
        setGliderEl: function (state, gliderEl) {
            state.gliderEl = gliderEl;
            state.cameraEl = gliderEl.querySelector('[camera]');

            // state doesn't have an init, so we'll register this here.
            document.addEventListener('keydown', function(evt) {
                console.log('keydown:', evt.code);
                var cameraRotation = state.cameraEl.getAttribute('rotation');
                switch (evt.code) {
                    case 'KeyA':
                    case 'ArrowLeft':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z+1});
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        state.cameraEl.setAttribute('rotation', {x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z-1});
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
                let xDiff = cameraRotation.x - state.gliderRotation.x;
                let xChange = (xDiff + Math.sign(xDiff)*15) * (action.timeDelta / 1000);
                if (Math.abs(xChange) > Math.abs(xDiff)) {
                    xChange = xDiff;
                }
                let newXrot = state.gliderRotation.x + xChange;
                newXrot = Math.max(newXrot, -60);
                newXrot = Math.min(newXrot, 60);
                state.gliderRotation.x = newXrot;

                let deltaHeading = cameraRotation.z * action.timeDelta / 1000;
                state.gliderRotation.y = (state.gliderRotation.y + deltaHeading + 180) % 360 - 180;

                let distance = state.gliderSpeed * action.timeDelta / 1000;

                let verticalAngleRad = state.gliderRotation.x/180*Math.PI;
                state.gliderPosition.y += distance * Math.sin(verticalAngleRad);

                let horizontalDistance = distance * Math.cos(verticalAngleRad);
                let horizontalAngleRad = (state.gliderRotation.y + 90)/180*Math.PI;
                state.gliderPosition.x += horizontalDistance * Math.cos(horizontalAngleRad);
                state.gliderPosition.z -= horizontalDistance * Math.sin(horizontalAngleRad);

                state.hudText = (distance * Math.sin(verticalAngleRad)).toFixed(2) + "   " + horizontalDistance.toFixed(2);
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

AFRAME.registerComponent('glider-tick-state', {
    init: function () {
        AFRAME.scenes[0].emit('setGliderEl', this.el);
    },

    tick: function (time, timeDelta) {
        AFRAME.scenes[0].emit('iterate', {time: time, timeDelta: timeDelta});
    }
});
