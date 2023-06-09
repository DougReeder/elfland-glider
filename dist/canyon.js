/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./canyon/canyon-shader.js":
/*!*********************************!*\
  !*** ./canyon/canyon-shader.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/elfland-utils */ "./src/elfland-utils.js");
/* harmony import */ var _canyon_shader_vert_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canyon-shader-vert.glsl */ "./canyon/canyon-shader-vert.glsl");
/* harmony import */ var _canyon_shader_vert_glsl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_canyon_shader_vert_glsl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _canyon_shader_frag_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canyon-shader-frag.glsl */ "./canyon/canyon-shader-frag.glsl");
/* harmony import */ var _canyon_shader_frag_glsl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_canyon_shader_frag_glsl__WEBPACK_IMPORTED_MODULE_2__);
// canyon-shader.js - stratified material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0
//
// `src` must be the selector for an img element with a seamless texture, preferably grayish.
// There are several strata at various levels below y=0.
// Some shift the color of the texture toward red, and some toward yellow.
// Faces will be 44% brighter in direct sun and 44% darker when facing away from the sun.
// Example: material="shader:canyon; src:#rock"





AFRAME.registerShader('canyon', {
    schema: {
        src: {type: 'selector'},
        sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
    },

    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                rockTexture: {value: (0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.placeholderTexture)()},
                sunNormal: {value: sunPos.normalize()}
            },
            vertexShader: (_canyon_shader_vert_glsl__WEBPACK_IMPORTED_MODULE_1___default()),
            fragmentShader: (_canyon_shader_frag_glsl__WEBPACK_IMPORTED_MODULE_2___default())
        });
    },
    /**
     * `update` used to update the material. Called on initialization and when data updates.
     */
    update: function (data) {
        if (data.src !== this.src) {
            this.loadTexture(data.src);   // sets rockTexture
            this.src = data.src;
        }
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material.uniforms.sunNormal.value = sunPos.normalize();
        // this.material.uniforms.sunNormal.value.set(sunPos.normalize());
    },

    loadTexture: function(src) {
        if (src?.currentSrc) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(src.currentSrc, texture => {
                this.material.uniforms.rockTexture.value?.dispose();
                this.material.uniforms.rockTexture.value = texture;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                // texture.repeat.set(2, 3);
                texture.magFilfer = THREE.LinearMipmapNearestFilter;
                texture.minFilfer = THREE.LinearMipmapNearestFilter;
                // this.material.uniforms.useMap.value = true;
            });
        }
    },
});


/***/ }),

/***/ "./canyon/canyon-terrain.js":
/*!**********************************!*\
  !*** ./canyon/canyon-terrain.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_BufferGeometryUtilsRump__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/BufferGeometryUtilsRump */ "./src/BufferGeometryUtilsRump.js");
/* harmony import */ var _src_ImprovedNoise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/ImprovedNoise */ "./src/ImprovedNoise.js");
// canyon-terrain.js - the landscape geometry for a canyon
// Data and code are in one file to avoid asynchronous loading.
// Copyright © 2023 Doug Reeder; Licensed under the GNU GPL-3.0



const X_POINTS = 41;
const Z_POINTS = 67;
const terrainHeights = `
0 0 0  0  0  0  0  0  0  0   0  0  0  0  0  0  0  0  0  0   0  0  0  0  0  0  0  0  0  0   0 0 0 0 0 0 0 0 0 0  0
0 0 0  0  0  0  0  0  0  0   0 -1 -2 -2 -1  5 10 15 20 22  25 27 29 23 20 17 15  5  0  0   0 0 0 0 0 0 0 0 0 0  0
0 0 0  0  0  0  0 -1 -2 -3  -3 -2 10 15 25 30 35 37 41 42  45 47 50 54 59 55 54 49 42  5   0 0 0 0 0 0 0 0 0 0  0
0 0 0  0 -1 -2 -3 -4 -4 -3   5 20 25 31 41 45 49 54 56 58  60 63 65 70 72 78 80 70 45 15   1 0 0 0 0 0 0 0 0 0  0
0 0 0 -1 -2 -3 -4 -5 -4 10  20 25 30 35 43 49 52 60 65 70  72 75 80 88 95 99 99 90 75 35  10 0 0 0 0 0 0 0 0 0  0

0 -1 -2 -3 -4 -5 -6 -5 10 20  25 30 38 40 47 55 61 65 70 75  80 85 90 95 99 99 99 99 85 70  30  1  0  0  0  0  0  0  0  0  0
0 -2 -3 -5 -5 -6 -6  5 20 25  30 35 40 46 50 51 59 62 65 70  75 80 85 90 95 99 99 99 94 81  79 68 59  1  0  0  0  0  0  0  0
0 -2 -4 -6 -6 -7 15 20 25 30  35 40 41 45 47 45 40 30 35 45  50 60 65 75 80 85 90 95 90 87  82 70 69 45  1  0  0  0  0  0  0
0 -2 -4 -5 -6 -7 20 31 42 47  49 48 47 46 40 35 30 15 10 10   5 10 20 45 65 65 70 75 86 84  80 78 71 55 66  5  0  0  0  0  0
0 -1 -3 -4 -5 -6 22 39 41 50  52 50 46 41 35 20 10  1  0  0   0  0  0  5 15 40 50 70 82 83  84 75 77 72 63 59  1  0  0  0  0
0 -1 -2 -3 -4 -5 15 48 55 60  56 53 47 40 35  1  0  0  0 -1  -2 -1  0  0  0  5 67 72 79 81  80 79 78 76 73 65 62  5  0  0  0
0 -1 -2 -3 -4  5 45 55 60 65  60 55 50 45 15  0  0 -1 -2 -3  -3 -1  0  0  5 65 71 75 78 79  78 77 74 72 70 64 58 45  0  0  0
0 -1 -2 -3  5 25 55 60 65 70  65 60 55 48  5  0  0 -1 -2 -3  -1  0  0  5 55 63 68 72 71 68  65 68 73 70 65 60 55 50  5  0  0
0 -1 -2  5 50 55 60 65 70 75  70 65 60 55 47  5  0  0 -1 -2  -1  0  5 45 60 62 65 60 55 50  20 50 55 57 55 54 55 52 48  0  0
0 -1  5 50 55 65 65 70 75 75  75 69 65 60 55 45  5  0  0 -1  -1  0 35 50 54 60 55 50 45  0  -1  5 44 49 52 55 54 52 48  1  0
0  5 50 60 65 70 75 75 75 75  75 71 65 60 55 50 45  5  0  0  -1  0 40 49 55 50 45 40  5 -1  -2 -1  5 52 54 56 57 56 54 51  0
0  5 65 70 75 75 75 75 75 75  75 75 70 65 60 55 50 45  5  0  -1  0 47 50 49 40 35  5 -1 -2  -3 -2 -1 55 57 59 60 59 57 54  0
0  5 65 70 75 75 75 75 75 75  75 75 75 70 65 60 55 50 45  0   0  0  0 47 46 40  5  0  0 -1  -2 -1  5 60 64 65 64 60 59 55  0
0 55 60 65 70 75 75 75 75 75  75 75 75 75 70 65 60 55 48  5   0  0 -1  0  0 -1  0  0  0  0   5 70 69 69 70 67 64 63 60  1  0
0 50 55 63 75 77 75 75 75 75  75 75 75 75 72 68 63 58 51 45   5  0  0  0  0  0  0  5 10 70  74 73 72 71 71 70 67 64 60  0  0


0 40 50 71 79 77 75 72 70 65  70 75 75 74 70 65 60 53 46 40  47 55 60 65 70 75 75 75 75 75  75 75 74 73 72 72 69 64 57  0  0
0 45 55 65 78 79 77 70 65 65  65 70 72 68 63 58 55 47 42 46  59 63 68 72 77 80 80 79 79 79  78 78 77 76 75 72 67 59 51  0  0
0 40 60 69 81 82 78 70 65 60  60 60 60 58 55 53 47 43 50 60  68 70 76 79 84 85 85 83 83 83  84 83 82 79 76 70 62 52  1  0  0
0 35 50 70 84 85 84 75 65 60  55 53 50 49 48 45 42 47 55 68  74 77 83 85 90 90 90 87 87 86  87 84 83 78 72 65 54 41  0  0  0
0  0 40 74 85 86 87 78 75 68  49  1  1  1 30 39 47 55 60 65  80 84 90 90 95 95 95 91 91 89  88 85 79 73 66 57 44 30  0  0  0
0  0 40 80 90 92 90 85 80 70   1 -7 -8 -8  1 45 55 60 70 75  85 90 95 95 99 99 99 95 95 92  89 86 73 67 58 47 33 17  0  0  0
0  0 35 80 91 93 94 90 80 70   1 -8 -9 -9 -8  1 55 65 75 80  90 95 99 99 99 99 99 99 96 93  90 87 65 58 48 35 18  1 -1  0  0
0  0 30 75 85 95 95 95 85 75   1 -8 -8 -8 -7  1 50 75 90 94  96 97 95 95 95 99 95 90 82 80  75 70 63 46 34 18  1 -2 -1  0  0
0  0  5 45 80 92 96 96 96 90  85  1  1  1  1 55 75 95 95 96  95 90 90 90 90 90 85 80 70 71  63 54 45 34  1 -6 -5 -3 -1  0  0
0  0  0 35 70 85 95 96 96 95  95 90 85 80 70 75 95 95 96 95  90 87 86 84 83 80 75 70 57 59  55 46  1 -7 -8 -7 -6 -4 -2  0  0
0  0  0 15 50 80 85 90 95 95  95 95 95 95 95 95 95 95 95 90  85 81 79 74 62 56  1 -2 -3 38  -5 -6 -7 -8 -9 -8 -7 -5 -3 -1  0
0  0  0  0  5 61 79 85 90 95  99 99 99 99 99 99 99 90 85 80  75 62 50 39 29  1 -2 -3 -4 35  -6 -7 -8 -9 -9 -9 -8 -6 -4 -2  0
0  0  0  0  0  1 85 89 92 95  98 99 99 98 98 97 95 90 82 79   1  1  1 -1  0  0 -1 -3 -4 32  -5 -6 -7 -8 -9 -7 -6 -4 -2 -1  0
0  0  0  0 -1 -2  1 90 93 94  97 98 97 96 93 90 87 84  1  1  -5 -4 -3 -2 -1  0 -1 -2 -3 30  -4 -5 -6 -7 -7 -5 -4 -2  0  0  0
0  0  0 -1 -2 -3  1 92 94 96  97 96 94 91 83  1  1  1 -8 -7  -6 -5 -4 -3 -3  0  0 -1 -2 29  -3 -4 -5 -6 -5 -3 -2  0  0  0  0
0  0 -1 -2 -3 -4  1 92 94 95  96 95 93 89  1 -4 -7 -8 -9 -8  -7 -7  1  1  1  1  1  1  1 27   4  3  2  1  1  1  0  0  0  0  0
0  0  0 -1 -2 -3  1 92 93 94  95 94 92  1  0 -5 -6 -7 -9  1   1  1  1  2  2  2  2  2 24 25  23 18  3  2  2  1  1  0  0  0  0
0  0  0  0 -1 -2  1 92 93 94  93 91 85  1 -1 -4 -7  1  1  1   2  2  2  2 14 14 17 20 22 23  24 22 20 19  3  2  1  0  0  0  0
0  0  0  0  0 -1  1 92 92 93  92 90 86  1 -2 -3  1  1  2  2   2 11 12 13 15 16 17 18 20 22  23 23 22 19 13  2  1  1  0  0  0
0  0  0  0  0  1 90 91 92 91  91 90  1  0 -1 -4  1  2  2  9  11 12 13 14 15 15 16 17 18 19  21 22 23 21 17  3  2  1  0  0  0
0  0  0  0  0  1 89 90 91 90  89  1 -1 -1 -3  1  2  6  7  9  11 12 13 14 14 14  2  1  1 -8  -7 18 22 24 22 18  2  1  1  0  0
0  0  0  0  0  1 88 89 90 89  88  1 -3 -2  1  1  2  7  8 10  11 12 13 13 14 14  2  1 -8 -9  -8 19 23 25 23 19  3  2  1  0  0
0  0  0  0  1 87 88 89 88 88  87  1 -4 -5  1  2  2  8  9 10  11 12 13 14 15 15  2  1 -7 -8   1 16 22 25 26 24 20  2  1  1  0
0  0  0  1 86 87 88 88 87 84   1 -4 -5 -6  1  2  8  9 10 10  11 12 13 14 15 16 17 18 19 21  22 23 24 26 27 25 21  3  2  1  0
0  0  1 84 86 87 87 86 84 80   1 -5 -6 -7  1  2  9 10 10 10  10 12 13 15 16 16 17 19 21 23  24 26 27 28 28 26 22 14  2  1  0
0  0  1 84 86 86 85 83 79 75   1 -6 -7 -8  1  2  8 10 10 10  10 12 13  4  6 15 16 18 20 21  23 24 26 27 29 27 23 15  2  1  0
0  1 81 82 84 85 84 82 78 66   1 -7 -8 -8  1  2  2  9 10 10  10 11  2  2  1  1  1  1  1  1   1 21 25 28 30 28 24 16  2  1  0
0  1 81 82 84 84 82 81 77  1  -8 -9 -9 -8  1  1  2  9 11 11   4  2  2  1  1 -3 -4 -5 -5 -6  -7  1 25 29 31 29 25  2  1  1  0
0  1 81 82 83 83 81 76  1 -7  -8 -9 -9 -8 -7  1  2 10 12 13   2  1  1  1 -4 -5 -6 -7 -8 -9  -8 -6 26 30 32 30 26  1  1  0  0
0  1 80 81 82 81 80  1 -5 -6  -7 -8 -8 -7 -6  1  2  2 14 15   6  1 -1 -2 -3 -2  1  1  1 -7  -9 -7 27 31 33 31 27  1 -2  0  0
0  1 79 80 81 80 79  1 -4 -5  -6 -7 -7 -6 -5  1  1  2 15 16  18 06  1 -1 -1  1 28 28 28  1  -8 -7 28 32 34 32 28  1 -2  0  0
0  0  1 79 80 79 77  1 -3 -4  -5 -6 -6 -5 -4 -3  1  2 17 18  20 22 24 26 28 29 30 30 30 28  -5 -6  1 29 33 35 33 29  1  0  0
0  0  1 77 78 79 77  1 -2 -3  -4 -5 -5 -4 -3 -2  1  2 19 20  21 23 23 27 29 30 30 30 30 28  -3 -5 -3 30 34 36 35 33  1  0  0
0  0  1 76 77 78 76  1 -1 -2  -3 -4 -4 -3 -2 -1  0 -1 -1 -2  -2 -3 -3  1 29 30 31 30 30 29   1 -4 -3 31 35 37 36 33  1  1  0
0  0  1 75 76 77 75  1  0 -1  -2 -3 -3 -2 -1  0  0  0  0 -1  -1 -2 -3 -4  1 30 32 34 33 33  31 -1 -2 31 35 37 38 36 32  1  0
0  0  1 74 75 76 75 74  1  1   1  1  1  1  1  1  0  0 48 47  47 -1 -2 -3 -5 -6  1 36 35 35  33  0  0  1 33 37 39 37 33  1  0
0  1 73 74 75 74 73 72 69 66  65 63 63 62 62 59 55 54 53 52  52 51 -1 -3 -4 -5 -7  1 38 39   1  0 -1  0 34 38 40 38 34  1  0
0  1 72 73 74 73 72 70 68 67  66 64 64 64 62 60 58 57 56 55  55 54 50 48  1 -4 -6 -8 40 39   0 -1  0  1 39 40 41 39 35  1  0
0  1 72 72 73 73 72 70 68 68  68 66 65 65 62 61 60 59 58 57  57 56 54 52 48 -3 -4  1 44 43   1  0  1 37 41 42 40 36  1  0  0
0  1 70 71 71 72 71 70 69 68  68 67 66 65 63 62 61 57 56 56  58 57 56 54 52 47 46 45 45 44  45 41 37 41 42 43 41 37  1  0  0


0 1 70 69 70 71 71 71 70 69  68 66 65 64 61 60 58 53 52 53  56 55 54 55 54 51 50 48 46 45  43 44 40 43 44 43 40 32 1 0  0
0 1 69 68 69 69 70 69 69 68  67 65 63 61 57 56 54  1  1  1  52 51 50 52 52 53 52 51 48 47  46 46 44 45 44 42 39  1 0 0  0
0 0  1 67 67 68 68 67 67 66  65 63 59 57  1  1  1 -4 -3 -2   1  1 46 45 48 51 50 50 49 48  48 47 46 44 43 41 35  1 0 0  0
0 0  0  1 66 65 65 64 64 63  62 60  1  1  0  0 -1 -2 -1 -1   0  0  0  1 41 47 46 46 47 47  46 45 44 40 41 35  1  0 0 0  0
0 0  0  0  0  1 61 60 60  1   1  1  0  0  0  0  0  0  0  0   0  0  0  0  0  1  1  1  1 43  42 41 40  1  1  1  0  0 0 0  0

0 0  0  0  0  0  1  1  1  0   0  0  0  0  0  0  0  0  0  0   0  0  0  0  0  0  0  0  0  1   1  1  1  0  0  0  0  0 0 0  0
`;
// y is zero by default, so last row (all zeros) doesn't need to be calculated.


