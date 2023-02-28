/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/land-shader.js":
/*!*******************************!*\
  !*** ./assets/land-shader.js ***!
  \*******************************/
/***/ (() => {

// land-shader.js - vaguely natural-looking material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0
//
// The produced texture is a mix of the specified colors (default gray brown and dirt brown).
// Faces will be 44% brighter in direct sun and 44% darker when facing away from the sun.
// Example: material="shader:land; color1Yin:#63574d"

AFRAME.registerShader('land', {
    schema: {
        color1Yin: {type: 'color', default: '#63574d'},   // gray brown
        color1Yang: {type: 'color', default: '#553c29'},   // dirt brown
        color2Yin: {type: 'color', default: '#655b43'},   // gray sand
        color2Yang: {type: 'color', default: '#60502f'},   // sand
        sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
    },

    vertexShader: `
uniform vec3 sunNormal;

varying vec3 pos;
varying float sunFactor;

void main() {
  pos = position;
    
  sunFactor = 0.6875 + 0.75 * max(dot(normal, sunNormal), 0.0);
   
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,

    fragmentShader: `
uniform vec3 color1Yin;
uniform vec3 color1Yang;
uniform vec3 color2Yin;
uniform vec3 color2Yang;

varying vec3 pos;
varying float sunFactor;

//	Simplex 3D Noise
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    float strata = smoothstep(-255.0, -253.0, pos.y) - smoothstep(-205.0, -203.0, pos.y) + smoothstep(-103.0, -100.5, pos.y);
    vec3 colorYin  = mix(color1Yin,  color2Yin,  strata);
    vec3 colorYang = mix(color1Yang, color2Yang, strata);

    vec3 inherent = mix(
        colorYin,
        colorYang,
        0.5 * (1.0 + snoise(pos*0.5) + 0.75*snoise(pos))
    );
    gl_FragColor = vec4(inherent * sunFactor, 1.0);
}
`,

    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                color1Yin: {value: new THREE.Color(data.color1Yin)},
                color1Yang: {value: new THREE.Color(data.color1Yang)},
                color2Yin: {value: new THREE.Color(data.color2Yin)},
                color2Yang: {value: new THREE.Color(data.color2Yang)},
                sunNormal: {value: sunPos.normalize()}
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        });
    },
    /**
     * `update` used to update the material. Called on initialization and when data updates.
     */
    update: function (data) {
        this.material.uniforms.color1Yin.value.set(data.color1Yin);
        this.material.uniforms.color1Yang.value.set(data.color1Yang);
        this.material.uniforms.color2Yin.value.set(data.color2Yin);
        this.material.uniforms.color2Yang.value.set(data.color2Yang);
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material.uniforms.sunNormal.value = sunPos.normalize();
        // this.material.uniforms.sunNormal.value.set(sunPos.normalize());
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

0 -1 -2 -3 -4 -5 -6 -5 10 20  25 30 38 40 47 55 61 65 70 75  80 85 90 95 99 99 99 99 85 70  30  1  0  0  0  0 0 0 0 0  0
0 -2 -3 -5 -5 -6 -6  5 20 25  30 35 40 46 50 51 59 62 65 70  75 80 85 90 95 99 99 99 94 81  79 68 59  1  0  0 0 0 0 0  0
0 -2 -4 -6 -6 -7 15 20 25 30  35 40 41 45 47 45 40 30 35 45  50 60 65 75 80 85 90 95 90 87  82 70 69 45  1  0 0 0 0 0  0
0 -2 -4 -5 -6 -7 20 31 42 47  49 46 47 46 40 35 30 15 10 10   5 10 20 45 65 65 70 75 86 84  80 78 71 55 66  5 0 0 0 0  0
0 -1 -3 -4 -5 -6 22 39 41 50  52 50 48 41 35 20 10  1  0  0   0  0  0  5 15 40 50 70 82 83  84 75 77 72 63 59 1 0 0 0  0


0 -1 -2 -3  -4 -5 15 48 55 60  56 53 47 40 35  1 0 0 0 0  0 0  0  0  0  5 67 72 79 81  80 79 78 76 73 65 62  5  0  0  0
0 -1 -2 -3  -4  5 45 55 60 65  60 55 50 45 15  0 0 0 0 0  0 0  0  0  5 65 71 75 78 79  78 77 74 72 70 64 58 45  0  0  0
0 -1 -2 -3   5 25 55 60 65 70  65 60 55 50  5  0 0 0 0 0  0 0  0  5 55 63 68 72 71 68  65 68 73 70 65 60 55 50  5  0  0
0 -1 -2  5  50 55 60 65 70 75  70 65 60 55 50  5 0 0 0 0  0 0  5 45 60 62 65 60 55 50  20 50 55 57 55 54 55 52 48  0  0
0 -1  5 50  55 65 65 70 75 75  75 69 65 60 55 50 5 0 0 0  0 0 35 50 54 60 55 50 45  0   0  5 44 49 52 55 54 52 48  1  0

0  5 50 60 65 70 75 75 75 75  75 71 65 60 55 50 45  5  0  0  0 0 40 49 55 50 45 40  5  0   0  0  5 52 54 56 57 56 54 51  0
0  5 65 70 75 75 75 75 75 75  75 75 70 65 60 55 50 45  5  0  0 0 47 50 49 40 35  5  0  0   0  0  0 55 57 59 60 59 57 54  0
0  5 65 70 75 75 75 75 75 75  75 75 75 70 65 60 55 50 45  0  0 0  0 47 46 40  5  0  0  0   0  0  5 60 64 65 64 60 59 55  0
0 55 60 65 70 75 75 75 75 75  75 75 75 75 70 65 60 55 48  5  0 0  0  0  0  0  0  0  0  0   5 70 69 69 70 67 64 63 60  1  0
0 50 55 63 75 77 75 75 75 75  75 75 75 75 72 68 63 58 51 45  5 0  0  0  0  0  0  5 10 70  74 73 72 71 71 70 67 64 60  0  0


0 40 50 71 79 77 75 72 70 65  70 75 75 74 70 65 60 53 46 40  47 55 60 65 70 75 75 75 75 75  75 75 74 73 72 72 69 64 57 0  0
0 45 55 65 78 79 77 70 65 65  65 70 72 68 63 58 55 47 42 46  59 63 68 72 77 80 80 79 79 79  78 78 77 76 75 72 67 59 51 0  0
0 40 60 69 81 82 78 70 65 60  60 60 60 58 55 53 47 43 50 60  68 70 76 79 84 85 85 83 83 83  84 83 82 79 76 70 62 52  1 0  0
0 35 50 70 84 85 84 75 65 60  55 53 50 49 48 45 42 47 55 68  74 77 83 85 90 90 90 87 87 86  87 84 83 78 72 65 54 41  0 0  0
0  0 40 74 85 86 87 78 75 68  49  1  1  1 30 39 47 55 60 65  80 84 90 90 95 95 95 91 91 89  88 85 79 73 66 57 44 30  0 0  0

0 0 40 80 90 92 90 85 80 70   1  0  0  0  1 45 55 60 70 75  85 90 95 95 99 99 99 95 95 92  89 86 73 67 58 47 33 17 0 0  0
0 0 35 80 91 93 94 90 80 70   1  0  0  0  0  1 55 65 75 80  90 95 99 99 99 99 99 99 96 93  90 87 65 58 48 35 18  1 0 0  0
0 0 30 75 85 95 95 95 85 75   1  0  0  0  0  1 50 75 90 94  96 97 95 95 95 99 95 90 82 80  75 70 63 46 34 18  1  0 0 0  0
0 0  5 45 80 92 96 96 96 90  85  1  1  1  1 55 75 95 95 96  95 90 90 90 90 90 85 80 70 71  63 54 45 34  1  0  0  0 0 0  0
0 0  0 35 70 85 95 96 96 95  95 90 85 80 70 75 95 95 96 95  90 87 86 84 83 80 75 70 57 59  55 46  1  0  0  0  0  0 0 0  0


0 0 0 15 50 80 85 90 95 95  95 95 95 95 95 95 95 95 95 90  85 81 79 74 62 56 49 44 40 38  12 0 0 0 0 0 0 0 0 0  0
0 0 0  0  5 61 79 85 90 95  99 99 99 99 99 99 99 90 85 80  75 62 50 39 29 26 23 20 36 35  10 0 0 0 0 0 0 0 0 0  0
0 0 0  0  0  1 85 89 92 95  98 99 99 98 98 97 96 93 88 84   1  1  1  1  0  0  0  0 33 32   0 0 0 0 0 0 0 0 0 0  0
0 0 0  0  0  0  1 90 93 94  97 98 97 96 97 96 95 94  1  1   0  0  0  0  0  0  0  0 31 30   0 0 0 0 0 0 0 0 0 0  0
0 0 0  0  0  0  1 92 94 96  97 96 96 95 94  1  1  1  0  0   0  0  0  0  0  0  0  0 29 29   0 0 0 0 0 0 0 0 0 0  0

0 0  0  0  0  0  1 92 94 95  96 95 94 94  1  0  0  0  0  0   0  0  1  1  1  1  1  1 26 27  23  3  2  1  1  1  0  0  0 0  0
0 0  0  0  0  0  1 92 93 94  95 94 93  1  0  0  0  0  0  1   1  1  1  2  2  2  2  2 24 25  23 18  3  2  2  1  1  0  0 0  0
0 0  0  0  0  0  1 92 93 94  94 93 92  1  0  0  0  1  1  1   2  2  2  2 14 14 17 20 22 23  24 22 20 19  3  2  1  0  0 0  0
0 0  0  0  0  0  1 92 92 93  92 92 91  1  0  0  1  1  2  2   2 11 12 13 15 16 17 18 20 22  23 23 22 19 13  2  1  1  0 0  0
0 0  0  0  0  1 90 91 92 91  91 90  1  0  0  0  1  2  2  9  11 12 13 14 15 15 16 17 18 19  21 22 23 21 17  3  2  1  0 0  0
0 0  0  0  0  1 89 90 91 90  89  1  1  0  0  1  2  6  7  9  11 12 13 14 14 14  2  1  1  0   0 18 22 24 22 18  2  1  1 0  0
0 0  0  0  1  1 88 89 90 89  88  1  0  0  1  1  2  7  8 10  11 12 13 13 14 14  2  1  0  0   0 19 23 25 23 19  3  2  1 0  0
0 0  0  1  1 87 88 89 88 88  87  1  0  0  1  2  2  8  9 10  11 12 13 14 15 15  2  1  0  0   1 16 22 25 26 24 20  2  1 1  0
0 0  1  1 86 87 88 88 87 84   1  1  0  0  1  2  8  9 10 10  11 12 13 14 15 16 17 18 19 21  22 23 24 26 27 25 21  3  2 1  0
0 0  1 84 86 87 87 86 84 80   1  0  0  0  1  2  9 10 10 10  10 12 13 15 16 16 17 19 21 23  24 26 27 28 28 26 22 14  2 1  0
0 1  1 84 86 86 85 83 79 75   1  0  0  0  1  2  8 10 10 10  10 12 13  4  6 15 16 18 20 21  23 24 26 27 29 27 23 15  2 1  0
0 1 81 82 84 85 84 82 78 66   1  0  0  0  1  2  2  9 10 10  10 11  2  2  1  1  1  1  1  1   1 21 25 28 30 28 24 16  2 1  0
0 1 81 82 84 84 82 81 77  1   0  0  0  0  1  1  2  9 11 11   4  2  2  1  1  0  0  0  0  0   0  1 25 29 31 29 25  2  1 1  0
0 1 81 82 83 83 81 76  1  0   0  0  0  0  0  1  2 10 12 13   2  1  1  1  0  0  0  0  0  0   0  0 26 30 32 30 26  1  1 0  0
0 1 80 81 82 81 80  1  0  0   0  0  0  0  0  1  2  2 14 15   6  1  0  0  0  0  1  1  1  0   0  0 27 31 33 31 27  1  0 0  0
0 1 79 80 81 80 79  1  0  0   0  0  0  0  0  1  1  2 15 16  18 06  1  0  0  1 28 28 28  1   0  0 28 32 34 32 28  1  0 0  0
0 0  1 79 80 79 77  1  0  0   0  0  0  0  0  0  1  2 17 18  20 22 24 26 28 29 30 30 30 28   0  0  1 29 33 35 33 29  1 0  0
0 0  1 77 78 79 77  1  0  0   0  0  0  0  0  0  1  2 19 20  21 23 23 27 29 30 30 30 30 28   0  0  0 30 34 36 35 33  1 0  0
0 0  1 76 77 78 76  1  0  0   0  0  0  0  0  0  0  0  0  0   0  0  0  1 29 30 31 30 30 29   1  0  0 31 35 37 36 33  1 1  0
0 0  1 75 76 77 75  1  0  0   0  0  0  0  0  0  0  0  0  0   0  0  0  0  1 30 32 34 33 33  31  0  0 31 35 37 38 36 32 1  0
0 0  1 74 75 76 75 74  1  1   1  1  1  1  1  1  0  0 48 47  47  0  0  0  0  0  1 36 35 35  33  0  0  1 33 37 39 37 33 1  0
0 1 73 74 75 74 73 72 69 66  65 63 63 62 62 59 55 54 53 52  52 51  0  0  0  0  0  1 38 39   1  0  0  0 34 38 40 38 34 1  0
0 1 72 73 74 73 72 70 68 67  66 64 64 64 62 60 58 57 56 55  55 54 50 48  1  0  0  0 40 39   0  0  0  1 39 40 41 39 35 1  0
0 1 72 72 73 73 72 70 68 68  68 66 65 65 62 61 60 59 58 57  57 56 54 52 48  0  0  1 44 43   1  0  1 37 41 42 40 36  1 0  0
0 1 70 71 71 72 71 70 69 68  68 67 66 65 63 62 61 57 56 56  58 57 56 54 52 47 46 45 45 44  45 41 37 41 42 43 41 37  1 0  0


0 1 70 69 70 71 71 71 70 69  68 66 65 64 61 60 58 53 52 53  56 55 54 55 54 51 50 48 46 45  43 44 40 43 44 43 40 32 1 0  0
0 1 69 68 69 69 70 69 69 68  67 65 63 61 57 56 54  1  1  1  52 51 50 52 52 53 52 51 48 47  46 46 44 45 44 42 39  1 0 0  0
0 0  1 67 67 68 68 67 67 66  65 63 59 57  1  1  1  0  0  0   1  1 46 45 48 51 50 50 49 48  48 47 46 44 43 41 35  1 0 0  0
0 0  0  1 66 65 65 64 64 63  62 60  1  1  0  0  0  0  0  0   0  0  0  1 41 47 46 46 47 47  46 45 44 40 41 35  1  0 0 0  0
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

    // computes normals that are smooth for shallow angles
    const creasedGeometry = (0,_src_BufferGeometryUtilsRump__WEBPACK_IMPORTED_MODULE_0__.toCreasedNormals)(geometry, 0.45 * Math.PI);
    this.geometry = creasedGeometry;
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

    this.setModeOrPursuit(wanderList[0]);

    setInterval(this.randomMode.bind(this, el), 3000);

    el.addEventListener('raycaster-intersection', (evt) => {
      // Intersection w/ distance 0 is sometimes sent immediately
      if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
        this.isAvoidingLandcape = true;
        const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 36;
        el.object3D.rotation.set(newXRot, el.object3D.rotation.y, el.object3D.rotation.z);
        this.setModeOrPursuit(wanderList[0]);
      }
    });
    el.addEventListener('raycaster-intersection-cleared', (evt) => {
      // console.log("cleared intersections:", evt.detail?.clearedEls)
      setTimeout(() => {   // keeps turning away from wall for another second
        this.isAvoidingLandcape = false;
        this.setModeOrPursuit(wanderList[0]);
      }, 1000);
    });
  },

  update(oldData) {
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
            this.powerup = new Howl({src: ['../assets/411460__inspectorj__power-up-bright-a.mp3']});

            console.log("hasNativeWebXRImplementation:", window.hasNativeWebXRImplementation);
            console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
            console.log("isMobile:", AFRAME.utils.device.isMobile());
            console.log("isMobileVR:", AFRAME.utils.device.isMobileVR());

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
                    let crash = new Howl({src: ['../assets/198876__bone666138__crash.mp3']});
                    crash.play();

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
                        this.powerup.play();
                    } else if (el.classList.contains('star')) {
                        ++state.stars;
                        console.log("collected star", state.stars, "of", state.numYellowStars);
                        el.parentNode.removeChild(el);
                        this.ding.play();
                    } else if ('key' === el.id) {
                        state.questComplete = true;
                        let horncall = new Howl({src: ['../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3']});
                        horncall.play();
                        el.parentNode.removeChild(el);
                        for (const entity of document.querySelectorAll('[dark-elf]')) {
                            console.info("dark elf pursuing");
                            entity.setAttribute('dark-elf', 'goalSelector', '#armature');
                        }
                    } else if (el.classList.contains('proximitySound')) {
                        let url = el.getAttribute('data-sound-url');
                        let volume = el.getAttribute('data-sound-volume') || 1.0;
                        if (url) {
                            new Howl({src: url, volume: volume, autoplay: true});
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
            if (state.controlStickEl) {
                const cameraPos = state.cameraEl.getAttribute("position");
                state.controlNeutralHeight = cameraPos.y - HUMAN_EYE_ELBOW_DISTANCE;
                state.controlStickEl.setAttribute('position', {x: 0, y: state.controlNeutralHeight, z: -0.4});
                state.controlStickEl.setAttribute('rotation', {x: 0, y: 0, z: 0});
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
                this.ding = new Howl({src: ['../assets/393633__daronoxus__ding.mp3']});
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
                let postlaunchHelpAudio = new Howl({src: [postlaunchHelp.src]});
                setTimeout(() => {
                    postlaunchHelpAudio.play();
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
            if (prelaunchHelp && (!intro || AFRAME.scenes[0].is("vr-mode")) && !state.isFlying) {
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
                    const leftHandPos = state.leftHandEl?.getAttribute("position");
                    const rightHandPos = state.rightHandEl?.getAttribute("position");
                    switch (state.controlSubmode) {
                        case "LEFT":
                            const leftHandRot = state.leftHandEl?.getAttribute('rotation');

                            state.controlStickEl.setAttribute('position', leftHandPos);
                            state.controlStickEl.setAttribute('rotation', leftHandRot);

                            state.xSetting = leftHandRot.x;
                            state.zSetting = leftHandRot.z;
                            break;
                        case "RIGHT":
                            const rightHandRot = state.rightHandEl?.getAttribute('rotation');

                            state.controlStickEl.setAttribute('position', rightHandPos);
                            state.controlStickEl.setAttribute('rotation', rightHandRot);

                            state.xSetting = rightHandRot.x;
                            state.zSetting = rightHandRot.z;
                            break;
                        case "NONE":
                            // TODO: slow decay to neutral?
                            break;
                    }
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
                    let horncall = new Howl({src: ['../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3']});
                    horncall.play();
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
/******/ 			// no module.id needed
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
/* harmony import */ var _assets_land_shader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/land-shader.js */ "./assets/land-shader.js");
/* harmony import */ var _assets_land_shader_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_land_shader_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _dark_elf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dark-elf */ "./canyon/dark-elf.js");
/* harmony import */ var _dark_elf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dark_elf__WEBPACK_IMPORTED_MODULE_3__);
// canyon.js - maneuvering in cramped spaces, for Elfland Glider
// Copyright © 2019-2020 P. Douglas Reeder; Licensed under the GNU GPL-3.0

// import {setEnvironmentalSound} from "../src/elfland-utils";




// import '../src/intro.js'


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