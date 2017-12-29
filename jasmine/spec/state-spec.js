// state.js - unit tests for state model for Elfland Glider
// Copyright © 2017 P. Douglas Reeder; Licensed under the GNU GPL-3.0

describe("state", function () {
    let state;
    const action = {time: 0, timeDelta: 10};

    beforeEach(function() {
        state = {
            cameraEl: new MockElement({rotation: {x: 0, y: 0, z: 0}}),
            gliderPosition: {x: 0, y: 10, z: 10},
            gliderRotation: {x: 0, y: 0, z: 0},
            isFlying: true,
            gliderSpeed: 1
        };
    });

    it("should fly a straight & level course along the z-axis", function () {
        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotation.x).toBeCloseTo(0, 3);
        expect(state.gliderRotation.y).toBeCloseTo(0, 3);
        expect(state.gliderRotation.z).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toEqual(1);
    });

    it("should fly a straight & level course diagonally", function () {
        state.gliderRotation.y = -45;

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotation).toEqual({x: 0, y: -45, z: 0});

        expect(state.gliderPosition.x).toBeCloseTo(0.00707106781186548, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99292893218813, 5);

        expect(state.gliderSpeed).toEqual(1);
    });

    it("should climb in a straight line and decelerate", function () {
        state.gliderRotation.x = 30;
        state.cameraEl.setAttribute('rotation', {x: 30, y: 0, z: 0});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotation).toEqual({x: 30, y: 0, z: 0});

        expect(state.gliderPosition.x).toBeCloseTo(0, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10.005, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99133974596216, 5);

        expect(state.gliderSpeed).toBeCloseTo(0.99686838699709, 3);
    });

    it("should turn according to head tilt", function () {
        state.gliderRotation.z = 0;
        state.cameraEl.setAttribute('rotation', {x: 0, y: 0, z: 30});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotation.x).toBeCloseTo(0, 3);
        expect(state.gliderRotation.y).toBeCloseTo(0.3, 3);
        expect(state.gliderRotation.z).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 3);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toBeCloseTo(1, 3);
    });

    it("should adjust glider pitch according to head pitch", function () {
        state.gliderRotation.x = 0;
        state.cameraEl.setAttribute('rotation', {x: 30, y: 0, z: 0});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotation.x).toBeCloseTo(0.45, 3);   // 30+15 degrees * 0.01
        expect(state.gliderRotation.y).toBeCloseTo(0, 3);
        expect(state.gliderRotation.z).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 3);
        expect(state.gliderPosition.y).toBeCloseTo(10, 3);   // will be slightly higher
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toBeCloseTo(1, 3);
    });

    it("should adjust glider pitch to match head pitch in about a second", function () {
        state.gliderRotation.x = 0;
        state.cameraEl.setAttribute('rotation', {x: 30, y: 0, z: 0});

        for (i=0; i<90; ++i) {
            stateParam.handlers.iterate(state, action);
        }

        expect(state.gliderRotation.x).toBeLessThan(29);

        for (i=0; i<20; ++i) {
            stateParam.handlers.iterate(state, action);
        }

        expect(state.gliderRotation.x).toBeCloseTo(30, 3);
        expect(state.gliderRotation.y).toBeCloseTo(0, 3);
        expect(state.gliderRotation.z).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 3);
        expect(state.gliderPosition.y).toBeGreaterThan(10);
        expect(state.gliderPosition.z).toBeCloseTo(9, 0);

        expect(state.gliderSpeed).toBeCloseTo(1, 0);
    });

});