AFRAME.registerGeometry('canyon-terrain', {
  schema: {
    spacing: {default: 10},
    sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
  },

  init: function (data) {
    // Creates geometry.
    const geometry = new THREE.PlaneGeometry((X_POINTS - 1) * data.spacing, (Z_POINTS - 1) * data.spacing, X_POINTS - 1, Z_POINTS - 1);
    geometry.rotateX(-Math.PI / 2);

    // applies elevations
    const vertices = geometry.attributes.position.array;
    const floatPatt = /\s*\S+/y;
    let match;
    let v = 0;
    while (match = floatPatt.exec(terrainHeights)) {
      let height = parseFloat(match[0]);
      height = height * -2;
      if (height < 0) {
        height -= 100;
      }
      vertices[v * 3 + 1] = height;
      ++v;
    }


    const perlin = new _src_ImprovedNoise__WEBPACK_IMPORTED_MODULE_1__["default"]();
    const SEED = Math.random() * 100;

    const intensityTweak = new Float32Array(X_POINTS * Z_POINTS);
    for (let i = 0; i < X_POINTS; ++i) {
      for (let j = 0; j < Z_POINTS; ++j) {
        if (i > 0 && i < X_POINTS - 1 && j > 0 && j < Z_POINTS -1) {   // doesn't tweak rim
          const v = i + j * X_POINTS;
          for (let scale = 20; scale > 1; --scale) {
            intensityTweak[v] += perlin.noise(i / scale, j / scale, SEED);
          }
          intensityTweak[v] /= 15;
        }
      }
    }

    geometry.setAttribute('intensityTweak', new THREE.BufferAttribute(intensityTweak, 1));

    // computes normals that are smooth for shallow angles
    this.geometry = (0,_src_BufferGeometryUtilsRump__WEBPACK_IMPORTED_MODULE_0__.toCreasedNormals)(geometry, 0.45 * Math.PI);
    geometry.dispose();
  }
});


/***/ }),

/***/ "./canyon/dark-elf.js":
/*!****************************!*\
  !*** ./canyon/dark-elf.js ***!
  \****************************/
