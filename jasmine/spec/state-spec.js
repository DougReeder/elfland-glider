// state.js - unit tests for state model for Elfland Glider
// Copyright © 2017 P. Douglas Reeder; Licensed under the GNU GPL-3.0

describe("state", function () {
    let state;
    const action = {time: 0, timeDelta: 10};

    beforeEach(function() {
        state = {
            cameraEl: new MockElement({rotation: {x: 0, y: 0, z: 0}}),
            gliderPosition: {x: 0, y: 10, z: 10},
            gliderRotationX: 0,
            gliderRotationY: 0,
            isFlying: true,
            gliderSpeed: 1
        };
    });

    it("should fly a straight & level course along the z-axis", function () {
        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(0, 3);
        expect(state.gliderRotationY).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toEqual(1);
    });

    it("should fly a straight & level course diagonally", function () {
        state.gliderRotationY = -45;

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(0, 3);
        expect(state.gliderRotationY).toBeCloseTo(-45, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0.00707106781186548, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99292893218813, 5);

        expect(state.gliderSpeed).toEqual(1);
    });

    it("should climb in a straight line and decelerate", function () {
        state.gliderRotationX = 30;
        state.cameraEl.setAttribute('rotation', {x: 30, y: 0, z: 0});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(30, 3);
        expect(state.gliderRotationY).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10.005, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99133974596216, 5);

        expect(state.gliderSpeed).toBeCloseTo(0.99686838699709, 3);
    });

    it("should turn according to head tilt", function () {
        state.cameraEl.setAttribute('rotation', {x: 0, y: 0, z: 30});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(0, 3);
        expect(state.gliderRotationY).toBeCloseTo(0.3, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 3);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toBeCloseTo(1, 3);
    });

    it("should adjust glider pitch according to head pitch", function () {
        state.gliderRotationX = 0;
        state.cameraEl.setAttribute('rotation', {x: 30, y: 0, z: 0});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(0.45, 3);   // 30+15 degrees * 0.01
        expect(state.gliderRotationY).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 3);
        expect(state.gliderPosition.y).toBeCloseTo(10, 3);   // will be slightly higher
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toBeCloseTo(1, 3);
    });

    it("should adjust glider pitch to match head pitch in about a second", function () {
        state.gliderRotationX = 0;
        state.cameraEl.setAttribute('rotation', {x: 30, y: 0, z: 0});

        for (i=0; i<90; ++i) {
            stateParam.handlers.iterate(state, action);
        }

        expect(state.gliderRotationX).toBeLessThan(29);

        for (i=0; i<20; ++i) {
            stateParam.handlers.iterate(state, action);
        }

        expect(state.gliderRotationX).toBeCloseTo(30, 3);
        expect(state.gliderRotationY).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 3);
        expect(state.gliderPosition.y).toBeGreaterThan(10);
        expect(state.gliderPosition.z).toBeCloseTo(9, 0);

        expect(state.gliderSpeed).toBeCloseTo(1, 0);
    });

    it("should place elements direcly in the path of the glider", function () {
        let thingEl = new MockElement({position: {x: Infinity, y: Infinity, z: Infinity}});

        stateParam.handlers.placeInGliderPath(state, {el: thingEl, distance: 99, variation: 0});

        let position = thingEl.getAttribute('position');
        expect(position.x).toBeCloseTo(0);
        expect(position.y).toBeCloseTo(10);
        expect(position.z).toBeCloseTo(-89);
    });

    it("should place elements near the path of the glider", function () {
        let thingEl = new MockElement({position: {x: Infinity, y: Infinity, z: Infinity}});

        stateParam.handlers.placeInGliderPath(state, {el: thingEl, distance: 99, variation: 80});

        let position = thingEl.getAttribute('position');
        expect(Math.abs(position.x - 0)).toBeLessThan(80);
        expect(Math.abs(position.y - 10)).toBeLessThan(80);
        expect(Math.abs(position.z + 89)).toBeGreaterThan(-35);
        expect(Math.abs(position.z + 89)).toBeLessThan(35);
    });
});