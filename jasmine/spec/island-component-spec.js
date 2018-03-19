// island-component-spec.js - unit tests for island component for Elfland Glider
// Copyright © 2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0

describe("island-component", function () {
    it("should return 0 height outside island", function () {
        expect(componentParam.mountain.height(-500, -500)).toEqual(0);
        expect(componentParam.mountain.height(500, -500)).toEqual(0);
        expect(componentParam.mountain.height(-500, 500)).toEqual(0);
        expect(componentParam.mountain.height(500, 500)).toEqual(0);
    });

    it("should return small height near edge of island", function () {
        componentParam.mountain.data = {
            color: '#4DBD33',
            shadowColor: "#395D33",
            seaColor: "#006994",
            worldWidth:64,
            worldDepth:64,
            sunPosition: {x: 1, y: 1, z: 1}
        };
        componentParam.mountain.el = new MockElement();
        componentParam.mountain.update();

        expect(componentParam.mountain.height(-499, -499)).toBeLessThanOrEqual(20);
        expect(componentParam.mountain.height(499, -499)).toBeLessThanOrEqual(20);
        expect(componentParam.mountain.height(-499, 499)).toBeLessThanOrEqual(20);
        expect(componentParam.mountain.height(499, 499)).toBeLessThanOrEqual(20);
    });

    it("should return height > 0 for most places in island", function () {
        componentParam.mountain.data = {
            color: '#4DBD33',
            shadowColor: "#395D33",
            seaColor: "#006994",
            worldWidth:64,
            worldDepth:64,
            sunPosition: {x: 1, y: 1, z: 1}
        };
        componentParam.mountain.el = new MockElement();
        componentParam.mountain.update();

        let height1 = componentParam.mountain.height(0, 0);
        let height2 = componentParam.mountain.height(100, 100);
        let height3 = componentParam.mountain.height(-100, 100);
        let height4 = componentParam.mountain.height(100, -100);
        let height5 = componentParam.mountain.height(-100, -100);
        let height6 = componentParam.mountain.height(250, 250);

        expect(Math.max(height1, height2, height3, height4, height5, height6)).toBeGreaterThan(0);
    });


    it("should find a flat location where a building can be placed", function () {
        componentParam.mountain.data = {
            color: '#4DBD33',
            shadowColor: "#395D33",
            seaColor: "#006994",
            worldWidth:64,
            worldDepth:64,
            sunPosition: {x: 1, y: 1, z: 1}
        };
        componentParam.mountain.el = new MockElement();
        componentParam.mountain.update();

        let position = componentParam.mountain.buildingPosition();

        let positionValues = position.split(' ');
        expect(positionValues.length).toEqual(3);
        let x = parseFloat(positionValues[0]);
        let z = parseFloat(positionValues[2]);
        let y = parseFloat(positionValues[1]);
        expect(x).toBeGreaterThan(-500);
        expect(x).toBeLessThan(500);
        expect(z).toBeGreaterThan(-500);
        expect(z).toBeLessThan(500);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThan(2000);

        let largestNearHeight = componentParam.mountain.height(x, z);
        expect(largestNearHeight).toEqual(y);
    });
});