/***/ (() => {

// dark-elf.js - antagonist behavior for Elfland Glider
// Copyright © 2023 by Doug Reeder; Licensed under the GNU GPL-3.0

 const wanderList = [
   {animation: 'root|flying_idle',      vector: new THREE.Vector3(0, 0, 1),  far: 5},
   {animation: 'root|flying_left',      vector: new THREE.Vector3(2, 0, 0),  far: 5},
   {animation: 'root|flying_right',     vector: new THREE.Vector3(-2, 0, 0), far: 5},
   {animation: 'root|flying_up',        vector: new THREE.Vector3(0, 2, 0),  far: 8},
   {animation: 'root|flying_down',      vector: new THREE.Vector3(0, -2, 0), far: 4},
   {animation: 'root|flying_forward',   vector: new THREE.Vector3(0, 0, 4),  far: 10},
   {animation: 'root|flying_backwards', vector: new THREE.Vector3(0, 0, -2), far: 5},
 ]

const UP = new THREE.Vector3(0, 1, 0);

AFRAME.registerComponent('dark-elf', {
  schema: {
    goalSelector: {type: 'selector'},
    idleSpeed:    {default:  0.5},   // m/s
    pursuitSpeed: {default:  5.0},   // m/s
  },

  vector: new THREE.Vector3(),
  increment: new THREE.Vector3(),
  isAvoidingLandcape: false,
  facingMatrix: new THREE.Matrix4(),
  facingQuaternion: new THREE.Quaternion(),

  init() {
    const {el} = this;

    const newYRot = el.object3D.rotation.y + (Math.random() - 0.5) * Math.PI / 2;
    const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 16;
    el.object3D.rotation.set(newXRot, newYRot, el.object3D.rotation.z);

    const keyTemplate = document.getElementById('keyTemplate');
    const clone = keyTemplate.content.firstElementChild.cloneNode(true);
    clone.setAttribute('id', 'key');
    AFRAME.scenes[0].appendChild(clone);

    this.setModeOrPursuit(wanderList[0]);

    setInterval(this.randomMode.bind(this, el), 3000);

    el.addEventListener('raycaster-intersection', (evt) => {
      // Intersection w/ distance 0 is sometimes sent immediately
      if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
        for (const entity of evt.detail.els) {
          if (entity.classList.contains('landscape')) {
            this.isAvoidingLandcape = true;
            const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 36;
            el.object3D.rotation.set(newXRot, el.object3D.rotation.y, el.object3D.rotation.z);
            this.setModeOrPursuit(wanderList[0]);
          } else if (entity.id === this.data.goalSelector?.id) {
            console.log("caught goal")
            const keyCaptured = document.getElementById('keyCaptured');
            keyCaptured?.parentNode?.removeChild(keyCaptured);
            AFRAME.scenes[0].emit('cacheAndPlaySound', 'Im-taking-that-back.ogg');
            const subtitle = AFRAME.scenes[0].querySelector('#subtitle');
            subtitle?.setAttribute('value', "I'm taking that back!");
            setTimeout(() => {
              subtitle?.setAttribute('value', "");
            }, 5000);
            for (const entity of document.querySelectorAll('[dark-elf]')) {
              console.info("dark elf wandering");
              entity.setAttribute('dark-elf', 'goalSelector', '');
            }

            AFRAME.scenes[0].emit('setState', {questComplete: false});

            const keyTemplate = document.getElementById('keyTemplate');
            const clone = keyTemplate.content.firstElementChild.cloneNode(true);
            clone.setAttribute('id', 'key');
            AFRAME.scenes[0].appendChild(clone);
          } else {
            console.warn("unexpected raycaster intersection:", entity);
          }
        }
      }
    });
    el.addEventListener('raycaster-intersection-cleared', (evt) => {
      // console.log("cleared intersections:", evt.detail?.clearedEls)
      for (const entity of evt.detail.clearedEls) {
        if (entity.classList.contains('landscape')) {
          setTimeout(() => {   // keeps turning away from wall for another second
            this.isAvoidingLandcape = false;
            this.setModeOrPursuit(wanderList[0]);
          }, 1000);
        }
      }
    });
  },

  update(oldData) {
    const {el} = this;
    if (this.data.goalSelector) {
      el.firstElementChild.classList.remove('proximitySound');
      // raycaster will trigger sound
    }
    this.setModeOrPursuit(wanderList[0]);
  },

  tick(time, timeDelta) {
    const {el} = this;
    const hasGoal = Boolean(this.data.goalSelector?.object3D?.position);
    if (this.isAvoidingLandcape) {
      const newYRot = el.object3D.rotation.y + (hasGoal ? Math.PI : -Math.PI) / 180;
      const newXRot = el.object3D.rotation.x - Math.PI / 1800;
      el.object3D.rotation.set(newXRot, newYRot, el.object3D.rotation.z);
      return;
    } else if (hasGoal) {
      this.facingMatrix.lookAt(this.data.goalSelector.object3D.position, el.object3D.position, UP);
      this.facingQuaternion.setFromRotationMatrix(this.facingMatrix);
      el.object3D.quaternion.rotateTowards(this.facingQuaternion, Math.PI / 180);

      const distance = this.data.pursuitSpeed * timeDelta / 1000;
      this.increment.set(0, 0, distance);
    } else {   // wandering
      if (el.object3D.position.y > -50) {
        el.object3D.rotation.x = Math.PI / 36;   // keeps elf in canyon
      }

      const distance = this.data.idleSpeed * timeDelta / 1000;
      this.increment.copy(this.vector);
      this.increment.multiplyScalar(distance);
    }
    if (!(timeDelta > 0)) {
      return;   // when timeDelta is 0 or NaN, nothing can be done
    }
    this.increment.applyEuler(el.object3D.rotation);
    el.object3D.position.add(this.increment);
  },

  randomMode(el) {
    if (this.data.goalSelector?.object3D?.position) {
      return;
    }
    if (Math.random() > 0.6667) {
      this.setMode(wanderList[Math.floor(wanderList.length * Math.random())])
    } else {
      this.setMode(wanderList[0]);
    }
  },

  setModeOrPursuit(mode) {
    if (this.data.goalSelector?.object3D?.position) {
      this.setPursuit();
    } else {
      this.setMode(mode);
    }
  },

  setMode(mode) {
    this.el.setAttribute('animation-mixer', 'clip', mode.animation);

    this.vector.copy(mode.vector);
    this.el.setAttribute('raycaster', 'direction', {x: mode.vector.x, y: mode.vector.y, z: mode.vector.z});

    this.el.setAttribute('raycaster', 'far', mode.far * this.data.idleSpeed);
  },

  setPursuit() {
    this.el.setAttribute('animation-mixer', 'clip', 'root|flying_forward');

    this.el.setAttribute('raycaster', 'direction', {x: 0, y: 0, z: 1});

    this.el.setAttribute('raycaster', 'far', 5);
  },
});

 // root|flying_idle root|flying_forward root|flying_backwards
 // root|flying_left root|flying_right
 // root|flying_up root|flying_down root|flying_nose_dive
 // root|talk_cycle root|wings_flapping
 // root|idle_look_left root|idle_look_right


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./assets/intro.css":
/*!****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./assets/intro.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! close-button-red32.png */ "./assets/close-button-red32.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/** intro.css - styling for intro dialog of Elfland Glider\n  * Copyright © 2018-2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0\n  */\n\n\nhtml {\n    font: 1.5rem Niconne, \"Goudy Old Style\", Papyrus, serif;\n}\n\nh1 {\n    margin: 0.5em;\n}\n\n.wrapper {\n    margin: 1em;\n}\n.wrapper > * {\n    margin: 1em;\n}\n@supports (display: grid) {\n    .wrapper {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));\n        grid-gap: 1em;\n        gap: 1em;\n    }\n    .wrapper > * {\n        margin: 0;\n    }\n}\n\n.portraitOnly {\n    display: none;\n}\n.landscapeOnly {\n    display: block;\n}\n@media only screen and (orientation: portrait) {\n    .portraitOnly {\n        display: block;\n    }\n    .landscapeOnly {\n        display: none;\n    }\n}\n\ntd.ruleAbove {\n    border-top: black 1px solid;\n}\n\ntd.ruleBelow {\n    border-bottom: black 1px solid;\n}\n\n\n/* hides AR button, */\ndiv.a-enter-ar {\n    visibility: hidden;\n}\n\n\n.closeBtnRed {\n    position: fixed;\n    top: 25px;\n    right: 25px;\n    width: 32px;\n    height: 32px;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n    z-index: 1;\n}\n\n\n\n/* forces scrollbar to be visible in webkit browsers */\n::-webkit-scrollbar {\n    width:9px;\n}\n\n::-webkit-scrollbar-track {\n    -webkit-border-radius:5px;\n    border-radius:5px;\n    background:rgba(0,0,0,0.1);\n}\n\n::-webkit-scrollbar-thumb {\n    -webkit-border-radius:5px;\n    border-radius:5px;\n    background:rgba(0,0,0,0.2);\n}\n\n::-webkit-scrollbar-thumb:hover {\n    background:rgba(0,0,0,0.4);\n}\n\n::-webkit-scrollbar-thumb:window-inactive {\n    background:rgba(0,0,0,0.05);\n}\n", "",{"version":3,"sources":["webpack://./assets/intro.css"],"names":[],"mappings":"AAAA;;GAEG;;;AAGH;IACI,uDAAuD;AAC3D;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,WAAW;AACf;AACA;IACI,WAAW;AACf;AACA;IACI;QACI,aAAa;QACb,2DAA2D;QAC3D,aAAa;QACb,QAAQ;IACZ;IACA;QACI,SAAS;IACb;AACJ;;AAEA;IACI,aAAa;AACjB;AACA;IACI,cAAc;AAClB;AACA;IACI;QACI,cAAc;IAClB;IACA;QACI,aAAa;IACjB;AACJ;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,8BAA8B;AAClC;;;AAGA,qBAAqB;AACrB;IACI,kBAAkB;AACtB;;;AAGA;IACI,eAAe;IACf,SAAS;IACT,WAAW;IACX,WAAW;IACX,YAAY;IACZ,yDAA6C;IAC7C,UAAU;AACd;;;;AAIA,sDAAsD;AACtD;IACI,SAAS;AACb;;AAEA;IACI,yBAAyB;IACzB,iBAAiB;IACjB,0BAA0B;AAC9B;;AAEA;IACI,yBAAyB;IACzB,iBAAiB;IACjB,0BAA0B;AAC9B;;AAEA;IACI,0BAA0B;AAC9B;;AAEA;IACI,2BAA2B;AAC/B","sourcesContent":["/** intro.css - styling for intro dialog of Elfland Glider\n  * Copyright © 2018-2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0\n  */\n\n\nhtml {\n    font: 1.5rem Niconne, \"Goudy Old Style\", Papyrus, serif;\n}\n\nh1 {\n    margin: 0.5em;\n}\n\n.wrapper {\n    margin: 1em;\n}\n.wrapper > * {\n    margin: 1em;\n}\n@supports (display: grid) {\n    .wrapper {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));\n        grid-gap: 1em;\n        gap: 1em;\n    }\n    .wrapper > * {\n        margin: 0;\n    }\n}\n\n.portraitOnly {\n    display: none;\n}\n.landscapeOnly {\n    display: block;\n}\n@media only screen and (orientation: portrait) {\n    .portraitOnly {\n        display: block;\n    }\n    .landscapeOnly {\n        display: none;\n    }\n}\n\ntd.ruleAbove {\n    border-top: black 1px solid;\n}\n\ntd.ruleBelow {\n    border-bottom: black 1px solid;\n}\n\n\n/* hides AR button, */\ndiv.a-enter-ar {\n    visibility: hidden;\n}\n\n\n.closeBtnRed {\n    position: fixed;\n    top: 25px;\n    right: 25px;\n    width: 32px;\n    height: 32px;\n    background-image: url(close-button-red32.png);\n    z-index: 1;\n}\n\n\n\n/* forces scrollbar to be visible in webkit browsers */\n::-webkit-scrollbar {\n    width:9px;\n}\n\n::-webkit-scrollbar-track {\n    -webkit-border-radius:5px;\n    border-radius:5px;\n    background:rgba(0,0,0,0.1);\n}\n\n::-webkit-scrollbar-thumb {\n    -webkit-border-radius:5px;\n    border-radius:5px;\n    background:rgba(0,0,0,0.2);\n}\n\n::-webkit-scrollbar-thumb:hover {\n    background:rgba(0,0,0,0.4);\n}\n\n::-webkit-scrollbar-thumb:window-inactive {\n    background:rgba(0,0,0,0.05);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./assets/intro.css":
/*!**************************!*\
  !*** ./assets/intro.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_intro_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./intro.css */ "./node_modules/css-loader/dist/cjs.js!./assets/intro.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_intro_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_intro_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_intro_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_intro_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./canyon/canyon-shader-frag.glsl":
/*!****************************************!*\
  !*** ./canyon/canyon-shader-frag.glsl ***!
  \****************************************/
/***/ ((module) => {

module.exports = "// canyon-shader-frag.glsl - vaguely natural-looking material for A-Frame\n// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0\n\nuniform sampler2D rockTexture;\n\nvarying vec3 pos;\nvarying vec3 vNormal;\nvarying float vIntensityTweak;\nvarying float sunFactor;\n\n// by Inigo Quilez - https://iquilezles.org/articles/biplanar/\n// \"sampler\" texture sampler\n// \"position\" point being textured\n// \"normal\" surface normal at \"p\"\n// \"weight\" controls the sharpness of the blending in the transitions areas\nvec4 biplanar(in sampler2D sampler, in vec3 position, in vec3 normal, in float weight) {\n    // grab coord derivatives for texturing\n    vec3 dpdx = dFdx(position);\n    vec3 dpdy = dFdy(position);\n    normal = abs(normal);\n\n    // major axis (in x; yz are following axis)\n    ivec3 major = (normal.x > normal.y && normal.x > normal.z) ?\n        ivec3(0,1,2) :\n        (normal.y > normal.z) ? ivec3(1,2,0) : ivec3(2,0,1);\n    // minor axis (in x; yz are following axis)\n    ivec3 minor = (normal.x < normal.y && normal.x < normal.z) ?\n        ivec3(0,1,2) :\n        (normal.y < normal.z) ? ivec3(1,2,0) : ivec3(2,0,1);\n\n    // median axis (in x;  yz are following axis)\n    ivec3 median = ivec3(3) - minor - major;\n\n    // project+fetch\n    vec4 x = textureGrad(sampler, vec2(position[major.y], position[major.z]),\n        vec2(dpdx[major.y], dpdx[major.z]),\n        vec2(dpdy[major.y], dpdy[major.z]));\n    vec4 y = textureGrad(sampler, vec2(position[median.y], position[median.z]),\n        vec2(dpdx[median.y],dpdx[median.z]),\n        vec2(dpdy[median.y],dpdy[median.z]));\n\n    // blend and return\n    vec2 blend = vec2(normal[major.x], normal[median.x]);\n//    // optional - add local support (prevents discontinuty)\n//    m = clamp((m - 0.5773) / (1.0 - 0.5773), 0.0, 1.0 );\n    // transition control\n    blend = pow(blend, vec2(weight / 8.0));\n    return (x * blend.x + y * blend.y) / (blend.x + blend.y);\n}\n\nvoid main() {\n    vec3 mappedColor = biplanar(rockTexture, pos / 10., vNormal, 16.).xyz;\n\n    float yellowStratum = smoothstep(-255.0, -253.0, pos.y) - smoothstep(-205.0, -203.0, pos.y);\n    float redStratum = 1. - smoothstep(-255.0, -253.0, pos.y) + smoothstep(-103.0, -100.5, pos.y);\n\n    vec3 inherentColor = mappedColor\n            + vec3(0.005,  0.005, -0.010) * yellowStratum\n            + vec3(0.010, -0.005, -0.005) * redStratum;\n\n    gl_FragColor = vec4(inherentColor * (sunFactor + vIntensityTweak), 1.0);\n}\n"

/***/ }),

/***/ "./canyon/canyon-shader-vert.glsl":
/*!****************************************!*\
  !*** ./canyon/canyon-shader-vert.glsl ***!
  \****************************************/
/***/ ((module) => {

module.exports = "// canyon-shader-vert.glsl - vaguely natural-looking material for A-Frame\n// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0\n\nuniform vec3 sunNormal;\n\nattribute float intensityTweak;\n\nvarying vec3 pos;\nvarying vec3 vNormal;\nvarying float vIntensityTweak;\nvarying float sunFactor;\n\nvoid main() {\n    pos = position;\n    vNormal = normal;\n    vIntensityTweak = intensityTweak;\n    sunFactor = 0.6875 + 0.75 * max(dot(normal, sunNormal), 0.0);\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"

/***/ }),

/***/ "./src/BufferGeometryUtilsRump.js":
/*!****************************************!*\
  !*** ./src/BufferGeometryUtilsRump.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toCreasedNormals": () => (/* binding */ toCreasedNormals)
/* harmony export */ });
// import {
// 	BufferAttribute,
// 	Vector3,
// } from 'three';

