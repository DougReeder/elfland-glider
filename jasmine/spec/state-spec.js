// state.js - unit tests for state model for Elfland Glider
// Copyright © 2017 P. Douglas Reeder; Licensed under the GNU GPL-3.0

describe("state", function () {
    let state;
    const action = {time: 0, timeDelta: 10};

    beforeEach(function() {
        state = {
            gliderEl: new MockElement({rotation: {x: 0, y: 0, z: 0}}),
            cameraEl: new MockElement({rotation: {x: 0, y: 0, z: 0}}),
            time: 5000,
            difficulty: 0.5,
            gliderPosition: {x: 0, y: 10, z: 10},
            gliderRotationX: 0,
            gliderRotationY: 0,
            gliderRotationZ: 0,
            isFlying: true,
            gliderSpeed: 1
        };
    });


    it("should allow timeDelta up to 0.1 sec", function () {
        stateParam.handlers.iterate(state, {time: 5100, timeDelta: 100});
        expect(state.time).toEqual(5050);
    });

    it("should cap timeDelta at 0.1 sec", function () {
        stateParam.handlers.iterate(state, {time: 5101, timeDelta: 101});
        expect(state.time).toEqual(5050);
    });


    it("should fly a straight & level course along the z-axis", function () {
        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(0, 3);
        expect(state.gliderRotationY).toBeCloseTo(0, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99, 5);

        expect(state.gliderSpeed).toBeGreaterThan(0.99999);
        expect(state.gliderSpeed).toBeLessThan(1.0);
    });

    it("should fly a straight & level course diagonally", function () {
        state.gliderRotationY = -45;

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationX).toBeCloseTo(0, 3);
        expect(state.gliderRotationY).toBeCloseTo(-45, 3);

        expect(state.gliderPosition.x).toBeCloseTo(0.00707106781186548, 5);
        expect(state.gliderPosition.y).toBeCloseTo(10, 5);
        expect(state.gliderPosition.z).toBeCloseTo(9.99292893218813, 5);

        expect(state.gliderSpeed).toBeGreaterThan(0.99999);
        expect(state.gliderSpeed).toBeLessThan(1.0);
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

    it("should roll glider to match head tilt, when diff is small", function () {
        state.cameraEl.setAttribute('rotation', {x: 0, y: 0, z: 0.15});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationZ).toBeCloseTo(0.15, 3);   // (15° + Δ)/s
    });

    it("should roll glider toward head tilt, when diff is large", function () {
        state.cameraEl.setAttribute('rotation', {x: 0, y: 0, z: 30});

        stateParam.handlers.iterate(state, action);

        expect(state.gliderRotationZ).toBeCloseTo(0.45, 3);   // (15° + Δ)/s
    });

    it("should turn according to glider roll", function () {
        state.gliderRotationZ = 30;
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


    it("should set questComplete true when 0 of 0 stars have been collected", function () {
        state.stars = 0;
        state.numYellowStars = 0;
        state.questComplete = false;

        stateParam.computeState(state, {});

        expect(state.questComplete).toBeTruthy();
    });

    it("should not set questComplete true when 18 of 19 stars have been collected", function () {
        state.stars = 18;
        state.numYellowStars = 19;
        state.questComplete = false;

        stateParam.computeState(state, {});

        expect(state.questComplete).toBeFalsy();
    });

    it("should set questComplete true when 19 of 19 stars have been collected", function () {
        state.stars = 19;
        state.numYellowStars = 19;
        state.questComplete = false;

        stateParam.computeState(state, {});

        expect(state.questComplete).toBeTruthy();
    });

    it("should set questComplete true when 19 of 20 stars have been collected", function () {
        state.stars = 19;
        state.numYellowStars = 20;
        state.questComplete = false;

        stateParam.computeState(state, {});

        expect(state.questComplete).toBeTruthy();
    });
});
