// state.js - state model for Elfland Glider
// Copyright © 2017 P. Douglas Reeder

AFRAME.registerState({
    initialState: {
        stars: 0,
        questComplete: false
    },

    handlers: {
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