// Creates a new, non-indexed geometry with smooth normals everywhere except faces that meet at
// an angle greater than the crease angle.
function toCreasedNormals( geometry, creaseAngle = Math.PI / 3 /* 60 degrees */ ) {

	const creaseDot = Math.cos( creaseAngle );
	const hashMultiplier = ( 1 + 1e-10 ) * 1e2;

	// reusable vertors
	const verts = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	const tempVec1 = new THREE.Vector3();
	const tempVec2 = new THREE.Vector3();
	const tempNorm = new THREE.Vector3();
	const tempNorm2 = new THREE.Vector3();

	// hashes a vector
	function hashVertex( v ) {

		const x = ~ ~ ( v.x * hashMultiplier );
		const y = ~ ~ ( v.y * hashMultiplier );
		const z = ~ ~ ( v.z * hashMultiplier );
		return `${x},${y},${z}`;

	}

	const resultGeometry = geometry.toNonIndexed();
	const posAttr = resultGeometry.attributes.position;
	const vertexMap = {};

	// find all the normals shared by commonly located vertices
	for ( let i = 0, l = posAttr.count / 3; i < l; i ++ ) {

		const i3 = 3 * i;
		const a = verts[ 0 ].fromBufferAttribute( posAttr, i3 + 0 );
		const b = verts[ 1 ].fromBufferAttribute( posAttr, i3 + 1 );
		const c = verts[ 2 ].fromBufferAttribute( posAttr, i3 + 2 );

		tempVec1.subVectors( c, b );
		tempVec2.subVectors( a, b );

		// add the normal to the map for all vertices
		const normal = new THREE.Vector3().crossVectors( tempVec1, tempVec2 ).normalize();
		for ( let n = 0; n < 3; n ++ ) {

			const vert = verts[ n ];
			const hash = hashVertex( vert );
			if ( ! ( hash in vertexMap ) ) {

				vertexMap[ hash ] = [];

			}

			vertexMap[ hash ].push( normal );

		}

	}

	// average normals from all vertices that share a common location if they are within the
	// provided crease threshold
	const normalArray = new Float32Array( posAttr.count * 3 );
	const normAttr = new THREE.BufferAttribute( normalArray, 3, false );
	for ( let i = 0, l = posAttr.count / 3; i < l; i ++ ) {

		// get the face normal for this vertex
		const i3 = 3 * i;
		const a = verts[ 0 ].fromBufferAttribute( posAttr, i3 + 0 );
		const b = verts[ 1 ].fromBufferAttribute( posAttr, i3 + 1 );
		const c = verts[ 2 ].fromBufferAttribute( posAttr, i3 + 2 );

		tempVec1.subVectors( c, b );
		tempVec2.subVectors( a, b );

		tempNorm.crossVectors( tempVec1, tempVec2 ).normalize();

		// average all normals that meet the threshold and set the normal value
		for ( let n = 0; n < 3; n ++ ) {

			const vert = verts[ n ];
			const hash = hashVertex( vert );
			const otherNormals = vertexMap[ hash ];
			tempNorm2.set( 0, 0, 0 );

			for ( let k = 0, lk = otherNormals.length; k < lk; k ++ ) {

				const otherNorm = otherNormals[ k ];
				if ( tempNorm.dot( otherNorm ) > creaseDot ) {

					tempNorm2.add( otherNorm );

				}

			}

			tempNorm2.normalize();
			normAttr.setXYZ( i3 + n, tempNorm2.x, tempNorm2.y, tempNorm2.z );

		}

	}

	resultGeometry.setAttribute( 'normal', normAttr );
	return resultGeometry;

}




/***/ }),

/***/ "./src/ImprovedNoise.js":
/*!******************************!*\
  !*** ./src/ImprovedNoise.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// http://mrl.nyu.edu/~perlin/noise/

var ImprovedNoise = function () {

	var p = [ 151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
		 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
		 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
		 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
		 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
		 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
		 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
		 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
		 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
		 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];

	for (var i = 0; i < 256 ; i ++) {

		p[256 + i] = p[i];

	}

	function fade(t) {

		return t * t * t * (t * (t * 6 - 15) + 10);

	}

	function lerp(t, a, b) {

		return a + t * (b - a);

	}

	function grad(hash, x, y, z) {

		var h = hash & 15;
		var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
		return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

	}

	return {

		noise: function (x, y, z) {

			var floorX = ~~x, floorY = ~~y, floorZ = ~~z;

			var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

			x -= floorX;
			y -= floorY;
			z -= floorZ;

			var xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;

			var u = fade(x), v = fade(y), w = fade(z);

			var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;

			return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
							grad(p[BA], xMinus1, y, z)),
						lerp(u, grad(p[AB], x, yMinus1, z),
							grad(p[BB], xMinus1, yMinus1, z))),
					lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1),
							grad(p[BA + 1], xMinus1, y, z - 1)),
						lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1),
							grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));

		}
	}
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImprovedNoise);


/***/ }),

/***/ "./src/elfland-utils.js":
/*!******************************!*\
  !*** ./src/elfland-utils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calcPosChange": () => (/* binding */ calcPosChange),
