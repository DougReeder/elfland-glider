// elfland-utils-spec.js - unit tests for utilities for Elfland Glider
// Copyright © 2020 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import {barFromHands} from "../../src/elfland-utils.js";

describe("barFromHands", function () {
  it('should calculate hands at the same height, right forward a little, as being level', function () {
    const leftHandPosition = {x: -0.25, y: 0.7, z: -1};
    const rightHandPosition = {x:0.3, y: 0.7, z: -1.1};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(0.025, 6);
    expect(position.y).toBeCloseTo(0.7, 6);
    expect(position.z).toBeCloseTo(-1.05, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(10.304846, 3);
    expect(rotation.z).toBeCloseTo(0, 3);
  });

  it('should calculate hands at the same height, right forward a lot, as being level', function () {
    const leftHandPosition = {x: -0.25, y: 0.8, z: -0.5};
    const rightHandPosition = {x:0.3, y: 0.8, z: -1.5};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(0.025, 6);
    expect(position.y).toBeCloseTo(0.8, 6);
    expect(position.z).toBeCloseTo(-1.00, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(61.18921, 3);
    expect(rotation.z).toBeCloseTo(0, 3);
  });

  it('should calculate hands at the same height, right back a little, as being level', function () {
    const leftHandPosition = {x:-0.35, y: 0.6, z: -1.0};
    const rightHandPosition = {x:0.3, y: 0.6, z: -0.8};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(-0.025, 6);
    expect(position.y).toBeCloseTo(0.6, 6);
    expect(position.z).toBeCloseTo(-0.9, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(-17.10273, 3);
    expect(rotation.z).toBeCloseTo(0, 3);
  });


  it('should calculate left hand up a little as banking right', function () {
    const leftHandPosition = {x:-0.2, y:0.7, z:-0.5};
    const rightHandPosition = {x:0.3, y:0.5, z:-0.5};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(0.05, 6);
    expect(position.y).toBeCloseTo(0.6, 6);
    expect(position.z).toBeCloseTo(-0.5, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(0, 3);
    expect(rotation.z).toBeCloseTo(-21.80141, 3);
  });

  it('should calculate left hand down a lot as banking left', function () {
    const leftHandPosition = {x:-0.15, y:0.4, z:-0.5};
    const rightHandPosition = {x:0.3, y:1.0, z:-0.5};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(0.075, 6);
    expect(position.y).toBeCloseTo(0.7, 6);
    expect(position.z).toBeCloseTo(-0.5, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(0, 3);
    expect(rotation.z).toBeCloseTo(53.1301, 3);
  });


  it('should calculate centroid of right hand up and in front of left', function () {
    const leftHandPosition  = {x:0.1, y:0.5, z:-0.4};
    const rightHandPosition = {x:0.1, y:0.7, z:-0.8};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(0.1, 6);
    expect(position.y).toBeCloseTo(0.6, 6);
    expect(position.z).toBeCloseTo(-0.6, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(87, 0);
    expect(rotation.z).toBeCloseTo(84, 0);
  });


  it('should limit angles if left hand is to the right of right hand', function () {
    const leftHandPosition  = {x:0.5, y: 0.8, z: -1.0};
    const rightHandPosition = {x:0.4, y: 0.8, z: -0.9};

    const {position, rotation} = barFromHands(leftHandPosition, rightHandPosition);

    expect(position.x).toBeCloseTo(0.45, 6);
    expect(position.y).toBeCloseTo(0.8, 6);
    expect(position.z).toBeCloseTo(-0.95, 6);
    expect(rotation.x).toBeCloseTo(0, 3);
    expect(rotation.y).toBeCloseTo(-79, 0);
    expect(rotation.z).toBeCloseTo(0, 0);
  });
});
