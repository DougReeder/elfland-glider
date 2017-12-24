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
        questComplete: false
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
                }
            }, false);
        },

        iterate: function (state, action) {
            state.time = action.time;
            if (state.isFlying) {
                let cameraRotation = state.cameraEl.getAttribute('rotation');
                let deltaHeading = cameraRotation.z * action.timeDelta / 1000;
                state.gliderRotation.y = (state.gliderRotation.y + deltaHeading + 360) % 360;
                // console.log("cameraRotation.z", cameraRotation.z, deltaHeading, state.gliderRotation.y);

                let distance = state.gliderSpeed * action.timeDelta / 1000;
                let angle = (state.gliderRotation.y + 90)/180*Math.PI;
                state.gliderPosition.x += distance * Math.cos(angle);
                state.gliderPosition.z -= distance * Math.sin(angle);
            //     console.log(action.timeDelta, state.gliderPosition.x, deltaX);
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