/* harmony export */   "goFullscreenLandscape": () => (/* binding */ goFullscreenLandscape),
/* harmony export */   "isDesktop": () => (/* binding */ isDesktop),
/* harmony export */   "isMagicWindow": () => (/* binding */ isMagicWindow),
/* harmony export */   "placeholderTexture": () => (/* binding */ placeholderTexture),
/* harmony export */   "pokeEnvironmentalSound": () => (/* binding */ pokeEnvironmentalSound),
/* harmony export */   "setEnvironmentalSound": () => (/* binding */ setEnvironmentalSound)
/* harmony export */ });
// elfland-utils.js - common functions for Elfland Glider
// Copyright © 2018-2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0


function goFullscreenLandscape() {
    // desktop is fine without fullscreen (which can be enabled via headset button, anyway)
    if (!isMagicWindow()) {return;}

    let canvasEl = document.querySelector('canvas.a-canvas');
    let requestFullscreen =
        canvasEl.requestFullscreen ||
        canvasEl.webkitRequestFullscreen ||
        canvasEl.mozRequestFullScreen ||  // The capitalized `S` is not a typo.
        canvasEl.msRequestFullscreen;
    let promise;
    if (requestFullscreen) {
        promise = requestFullscreen.apply(canvasEl);
    }
    if (!(promise && promise.then)) {
        promise = Promise.resolve();
    }
    promise.then(lockLandscapeOrientation, lockLandscapeOrientation);
}

function lockLandscapeOrientation() {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").then(response => {
            console.log("screen orientation locked:", response);
        }).catch(err => {
            console.warn("screen orientation didn't lock:", err);
        });
    }
}


function isDesktop() {
    return ! (AFRAME.utils.device.isMobile() || AFRAME.utils.device.isMobileVR());
}

function isMagicWindow() {
    return AFRAME.utils.device.isMobile() && ! AFRAME.scenes[0].is("vr-mode");
}


function calcPosChange(verticalAngleDeg, horizontalAngleDeg, distance) {
    let verticalAngleRad = verticalAngleDeg/180*Math.PI;
    let altitudeChange = distance * Math.sin(verticalAngleRad);

    let horizontalDistance = distance * Math.cos(verticalAngleRad);
    let horizontalAngleRad = horizontalAngleDeg/180*Math.PI;
    return {x: horizontalDistance * Math.cos(horizontalAngleRad),
        y: altitudeChange,
        z: -horizontalDistance * Math.sin(horizontalAngleRad)};
}

function placeholderTexture(colorArg = '#808080', width = 1, height = 1) {
    const size = width * height;
    const data = new Uint8Array( 4 * size );

    let color;
    if (colorArg.isColor) {
        color = colorArg;
    } else {
        color = new THREE.Color(colorArg);
    }
    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; ++i ) {
        const stride = i * 4;
        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = 255;
    }

    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;
    return texture;
}

var environmentalSound = null;

/**
 * Sets the background sound for a world. It is paused when the tab is hidden.
 * @param url string or Array of strings
 * @param volume number between 0.0 and 1.0
 */
function setEnvironmentalSound(url, volume) {
    environmentalSound = new Howl({
        src: url,
        autoplay: true,
        loop: true,
        volume: volume || 1.0,
        html5: false,
        onplayerror: function() {
            environmentalSound.once('unlock', function() {
                environmentalSound.play();
            });
        }
    });
}

/** Starts the background sound for a world, if it wasn't already started. */
function pokeEnvironmentalSound() {
    if (environmentalSound && ! environmentalSound.playing()) {
        environmentalSound.play();
    }
}

document.addEventListener('visibilitychange', () => {
    if (environmentalSound) {
        if (document.hidden) {
            environmentalSound.pause();
        } else {
            environmentalSound.play();
        }
    }
}, false);


/** Web Monetization */
if (document.monetization)  {
    function handleMonetizationStart(evt) {
        console.log("monetization started:", evt);
    }
    document.monetization.addEventListener('monetizationstart', handleMonetizationStart);

    function handleMonetizationStop(evt) {
        console.log("monetization stopped:", evt);
    }
    document.monetization.addEventListener('monetizationstop', handleMonetizationStop);
} else {
    console.log("no monetization API");
}




/***/ }),

/***/ "./src/intro.js":
/*!**********************!*\
  !*** ./src/intro.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _elfland_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elfland-utils */ "./src/elfland-utils.js");
/* harmony import */ var _assets_intro_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/intro.css */ "./assets/intro.css");
/** intro.js - introductory text for an Elfland Glider world
 * Copyright © 2018-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0
 */




console.log("previousWorld:", sessionStorage.getItem('previousWorld'));
if (! sessionStorage.getItem('previousWorld') && !window.hasOwnProperty('jasmine')) {
    document.addEventListener("DOMContentLoaded", function (details) {
        let nativeXrHtml = '';
        if (!window.hasNativeWebXRImplementation && !window.hasNativeWebVRImplementation) {
            nativeXrHtml = `<div style="margin-top: 1em;">
This browser lacks both <a href="https://caniuse.com/#search=webxr">native WebXR</a> and <a href="https://webvr.info/">native WebVR</a>, so don't complain about performance. </div>`;
        }

        let rotateHtml = '';
        if (AFRAME.utils.device.isMobile() && !(AFRAME.scenes[0] && AFRAME.scenes[0].is("vr-mode"))) {
            rotateHtml = `<div class="portraitOnly" style="color:red;margin-top: 1em;">
Please rotate your device to landscape mode. &#x21B6;</div>`;
        }

        console.log("checkHeadsetConnected:", AFRAME.utils.device.checkHeadsetConnected());
        let closeBtnHtml = '';
        let controlsHtml = `
<table id="vrControls">
    <tr><td colspan="2">If you have a controller: <b>Click</b> VR button ➘ to enter VR mode, then...</td></tr>
    <tr><td colspan="2"><b>Press & Release</b> trigger, button or touchpad to grab (or release) the virtual control stick</td></tr>
    <tr><td><b>Tilt</b> the stick left to turn glider left</td><td><img src="../assets/control-bar-left.png"></td></tr>
    <tr><td><b>Tilt</b> the stick right to turn glider right</td><td><img src="../assets/control-bar-right.png"></td></tr>
    <tr><td colspan="2"><b>Tilt</b> the stick back to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> the stick forward to dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Press</b> trigger, button or touchpad to launch</td></tr>
</table>
<table id="vrControls">
    <tr><td colspan="2">Without a controller...</td></tr>
    <tr><td colspan="2"><b>Click</b> VR button ➘ to enter VR mode</td></tr>
    <tr><td><b>Tilt</b> your head left to turn glider left</td><td><img src="../assets/head-tilt-left.png"></td></tr>
    <tr><td><b>Tilt</b> your head right to turn glider right</td><td><img src="../assets/head-tilt-right.png"></td></tr>
    <tr><td colspan="2"><b>Turn</b> your head left or right to look around without turning glider</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your head up to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your head down to dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Press</b> trigger, button or touchpad to launch</td></tr>
</table>
`;
        if (AFRAME.utils.device.isMobile()) {
            closeBtnHtml = `<div class="closeBtnRed landscapeOnly"></div>`;
            controlsHtml = `
<table class="landscapeOnly" style="width:100%">
    <tr><td colspan="2"><b>Tap</b> the close button ➚ to play in magic window mode, or <b>Tap</b> VR button ➘ and place phone in headset to enter VR mode</td></tr>
    <tr><td><b>Roll</b> your device left to turn glider left</td>
        <td><img src="../assets/device-rotate-ccw.png"></td></tr>
    <tr><td><b>Roll</b> your device right to turn glider right</td>
        <td><img src="../assets/device-rotate-cw.png"></td></tr>
    <tr><td colspan="2"><b>Turn</b> your device left or right to look around without turning glider</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your device up to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your device down to dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Tap</b> the screen to launch</td></tr>
</table>
`;
        } else if (!AFRAME.utils.device.checkHeadsetConnected() && (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.isDesktop)()) {
            closeBtnHtml = `<div class="closeBtnRed"></div>`;
            controlsHtml = `
<table style="width:100%">
    <tr><td colspan="2">Elfland Glider is designed for VR or mobile, but if you want to try it here:</td></tr>
    <tr><td>A or left-arrow</td><td>turn glider left</td></tr>
    <tr><td>D or right-arrow</td><td>turn glider right</td></tr>
    <tr><td>W or up-arrow</td><td>climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td>S or down-arrow</td><td>dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td>space bar</td><td>launch</td></tr>
    <tr><td>VR button ➘</td><td>enter fullscreen mode</td></tr>
</table>
`;
        }

        let mt = atob("ZS1tYWlsOiA8YSBocmVmPSJtYWlsdG86dnJAaG9taW5pZHNvZnR3YXJlLmNvbT9zdWJqZWN0PUVsZmxhbmQlMjBHbGlkZXImYm9keT0=") +
            encodeURIComponent("\n\n\n" + navigator.userAgent + "\n\n\n") +
            atob("Ij52ckBob21pbmlkc29mdHdhcmUuY29tPC9hPg==");

        let html = `
${closeBtnHtml}
<h1 style="text-align:center;">Elfland Glider</h1>
    <div class="wrapper">
      <div id="overview">
        Fly through fantastic worlds,
        help the merry and mischievous light elves,
        & avoid the surly and mischievous dark elves.
        ${rotateHtml}
        ${nativeXrHtml}
        <table id="vrControls">
            <tr><td colspan="2" class="ruleAbove">Remain seated while learning to fly</td></tr>
            <tr><td colspan="2">The wing above you points the direction you're flying</td></tr>
        </table>
      </div>
      ${controlsHtml}
      <div style="font-family:serif; font-size: 0.75rem">
        <div>${mt}</div>
        <div><a href="../CREDITS.md">Credits</a></div>
        <div>Uses <a href="https://caniuse.com/#search=webxr">WebXR</a> or <a href="https://webvr.info/">WebVR</a>, and the <a href="https://aframe.io"><nobr>A-Frame</nobr></a> framework.</div>
        <div>Copyright © 2017-2023 by P. Douglas Reeder; Licensed under the GNU GPL-3.0</div>
        <div><a href="https://github.com/DougReeder/elfland-glider">View source code and contribute</a> </div>
      </div>
    </div>
`;

        let introEl = document.createElement('div');
        introEl.setAttribute('id', 'intro');
        introEl.setAttribute('style', `position:fixed; top:0; bottom:0; left:0; right:0;
                background: rgba(255,255,255,0.75);
                overflow-y: scroll`);

        introEl.innerHTML = html;

        document.body.appendChild(introEl);


        let closeBtn = introEl.querySelector('.closeBtnRed');
        if (closeBtn) {
            closeBtn.addEventListener('click', handleCloseClick);
        }

        function handleCloseClick(evt) {
            console.log("closeBtn click", evt);
            document.body.removeChild(introEl);
            closeBtn.removeEventListener('click', handleCloseClick);

            AFRAME && AFRAME.scenes[0] && AFRAME.scenes[0].emit('startInteraction');

            (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.goFullscreenLandscape)();

            (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.pokeEnvironmentalSound)();
        }
    });
}


