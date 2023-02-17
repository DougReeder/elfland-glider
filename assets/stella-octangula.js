// stella-octangula.js - geometry of a stellated octahedron for A-Frame WebXR
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0

AFRAME.registerGeometry('stella-octangula', {
    schema: {
    },

    init: function (_data) {
        const NUM_PLANES = 8;
        const positions = new Float32Array(NUM_PLANES * 3 * 9);
        const normals = new Float32Array(NUM_PLANES * 3 * 9);
        const indexes = [];
        const C = 0.5;   // coordinates are on a cube 1m across

        positions.set([0, C, 0,  -C, C, C,  0, 0, C,  C, -C, C,  C, 0, 0,  C, C, -C], 0*18);
        normals.set([1, 1, 1,  1, 1, 1,  1, 1, 1,  1, 1, 1,  1, 1, 1,  1, 1, 1], 0*18);
        indexes.push(0, 1, 2,  2, 3, 4,  4, 5, 0);

        positions.set([0, C, 0,  -C, C, -C,  -C, 0, 0,  -C, -C, C,  0, 0, C,  C, C, C], 1*18);
        normals.set([-1, 1, 1,  -1, 1, 1,  -1, 1, 1,  -1, 1, 1,  -1, 1, 1,  -1, 1, 1], 1*18);
        indexes.push(6, 7, 8,  8, 9, 10,  10, 11, 6);

        positions.set([0, C, 0,  C, C, -C,  0, 0, -C,  -C, -C, -C,  -C, 0, 0, -C, C, C], 2*18);
        normals.set([-1, 1, -1,  -1, 1, -1,  -1, 1, -1,  -1, 1, -1,  -1, 1, -1,  -1, 1, -1], 2*18);
        indexes.push(12, 13, 14,  14, 15, 16,  16, 17, 12);

        positions.set([0, C, 0,  C, C, C,  C, 0, 0,  C, -C, -C,  0, 0, -C,  -C, C, -C], 3*18);
        normals.set([1, 1, -1,  1, 1, -1,  1, 1, -1,  1, 1, -1,  1, 1, -1,  1, 1, -1], 3*18);
        indexes.push(18, 19, 20,  20, 21, 22,  22, 23, 18);

        positions.set([0, 0, C,  -C, -C, C,  0, -C, 0,  C, -C, -C,  C, 0, 0,  C, C, C], 4*18);
        normals.set([1, -1, 1,  1, -1, 1,  1, -1, 1,  1, -1, 1,  1, -1, 1,  1, -1, 1], 4*18);
        indexes.push(24, 25, 26,  26, 27, 28,  28, 29, 24);

        positions.set([0, 0, C,  -C, C, C,  -C, 0, 0,  -C, -C, -C,  0, -C, 0,  C, -C, C], 5*18);
        normals.set([-1, -1, 1,  -1, -1, 1,  -1, -1, 1,  -1, -1, 1,  -1, -1, 1,  -1, -1, 1], 5*18);
        indexes.push(30, 31, 32,  32, 33, 34,  34, 35, 30);

        positions.set([C, 0, 0,  C, -C, C,  0, -C, 0,  -C, -C, -C,  0, 0, -C,  C, C, -C], 6*18);
        normals.set([1, -1, -1,  1, -1, -1,  1, -1, -1,  1, -1, -1,  1, -1, -1,  1, -1, -1], 6*18);
        indexes.push(36, 37, 38,  38, 39, 40,  40, 41, 36);

        positions.set([0, -C, 0,  -C, -C, C,  -C, 0, 0,  -C, C, -C,  0, 0, -C,  C, -C, -C], 7*18);
        normals.set([-1, -1, -1,  -1, -1, -1,  -1, -1, -1,  -1, -1, -1,  -1, -1, -1,  -1, -1, -1], 7*18);
        indexes.push(42, 43, 44,  44, 45, 46,  46, 47, 42);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indexes);
        geometry.normalizeNormals();
        geometry.computeBoundingBox();

        this.geometry = geometry;
    }
});
