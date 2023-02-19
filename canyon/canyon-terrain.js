// canyon-terrain.js - the landscape geometry for a canyon
// Data and code are in one file to avoid asynchronous loading.
// Copyright © 2023 Doug Reeder; Licensed under the GNU GPL-3.0

const X_POINTS = 13;
const Z_POINTS = 13;
const terrainHeights = `
0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -100 -170 -200 -200 -150 -100 0 0 0
0 0 0 -170 -200 -200 -200 -200 -200 -200 -100 0 0
0 0 -100 -200 -200 -200 -200 -200 -200 -200 -200 -200 0
0 -100 -200 -200 -200 0 -20 -40 -200 -200 -200 -200 0
0 0 -170 -200 -200 -30 -20 0 -200 -200 -200 0 0
0 0 -190 -200 -200 -150 -10 0 -200 -200 -200 0 0
0 0 -50 -200 -200 -200 0 -20 -200 -200 -200  0 0
0 0 0 -50 -200 -200 -150 -180 -200 -200 -200 0 0
0 30 0 -20 -200 -200 -220 -250 -230 -200 -100 0 0
0 20 30 0 -50 -200 -200 -220 -200 -200 -100 0 0
0 0 20 0 0 -100 -150 -200 -200 -100 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0
`;


AFRAME.registerGeometry('canyon-terrain', {
  schema: {
    spacing: {default: 100},
    sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
  },

  init: function (data) {
    // Creates geometry.
    const geometry = new THREE.PlaneGeometry((X_POINTS - 1) * data.spacing, (Z_POINTS - 1) * data.spacing, X_POINTS - 1, Z_POINTS - 1);
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position.array;
    const floatPatt = /\s*\S+/y;
    let match, i = 0;
    while (match = floatPatt.exec(terrainHeights)) {
      const height = parseFloat(match[0]);
      vertices[i * 3 + 1] = height;
      ++i;
    }
    geometry.computeVertexNormals();
    this.geometry = geometry;
  }
});