/***/ }),

/***/ "./src/shim/requestIdleCallback.js":
/*!*****************************************!*\
  !*** ./src/shim/requestIdleCallback.js ***!
  \*****************************************/
/***/ (() => {

/*!
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
/*
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
window.requestIdleCallback = window.requestIdleCallback ||
  function (cb) {
    return setTimeout(function () {
      var start = Date.now();
      cb({ 
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  }

window.cancelIdleCallback = window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  } 

/***/ }),

/***/ "./src/state.js":
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shim_requestIdleCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shim/requestIdleCallback */ "./src/shim/requestIdleCallback.js");
/* harmony import */ var _shim_requestIdleCallback__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shim_requestIdleCallback__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elfland_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elfland-utils */ "./src/elfland-utils.js");
// state.js - state model for Elfland Glider
// Copyright © 2017-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//




const GRAVITY = 9.807;   // m/s^2
const HUMAN_EYE_ELBOW_DISTANCE = 0.56;   // m
const DIFFICULTY_VR = 0.75;
const DIFFICULTY_MAGIC_WINDOW = 0.6;
const DIFFICULTY_KEYBOARD = 0.5;
const POWERUP_BOOST = 16;
const BAD_CRASH_SPEED = 30;

AFRAME.registerState({
    initialState: {
        armatureEl: null,
        gliderEl: null,
        cameraEl: null,
        leftHandEl: null,
        rightHandEl: null,
        controllerConnections: {},
        isAnyPressedLeft: false,
        isAnyPressedRight: false,
        xSetting: 0,
        zSetting: 0,
        controlStickEl: null,
        controlNeutralHeight: 0.95,
        controlMode: 'HEAD',   // or 'HANDS'
        controlSubmode: 'NONE',   // or 'LEFT' or 'RIGHT'
        time: 0,
        difficulty: DIFFICULTY_MAGIC_WINDOW,
        gliderPosition: {x:-30, y:15, z:30},
        gliderPositionStart: {x:-30, y:15, z:30},
        gliderRotationX: 0,
        gliderRotationY: -45,
        gliderRotationZ: 0,
        gliderRotationYStart: -45,
        isFlying: false,
        gliderSpeed: 5,
        numYellowStars: Math.POSITIVE_INFINITY,
        stars: 0,
        questComplete: false,
        inventory: {},   // keyed by object ID
        hudVisible: true,
        hudAirspeedAngle: 0,
        hudAirspeedColor: 'forestgreen',
        controlsReminderDisplayed: false,
        debug: false   // no way to enable this yet
    },

    nonBindedStateKeys: ['armatureEl', 'gliderEl', 'cameraEl', 'leftHandEl', 'rightHandEl',
        'controllerConnections', 'isAnyPressedLeft', 'xSetting', 'zSetting', 'controlStickEl',
        'controlNeutralHeight', 'controlMode', 'controlSubmode',
        'gliderPositionStart', 'gliderRotationYStart'],

    handlers: {
        setState: function (state, values) {
            for (let pName in values) {
                if (pName !== 'target') {
                    console.log("setting", pName, values[pName]);
                    state[pName] = values[pName];
                }
            }
        },

        setArmatureEl: function (state, armatureEl) {
            this.cacheSound(state, '../assets/411460__inspectorj__power-up-bright-a.mp3', 1.0, 'powerup');

            console.log("hasNativeWebXRImplementation:", window.hasNativeWebXRImplementation);
            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
            console.log("isMobile:", AFRAME.utils.device.isMobile());
            console.log("isMobileVR:", AFRAME.utils.device.isMobileVR());

            // It's best to re-use ThreeJS objects and not store objects in state.
            this.quaternion = new THREE.Quaternion();
            this.euler = new THREE.Euler();

            state.armatureEl = armatureEl;
            state.gliderEl = armatureEl.querySelector('#glider');
            state.cameraEl = armatureEl.querySelector('[camera]');

            let dustEl = AFRAME.scenes[0].querySelector('a-dust');
            if (dustEl) {
                requestIdleCallback(() => {   // delays setup until there's some slack time
                    dustEl.components.dust.setCamera(state.armatureEl);
                }, {timeout: 10_000});
            }

            let bodyEl = state.armatureEl.querySelector('#body');
            let wingEl = state.gliderEl.querySelector('#wing');
            let hudEl = armatureEl.querySelector('#hud');
            this.adjustForMagicWindow(wingEl);
            if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected()) {
                this.adjustHudForVR(hudEl);
                state.difficulty = DIFFICULTY_VR;
            } else {
                this.adjustHudForFlat(hudEl);
                if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            }
            AFRAME.scenes[0].addEventListener('enter-vr', (event) => {
                if (AFRAME.utils.device.checkHeadsetConnected()) {
                    bodyEl.object3D.position.y = -1.6;
                    this.adjustHudForVR(hudEl);
                    this.adjustForMagicWindow(wingEl);
                    state.difficulty = DIFFICULTY_VR;
                }
                (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.pokeEnvironmentalSound)();
            });
            AFRAME.scenes[0].addEventListener('exit-vr', (event) => {
                // bodyEl.object3D.position.y = 0;   // Why is this unnecessary?
                this.adjustHudForFlat(hudEl);
                this.adjustForMagicWindow(wingEl);
                if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)()) {
                    state.difficulty = DIFFICULTY_MAGIC_WINDOW;
                } else {
                    state.difficulty = DIFFICULTY_KEYBOARD;
                }
            });

            if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isDesktop)() && !AFRAME.utils.device.checkHeadsetConnected()) {
                console.log("desktop w/o headset; disabling look-controls so keyboard controls can function");
                state.cameraEl.setAttribute('look-controls', 'enabled', 'false');
            }

            state.gliderEl.addEventListener('raycaster-intersection', (evt) => {
                // Intersection w/ distance 0 is sometimes sent immediately
                if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
                    console.log("CRASH!", evt.detail.els[0].tagName,
                        evt.detail.intersections[0].distance,
                        state.gliderEl.getAttribute('raycaster').far, state.gliderSpeed/4);
                    AFRAME.scenes[0].emit('hover', {});
                    this.cacheAndPlaySound(state, '../assets/198876__bone666138__crash.mp3');

                    setTimeout(() => {
                        if (state.gliderSpeed >= BAD_CRASH_SPEED) {
                            sessionStorage.setItem('returnWorld', location.pathname);
                            location.assign('../ginnungagap/');
                        } else {
                            // console.log("setting start position", state.gliderPositionStart);
                            state.gliderPosition.x = state.gliderPositionStart.x;
                            state.gliderPosition.y = state.gliderPositionStart.y;
                            state.gliderPosition.z = state.gliderPositionStart.z;
                            state.gliderRotationX = 0;
                            state.gliderRotationY = state.gliderRotationYStart;
                            state.gliderSpeed = 5;
                            this.controlStickToNeutral(state);
                            state.hudAirspeedAngle = 0;
                            state.hudAirspeedColor = 'forestgreen';
                            state.cameraEl.object3D.rotation.x = 0;   // only takes effect when look-controls disabled
                            state.cameraEl.object3D.rotation.y = 0;
                            state.cameraEl.object3D.rotation.z = 0;
                            setTimeout(this.showControlsReminder.bind(this, state), 3000);
                        }
                    }, 2000)
                }
            });

            armatureEl.addEventListener('hitstart', (evt) => {
                // console.log('hitstart armature:', evt.detail.intersectedEls);
                evt.detail.intersectedEls.forEach( (el) => {
                    if (el.classList.contains('powerup')) {
                        console.log("powerup");
                        state.gliderSpeed += POWERUP_BOOST;
                        this.playSound(state, 'powerup');
                    } else if (el.classList.contains('star')) {
                        ++state.stars;
                        console.log("collected star", state.stars, "of", state.numYellowStars);
                        el.parentNode?.removeChild(el);
                        this.playSound(state, 'ding');
                    } else if ('key' === el.id) {
                        state.questComplete = true;
                        this.cacheAndPlaySound(state, '../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3');
                        el.parentNode?.removeChild(el);
                        const keyEnt = document.createElement('a-entity');
                        keyEnt.setAttribute('id', 'keyCaptured');
                        keyEnt.setAttribute('gltf-model', '#keyModel');
                        keyEnt.setAttribute('position', '-0.85 0.20 -1.00');
                        keyEnt.setAttribute('rotation', '0 0 90');
                        keyEnt.setAttribute('scale', '10 10 10');
                        state.gliderEl.appendChild(keyEnt);
                        for (const entity of document.querySelectorAll('[dark-elf]')) {
                            console.info("dark elf pursuing");
                            entity.setAttribute('dark-elf', 'goalSelector', '#armature');
                        }
                    } else if (el.classList.contains('proximitySound')) {
                        let url = el.getAttribute('data-sound-url');
                        let volume = el.getAttribute('data-sound-volume') || 1.0;
                        if (url) {
                            this.cacheAndPlaySound(state, url, volume);
                        }
                        let text = el.getAttribute('data-text');
                        let subtitle = AFRAME.scenes[0].querySelector('#subtitle');
                        if (text && subtitle) {
                            subtitle.setAttribute('value', text);
                            setTimeout(() => {
                                subtitle.setAttribute('value', "");
                            }, 5000);
                        }
                   } else if (el.components.link) {
                       console.log("hit link");
                       if (! /ginnungagap/.test(location.pathname)) {
                           sessionStorage.setItem('previousWorld', location.pathname);
                       }
                   }
                });
            });

            // state doesn't have an init, so we'll register this here.
            // desktop controls
            document.addEventListener('keydown', function(evt) {
                // console.log('keydown:', evt.code);
                var cameraRotation = state.cameraEl.getAttribute('rotation');
                switch (evt.code) {
                    case 'KeyA':
                    case 'ArrowLeft':
                        state.cameraEl.object3D.rotation.z += 0.07;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        state.cameraEl.object3D.rotation.z -= 0.07;
                        break;
                    case 'KeyW':
                    case 'ArrowUp':
                        state.cameraEl.object3D.rotation.x += 0.045;
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        state.cameraEl.object3D.rotation.x -= 0.045;
                        break;
                    case 'Space':
                        if (!state.isFlying) {
                            AFRAME.scenes[0].emit('launch', evt);
                        } else {
                            if (state.debug) {
                                AFRAME.scenes[0].emit('hover', evt);
                            }
                        }
                        break;
                    case 'Enter':
                        state.hudVisible = ! state.hudVisible;
                        break;
                }
            }, false);

            // two-controller steering

            state.leftHandEl = document.getElementById("leftHand");
            state.rightHandEl = document.getElementById("rightHand");
            if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isDesktop)()) {
                state.leftHandEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
                state.rightHandEl.setAttribute('hand-controls', 'handModelStyle', 'highPoly');
            }

            this.leftDownHandler = this.handHandler.bind(this, 'LEFT', 'DOWN', state);
            this.leftUpHandler = this.handHandler.bind(this, 'LEFT', 'UP', state);
            this.rightDownHandler = this.handHandler.bind(this, 'RIGHT', 'DOWN', state);
            this.rightUpHandler = this.handHandler.bind(this, 'RIGHT', 'UP', state);

            state.controlStickEl = document.getElementById('controlStick');
        },

        controllerconnected: function (state, evt) {   // evt is name and component; this is state obj
            state.controllerConnections[evt.component.el.id] = true;
            this.adjustControlMode(state);
        },
        controllerdisconnected: function (state, evt) {
            state.controllerConnections[evt.component.el.id] = false;
            this.adjustControlMode(state);
        },
        adjustControlMode: function (state) {
            const oldControlMode =  state.controlMode;
            if (state.controllerConnections.leftHand || state.controllerConnections.rightHand) {
                state.controlMode = 'HANDS';
            } else {
                state.controlMode = 'HEAD';
            }
            if (state.controlMode !== oldControlMode) {
                console.log("changed control mode from", oldControlMode, "to", state.controlMode);
                if (state.controlMode === 'HANDS') {
                    state.leftHandEl?.addEventListener('buttondown', this.leftDownHandler);
                    state.leftHandEl?.addEventListener('buttonup', this.leftUpHandler);
                    state.rightHandEl?.addEventListener('buttondown', this.rightDownHandler);
                    state.rightHandEl?.addEventListener('buttonup', this.rightUpHandler);

                    this.controlStickToNeutral(state);
                    state.controlStickEl.object3D.visible = true;
                } else if (state.controlMode === 'HEAD') {
                    state.leftHandEl?.removeEventListener('buttondown', this.leftDownHandler);
                    state.leftHandEl?.removeEventListener('buttonup', this.leftUpHandler);
                    state.rightHandEl?.removeEventListener('buttondown', this.rightDownHandler);
                    state.rightHandEl?.removeEventListener('buttonup', this.rightUpHandler);

                    state.controlStickEl.object3D.visible = false;
                }
            }
        },
        handHandler: function handHandler(handedness, upDown, state, evt) {
            const wasAnyPressedLeft = state.isAnyPressedLeft;
            const trackedControlsLeft = state.leftHandEl?.components['tracked-controls'];
            const buttonsLeft = trackedControlsLeft &&
                    trackedControlsLeft.controller &&
                    trackedControlsLeft.controller.gamepad &&
                    trackedControlsLeft.controller.gamepad.buttons;
            if (buttonsLeft) {
                state.isAnyPressedLeft = false;
                for (let i = 0; i < buttonsLeft.length; ++i) {   // not a JavaScript array
                    if (buttonsLeft[i].pressed) {
                        state.isAnyPressedLeft = true;
                    }
                }
            } else if ('LEFT' === handedness) {
                state.isAnyPressedLeft = 'DOWN' === upDown;   // hack
            }

            const wasAnyPressedRight = state.isAnyPressedRight;
            const trackedControlsRight = state.rightHandEl?.components['tracked-controls'];
            const buttonsRight = trackedControlsRight &&
                    trackedControlsRight.controller &&
                    trackedControlsRight.controller.gamepad &&
                    trackedControlsRight.controller.gamepad.buttons;
            if (buttonsRight) {
                state.isAnyPressedRight = false;
                for (let i = 0; i < buttonsRight.length; ++i) {   // not a JavaScript array
                    if (buttonsRight[i].pressed) {
                        state.isAnyPressedRight = true;
                    }
                }
            } else if ('RIGHT' === handedness) {
                state.isAnyPressedRight = 'DOWN' === upDown;   // hack
            }

            if (state.isAnyPressedLeft && ! wasAnyPressedLeft) {
                switch (state.controlSubmode) {
                    case 'LEFT':
                        state.controlSubmode = 'NONE';
                        break;
                    case 'RIGHT':
                    case 'NONE':
                        state.controlSubmode = 'LEFT';
                        break;
                }
            } else if (state.isAnyPressedRight && ! wasAnyPressedRight) {
                switch (state.controlSubmode) {
                    case 'RIGHT':
                        state.controlSubmode = 'NONE';
                        break;
                    case 'LEFT':
                    case 'NONE':
                        state.controlSubmode = 'RIGHT';
                        break;
                }
            }
            console.log("controlSubmode:", state.controlSubmode);
        },
        controlStickToNeutral: function (state) {
            state.controlSubmode = 'NONE';
            if (state.controlStickEl) {
                const cameraPos = state.cameraEl.getAttribute("position");
                state.controlNeutralHeight = cameraPos.y - HUMAN_EYE_ELBOW_DISTANCE;
                state.controlStickEl.setAttribute('position', {x: 0, y: state.controlNeutralHeight, z: -0.4});
                state.controlStickEl.object3D.quaternion.set(0, 0, 0, 1);
                state.xSetting = 0;
                state.zSetting = 0;
            }
        },


        // aframe-button-controls: any controller button, or scene touch
        buttondown: function (state, action) {
            // console.log("buttondown", action);
            if (!state.isFlying) {
                AFRAME.scenes[0].emit('launch', action);
            } else {
                if (state.debug) {
                    AFRAME.scenes[0].emit('hover', action);
                }
            }
        },

        countYellowStars: function (state, action) {
            state.numYellowStars = AFRAME.scenes[0].querySelectorAll('.star').length;
            console.log("numYellowStars:", state.numYellowStars);
            if (state.numYellowStars) {
                this.cacheSound(state, '../assets/393633__daronoxus__ding.mp3', 1.0, 'ding');
            }
        },

        launch: function (state, action) {
            console.log("launch", action);

            state.isFlying = true;

            state.controlsReminderDisplayed = false;
            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            if (prelaunchHelp) {
                prelaunchHelp.setAttribute('value', "");
            }
            (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.goFullscreenLandscape)();

            let postlaunchHelp = AFRAME.scenes[0].querySelector('#postlaunchHelp');
            if (postlaunchHelp && postlaunchHelp.src) {
                setTimeout(() => {
                    this.cacheAndPlaySound(state, postlaunchHelp.src)
                }, 60000);
            }
        },
        hover: function (state, action) {
            console.log("hover", action);

            state.isFlying = false;
        },

        loaded: function (state, action) {
            // console.log("loaded", state, action);
            let intro = document.getElementById('intro');
            if (!intro) {
                this.startInteraction(state);
            }
        },

        'enter-vr': function (state) {
            // console.log("enter-vr");
            this.startInteraction(state);
        },
        'exit-vr': function (state, action) {
            // console.log("exit-vr", action);
            if (state.controlsReminderDisplayed) {
                this.showControlsReminder(state);   // updates list of controls for flat screen
            }

            let intro = document.getElementById('intro');
            if (intro) {
                AFRAME.scenes[0].emit('hover', action);
            }
        },
        startInteraction: function (state) {
            if (state.controlsReminderDisplayed) {
                this.showControlsReminder(state);   // updates list of controls
            } else {
                setTimeout(this.showControlsReminder.bind(this, state), 10000);
            }
        },
        showControlsReminder: function (state) {
            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            let intro = document.getElementById('intro');
            const existingHelp = prelaunchHelp?.getAttribute('value');
            if (prelaunchHelp && !existingHelp && (!intro || AFRAME.scenes[0].is("vr-mode")) && !state.isFlying) {
                state.controlsReminderDisplayed = true;
                if (AFRAME.scenes[0].is("vr-mode") && AFRAME.utils.device.checkHeadsetConnected() || AFRAME.utils.device.isMobileVR()) {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nTilt left: turn left\nTilt right: turn right\nTilt back: climb & slow down\nTilt forward: dive & speed up\nTrigger, button or touchpad: launch");
                } else if (AFRAME.utils.device.isMobile()) {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nRoll your device left: turn left\nRoll your device right: turn right\nTilt up: climb & slow down\nTilt down: dive & speed up\nTap screen: launch");
                } else {
                    prelaunchHelp.setAttribute('value', "The wing above you\npoints where you're flying.\n\nA: turn left\nD: turn right\nW: climb (& slow down)\nS: dive (& speed up)\nSpace bar: launch");
                }
            }
        },

        iterate: function (state, action) {
            // A pause in the action is better than flying blind
            action.timeDelta = Math.min(action.timeDelta, 100);
            state.time += action.timeDelta * state.difficulty;

            switch (state.controlMode) {
                case "HEAD":
                    let cameraRotation = state.cameraEl.getAttribute('rotation');
                    if (!cameraRotation) {
                        console.warn("camera rotation not available");
                        return;
                    }

                    let cameraRotX = (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)() ? cameraRotation.x + 20 : cameraRotation.x;
                    state.xSetting = cameraRotX;
                    state.zSetting = cameraRotation.z;
                    break;
                case "HANDS":
                    let quaternion;
                    const leftHandPos = state.leftHandEl?.getAttribute("position");
                    const rightHandPos = state.rightHandEl?.getAttribute("position");
                    switch (state.controlSubmode) {
                        case "LEFT":
                            quaternion = state.leftHandEl.object3D.quaternion;

                            state.controlStickEl.setAttribute('position', leftHandPos);
                           break;
                        case "RIGHT":
                            quaternion = state.rightHandEl.object3D.quaternion;

                            state.controlStickEl.setAttribute('position', rightHandPos);
                            break;
                        case "NONE":
                            this.quaternion.identity();
                            quaternion = this.quaternion;
                            // TODO: slow decay to neutral?
                            break;
                    }
                    state.controlStickEl.object3D?.quaternion?.copy(quaternion)

                    this.euler.setFromQuaternion(quaternion, 'XZY');
                    state.xSetting = this.euler.x * 180 / Math.PI;
                    this.euler.setFromQuaternion(quaternion, 'ZXY');
                    state.zSetting = this.euler.z * 180 / Math.PI;
                    break;
            }
            let xDiff = state.xSetting - state.gliderRotationX;
            let xChange = (xDiff + Math.sign(xDiff)*15) * (action.timeDelta / 1000);
            if (Math.abs(xChange) > Math.abs(xDiff)) {
                xChange = xDiff;
            }
            let newXrot = state.gliderRotationX + xChange;
            newXrot = Math.max(newXrot, -75);
            newXrot = Math.min(newXrot, 75);
            state.gliderRotationX = newXrot;

            let zDiff = state.zSetting - state.gliderRotationZ;
            let zChange = (zDiff + Math.sign(zDiff)*15) * (action.timeDelta / 1000);
            if (Math.abs(zChange) > Math.abs(zDiff)) {
                zChange = zDiff;
            }
            let newZrot = state.gliderRotationZ + zChange;
            newZrot = Math.max(newZrot, -70);
            newZrot = Math.min(newZrot, 70);
            state.gliderRotationZ = newZrot;

            let deltaHeading = state.gliderRotationZ * action.timeDelta / 1000;
            state.gliderRotationY = (state.gliderRotationY + deltaHeading + 180) % 360 - 180;

            if (state.isFlying) {
                let distance = state.gliderSpeed * action.timeDelta / 1000;

                let posChange = (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.calcPosChange)(state.gliderRotationX, state.gliderRotationY+90, distance);
                let altitudeChange = posChange.y;
                state.gliderPosition.x += posChange.x;
                state.gliderPosition.y += altitudeChange;
                state.gliderPosition.z += posChange.z;

                let speedChange = (-Math.sign(altitudeChange) * Math.sqrt(2 * GRAVITY * Math.abs(altitudeChange)) -
                                0.0005 * state.gliderSpeed * state.gliderSpeed)
                        * action.timeDelta / 1000;
                state.gliderSpeed = Math.max(state.gliderSpeed + speedChange, 0.1);
                state.gliderSpeed = Math.min(state.gliderSpeed, 99.4);

                state.hudAirspeedAngle = Math.min(state.gliderSpeed * 9, 359);
                state.hudAirspeedColor = state.gliderSpeed < BAD_CRASH_SPEED ? 'forestgreen' : 'goldenrod';

                state.gliderEl.setAttribute('raycaster', 'far', state.gliderSpeed/4);
            }
        },

        cacheSound(_state, url, volume = 1.0, alias) {
            if (!this.sounds) {
                this.sounds = {};
            }
            if (! this.sounds[url]) {
                this.sounds[url] = new Howl({src: url, volume: volume, autoplay: false});
            }
            if (alias) {
                this.sounds[alias] = this.sounds[url];
            }
        },

        playSound(_state, urlOrAlias) {
            this.sounds?.[urlOrAlias]?.play();
        },

        cacheAndPlaySound(_state, url, volume = 1.0, alias) {
            if (!this.sounds) {
                this.sounds = {};
            }
            if (this.sounds[url]) {
                this.sounds[url].play();
            } else {
                this.sounds[url] = new Howl({src: url, volume: volume, autoplay: true});
                this.sounds[alias] = this.sounds[url];
            }
        },

        placeInGliderPath: function (state, action) {
            // console.log("placeInGliderPath:", action);
            let verticalAngleDeg = state.gliderRotationX + (Math.random()-0.5) * action.variation;
            let horizontalAngleDeg = state.gliderRotationY + 90 + (Math.random()-0.5) * action.variation;
            let posChange = (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.calcPosChange)(verticalAngleDeg, horizontalAngleDeg, action.distance);
            let newPos = {x: state.gliderPosition.x + posChange.x,
                y: state.gliderPosition.y + posChange.y,
                z: state.gliderPosition.z + posChange.z};
            action.el.setAttribute('position', newPos);
            action.el.setAttribute('rotation', 'y', state.gliderRotationY);
        },

        adjustForMagicWindow: function (wingEl) {
            if (! (0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isMagicWindow)()) {
                wingEl.object3D.rotation.x = 0;
                wingEl.object3D.scale.set(1, 1, 1);
            } else {
                wingEl.object3D.rotation.x = THREE.MathUtils.degToRad(-30.0);
                wingEl.object3D.scale.set(1, 1, 3);
            }
        },

        adjustHudForVR: function (hudEl) {
            if (AFRAME.utils.device.isMobile()) {
                hudEl.object3D.position.x = 0.30;
                hudEl.object3D.position.y = 0.30;
            } else {
                hudEl.object3D.position.x = 0.40;
                hudEl.object3D.position.y = 0.42;
            }
            hudEl.object3D.rotation.x = THREE.MathUtils.degToRad(25.0);
            hudEl.object3D.rotation.y = THREE.MathUtils.degToRad(-15.0);
        },

        adjustHudForFlat: function (hudEl) {
            if ((0,_elfland_utils__WEBPACK_IMPORTED_MODULE_1__.isDesktop)()) {
                hudEl.object3D.position.x = 0.85;
                hudEl.object3D.position.y = 0.45;
                hudEl.object3D.rotation.x = 0.0;
                hudEl.object3D.rotation.y = 0.0;
            } else {
                hudEl.object3D.position.x = 0.70;
                hudEl.object3D.position.y = 0.15;
                hudEl.object3D.rotation.x = THREE.MathUtils.degToRad(15.0);
                hudEl.object3D.rotation.y = THREE.MathUtils.degToRad(-20.0);
            }
        }
    },

    computeState: function (newState, payload) {
        try {
            if (!newState.questComplete) {
                newState.questComplete = newState.numYellowStars <= 0 || newState.stars / newState.numYellowStars >= 0.95;
                if (newState.questComplete) {
                    AFRAME.scenes[0].emit('cacheAndPlaySound', '../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3');
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
});

AFRAME.registerComponent('armature-tick-state', {
    init: function () {
        AFRAME.scenes[0].emit('setArmatureEl', this.el);
    },

    tick: function (time, timeDelta) {
        AFRAME.scenes[0].emit('iterate', {time: time, timeDelta: timeDelta});
    }
});


/***/ }),

