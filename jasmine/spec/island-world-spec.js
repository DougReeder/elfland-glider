// island-world-spec.js - unit tests for island world for Elfland Glider
// Copyright © 2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0

describe("island-world", function () {
    it("should calculate a position at level of glider", function () {
        let randomSpy = spyOn(Math, 'random').and.returnValues(0, 0.5);

        let islandDouble = {
            height: function () {}
        };
        let heightSpy = spyOn(islandDouble, 'height').and.returnValues(0);

        fairiesPos = componentParam['island-world'].belowGliderPathAboveIsland(islandDouble);

        expect(fairiesPos.x).toBeCloseTo(0, 3);
        expect(fairiesPos.z).toBeCloseTo(400, 3);
        expect(fairiesPos.y).toEqual(100);
        expect(heightSpy).toHaveBeenCalledTimes(1);
    });

    it("should calculate a position below glider but above island", function () {
        let randomSpy = spyOn(Math, 'random').and.returnValues(0.9999, 0);

        let islandDouble = {
            height: function () {}
        };
        let heightSpy = spyOn(islandDouble, 'height').and.returnValues(0);

        fairiesPos = componentParam['island-world'].belowGliderPathAboveIsland(islandDouble);

        expect(fairiesPos.x).toBeCloseTo(25, 0);
        expect(fairiesPos.z).toBeCloseTo(407, 0);
        expect(fairiesPos.y).toBeCloseTo(74.118, 2);
        expect(heightSpy).toHaveBeenCalledTimes(1);
    });

    it("should shorten the distance if the island is too high", function () {
        let randomSpy = spyOn(Math, 'random').and.returnValue(0);

        let islandDouble = {
            height: function () {}
        };
        let heightSpy = spyOn(islandDouble, 'height').and.returnValues(95, 90, 85);

        fairiesPos = componentParam['island-world'].belowGliderPathAboveIsland(islandDouble);

        expect(heightSpy).toHaveBeenCalledTimes(3);
    });
});