/***/ "./assets/close-button-red32.png":
/*!***************************************!*\
  !*** ./assets/close-button-red32.png ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94GFwMDIcNssL0AAAJJSURBVFjDzZc7S2NRFIVXxsc1iAoa3yiiEBAfoEim0ammEQMWFhZCOgvBwn/gDxD/RDobBeuAMI1OZxcDQsIgQUFERXFA4zfFNYma+zh3Jo5ZsLt979pn733W3iekAEAakvRN0ndJXyVFJf2W9EvST0kpST9CUk7VApKFlEB6QMLQHl6+sf6VPB6A1M3if3vqZBXIi5Y0zgZSK1KmiuRFyyC1mpz8I8hfB2F5BZD8QPJSOYI1XDgMa2uwuQlNTf4E7e2wtQWLi1BXZ9aYL6mvdGxogHyeEq6uIBZzJ19dhefnsv/Ojlew1usAEo5Oy8tU4PoapqYqfVdW3pIDPD1Bb69bAInXATiLzNwcjri7g4mJst/8vE32Hjc30NzsKlYlefWs6fGxcxCXlzA8DAsLUCg4+2xv+/XMkHv6i9bZCem0M8HFhfPJAfb2oL7eL4CE2dWLRCCTwRipFDQ2ml1JY+GJRCCb9Sc/PATLMhYmBZpyg4N27d1wdGRf3QBT80ugKRUO2+aG7m6prS3w5DMrwcAAnJ/7lyCfh76+QCXwb8L+fsjlzJvw5AQ6Ooyb0Psa9vTA6akzUTZry7MT0mno6jK6ht5CdHDgTHB2ZmvE+Djc3zv77O76C5GnFI+OuqvgyEjZLxp1zsTjo51BLyn2HEZjY5U/vb2FyclK3+lpe1C9nwUtLUbDyHJN0/7+27TPzLinNBYrB1EowMaG2Tj23YBnZ2F93WvBeGtLS37LS7z2VrKaWEo/fS2viYdJTTzN/ufjNPTZz/M/sV5aEsIQ08UAAAAASUVORK5CYII=";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"canyon": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./canyon/canyon.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/state.js */ "./src/state.js");
/* harmony import */ var _canyon_terrain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canyon-terrain */ "./canyon/canyon-terrain.js");
/* harmony import */ var _canyon_shader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canyon-shader.js */ "./canyon/canyon-shader.js");
/* harmony import */ var _dark_elf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dark-elf */ "./canyon/dark-elf.js");
/* harmony import */ var _dark_elf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dark_elf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _src_intro_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/intro.js */ "./src/intro.js");
// canyon.js - maneuvering in cramped spaces, for Elfland Glider
// Copyright © 2019-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0

// import {setEnvironmentalSound} from "../src/elfland-utils";







const INITIAL_POSITION = {x:-1, y:-100, z:48};
const INITIAL_ROTATION_X = 0;
const INITIAL_ROTATION_Y = -175;

AFRAME.registerComponent('canyon', {
    init: function () {
        let sceneEl = this.el;
        sceneEl.emit('setState', {
            gliderPositionStart: INITIAL_POSITION,
            gliderPosition: {x: INITIAL_POSITION.x, y: INITIAL_POSITION.y, z: INITIAL_POSITION.z},
            gliderRotationX: INITIAL_ROTATION_X,
            gliderRotationY: INITIAL_ROTATION_Y,
            gliderRotationYStart: INITIAL_ROTATION_Y
        });

        // sceneEl.emit('countYellowStars', {});

        this.positionSph = new THREE.Spherical(1, Math.PI/2, 0);
        this.position = new THREE.Vector3();
        this.sss = document.querySelector('a-simple-sun-sky');
        this.landscapeEls = document.getElementsByClassName('landscape');
    },

    tick: function (time) {
        this.positionSph.phi = Math.PI * (0.25 + 0.2 * Math.sin(Math.PI * (time / 120000 - 0.5)));
        this.positionSph.theta = Math.PI * time / 120000;
        this.position.setFromSpherical(this.positionSph);
        let positionStr = this.position.x + ' ' + this.position.y + ' ' + this.position.z;
        this.sss.setAttribute('sun-position', positionStr);
        for (const el of this.landscapeEls) {
            el.setAttribute('material', 'sunPosition', positionStr);
        }
    }
});

})();

/******/ })()
;
//# sourceMappingURL=canyon.js.map