/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./city/city-terrain.js":
/*!******************************!*\
  !*** ./city/city-terrain.js ***!
  \******************************/
/***/ (() => {

// city-terrain.js - the landscape geometry for an arctic city
// Data and code are in one file to avoid asynchronous loading.
// Copyright © 2023 Doug Reeder; Licensed under the GNU GPL-3.0

const X_POINTS = 29;
const Z_POINTS = 33;
const terrainHeights = `
0   0   0   0   0   0   0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
0  40  40  40  40  34  30 23 25 28 30 24 18 13  7 11 14 18 15 11  8  4  8 10 14 15  8  0  0
0  40  80  80  80  69  60 46 50 55 60 49 37 26 13 22 27 37 30 22 16  8 16 20 27 30 16  6  0
0  40  80 120 120 103  91 70 76 83 90 73 55 38 20 32 43 55 44 34 23 12 22 32 41 45 19  4  0
0  40  80 120 160 132 100 73 54 57 64 55 42 25 14 22 30 37 28 18  4  4  4  2  4  4  2  2  0
0  51 103 127 134 108  95 75 55 36 39 38 28 13  8 11 13 19 14  2  2  2  2  0  2  2  0  0  0
0  25  64  96  90  84  81 71 50 37 19 20  1  1  1  1  1  1  1  1  1  1  0  0  0  0  0  0  0
0  12  24  36  48  60  64 55 47 25 19  1  1  1  1  1  1  1  1  1  1  1  1  1  0  0  0  0  0
0  14  28  42  56  70  41 43 28 23  1  1  1  1  1  1  1  1  1  1  1  1  1  1 .6  0  0  0  0
0  12  24  36  48  60  47 21 22  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1 .6  0  0  0
0  18  36  53  70  55  39 24  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0  0
0  20  40  60  81  54  28  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0  0
0  28  57  85  85  57  29  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0  14  43  72  54  37  19  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0  20  40  59  45  30  15  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0  15  30  44  33  22  12  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0  19  38  56  42  29  15  1  1  1  1  1  1  1  1  1  1 -2  1  1  1  1  1  1  1  1  1  1  0
0  12  24   4   2   2   2  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0   4   2   2   0   0   0  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0   2   0   0   0   0   0  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0   0   0   0   0   0   1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0
0   0   0   0   2   2   4  4  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  0  0
0   0   2   2   4  24  16  8  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1 .6  0  0
0   2   4  33  45  37  28 19 10  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1  1 .6  0  0  0
0   8  17  25  33  33  27 20 14  7  1  1  1  1  1  1  1  1  1  1  1  1  1  1 .6  0  0  0  0
0   6  13  19  25  33  31 24 16  8 10  1  1  1  1  1  1  1  1  1  1  1  1 .6  0  0  2  2  0
0  11  22  34  39  42  33 24 15 20 16 17  1  1  1  1  1  1  1  1  1  1  0  0  0  2  4  4  0
0  17  33  50  53  43  33 23 30 33 34 24 18 15 19 14 10  5  3 .6  0  0  0  2  2  4 19  9  0
0  22  44  65  52  41  30 40 50 51 39 32 27 30 37 28 19  4 .6  0  0  2  2  4 26 41 28 14  0
0  32  65  48  39  30  21 30 38 38 31 25 35 45 55 41 28  2  0  0  2  4 40 35 39 55 37 18  0
0  32  42  32  26  20  15 20 25 25 20 17 23 30 37 27 18  2  0  0  2 16 27 23 26 37 23 12  0
0  16  21  16  13  10   7 10 12 12 10  8 11 15 18 14  9 .5  0  0  2  8 13 12 13 18 12  6  0
0   0   0   0   0   0   0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
`;


AFRAME.registerGeometry('city-terrain', {
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

/***/ "./src/settlement-shader.js":
/*!**********************************!*\
  !*** ./src/settlement-shader.js ***!
  \**********************************/
/***/ (() => {

// settlement-shader.js - smooth noise, with one pair of colors inside a radius, another pair outside
// Copyright © 2019, 2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//
// The produced texture is a mix of the specified colors.
// Faces will be 50% brighter in direct sun and 50% darker when facing away from the sun.
// Example: material="shader:settlement; colorYinInside:#63574d"

AFRAME.registerShader('settlement', {
    schema: {
        colorYinInside: {type: 'color', default: '#599432'},   // grass green
        colorYangInside: {type: 'color', default: '#557736'},   // dark green
        colorYinOutside: {type: 'color', default: '#e8e5e2'},   // off white
        colorYangOutside: {type: 'color', default: '#d8d2d0'},   // darker off white
        colorYinWater: {type: 'color', default: '#006994'},   // water blue
        colorYangWater: {type: 'color', default: '#005b89'},   // darker water blue
        radius: {type: 'number', default: 1000},
        sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
    },

    vertexShader: `
uniform vec3 sunNormal;

varying vec3 pos;
varying float sunFactor;

void main() {
  pos = position + vec3(-300.0, 0.0, 0.0);
    
  sunFactor = 0.5 + max(dot(normal, sunNormal), 0.0);
   
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,

    fragmentShader: `
uniform vec3 colorYinInside;
uniform vec3 colorYangInside;
uniform vec3 colorYinOutside;
uniform vec3 colorYangOutside;
uniform vec3 colorYinWater;
uniform vec3 colorYangWater;
uniform float radiusSquared;

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
    float pct = smoothstep(0.0, 1.0, pos.y);
    bool isInside = pos.x * pos.x + pos.z * pos.z < radiusSquared;
    vec3 colorYin = mix(
        colorYinWater,
        isInside ? colorYinInside : colorYinOutside,
        pct
    );
    vec3 colorYang = mix(
        colorYangWater,
        isInside ? colorYangInside : colorYangOutside,
        pct
    );
    
    vec3 inherent = mix(
        colorYin,
        colorYang,
        0.5 * (1.0 + snoise(pos*0.4))
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
                colorYinInside: {value: new THREE.Color(data.colorYinInside)},
                colorYangInside: {value: new THREE.Color(data.colorYangInside)},
                colorYinOutside: {value: new THREE.Color(data.colorYinOutside)},
                colorYangOutside: {value: new THREE.Color(data.colorYangOutside)},
                colorYinWater: {value: new THREE.Color(data.colorYinWater)},
                colorYangWater: {value: new THREE.Color(data.colorYangWater)},
                radiusSquared: {value: data.radius * data.radius},
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
        this.material.uniforms.colorYinInside.value.set(data.colorYinInside);
        this.material.uniforms.colorYangInside.value.set(data.colorYangInside);
        this.material.uniforms.colorYinOutside.value.set(data.colorYinOutside);
        this.material.uniforms.colorYangOutside.value.set(data.colorYangOutside);
        this.material.uniforms.colorYinWater.value.set(data.colorYinWater);
        this.material.uniforms.colorYangWater.value.set(data.colorYangWater);
        this.material.uniforms.radiusSquared.value = data.radius * data.radius;
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material.uniforms.sunNormal.value = sunPos.normalize();
    },
});


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
            this.cacheSound(state, '../assets/411460__inspectorj__power-up-bright-a.mp3', 1.0, 'powerup');

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
                        el.parentNode.removeChild(el);
                        this.playSound(state, 'ding');
                    } else if ('key' === el.id) {
                        state.questComplete = true;
                        this.cacheAndPlaySound(state, '../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3');
                        el.parentNode.removeChild(el);
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
/******/ 			"city": 0
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
/*!**********************!*\
  !*** ./city/city.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/elfland-utils */ "./src/elfland-utils.js");
/* harmony import */ var _src_state_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/state.js */ "./src/state.js");
/* harmony import */ var _city_terrain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./city-terrain */ "./city/city-terrain.js");
/* harmony import */ var _city_terrain__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_city_terrain__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_settlement_shader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/settlement-shader.js */ "./src/settlement-shader.js");
/* harmony import */ var _src_settlement_shader_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_src_settlement_shader_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _src_intro_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/intro.js */ "./src/intro.js");
// city.js - a domed arctic city, for Elfland Glider
// Copyright © 2019-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0








const INITIAL_POSITION = {x:385, y:101, z:385};
const INITIAL_ROTATION_X = 0;
const INITIAL_ROTATION_Y = 45;
const CITY_RADIUS_SQ = 921600;
AFRAME.registerComponent('city', {
    init: function () {
        (0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.setEnvironmentalSound)('Gabriel Baker - Worlds.mp3', 0.2);

        let sceneEl = this.el;
        sceneEl.emit('setState', {
            gliderPositionStart: INITIAL_POSITION,
            gliderPosition: {x: INITIAL_POSITION.x, y: INITIAL_POSITION.y, z: INITIAL_POSITION.z},
            gliderRotationX: INITIAL_ROTATION_X,
            gliderRotationY: INITIAL_ROTATION_Y,
            gliderRotationYStart: INITIAL_ROTATION_Y
        });


        // creates random buildings that fit under the dome
        const numStyles = 6;
        let buildings = this.randomBuildings(numStyles);   // array of arrays

        let buildingEls = new Array(numStyles);

        buildingEls[0] = document.createElement('a-shader-buildings');
        buildingEls[0].setAttribute('wall-color', '#808080');
        buildingEls[0].setAttribute('wall-src', '#concreteAggregate');
        buildingEls[0].setAttribute('wall-zoom', 1.5);

        buildingEls[1] = document.createElement('a-shader-buildings');
        buildingEls[1].setAttribute('x-proportion-geometry', 6);
        buildingEls[1].setAttribute('x-proportion-material', 6);
        buildingEls[1].setAttribute('z-proportion-geometry', 6);
        buildingEls[1].setAttribute('z-proportion-material', 6);
        buildingEls[1].setAttribute('y-proportion-geometry', 5.5);
        buildingEls[1].setAttribute('y-proportion-material', 5.5);
        buildingEls[1].setAttribute('window-width', 0.95);
        buildingEls[1].setAttribute('window-height', 0.0);
        buildingEls[1].setAttribute('wall-color', '#a0a0a0');   // light gray
        buildingEls[1].setAttribute('wall-src', '#concreteBlocks');
        buildingEls[1].setAttribute('wall-zoom', 2.5);

        buildingEls[2] = document.createElement('a-shader-buildings');
        buildingEls[2].setAttribute('x-proportion-geometry', 5);
        buildingEls[2].setAttribute('x-proportion-material', 5);
        buildingEls[2].setAttribute('z-proportion-geometry', 5);
        buildingEls[2].setAttribute('z-proportion-material', 5);
        buildingEls[2].setAttribute('y-proportion-geometry', 3.5);
        buildingEls[2].setAttribute('y-proportion-material', 3.5);
        buildingEls[2].setAttribute('window-width', -0.5);
        buildingEls[2].setAttribute('window-height', 0.0);
        buildingEls[2].setAttribute('wall-color', '#6e2b11');   // brick red
        buildingEls[2].setAttribute('wall-src', '#brick');
        buildingEls[2].setAttribute('wall-zoom', 2.25);

        buildingEls[3] = document.createElement('a-shader-buildings');
        buildingEls[3].setAttribute('x-proportion-geometry', 6);
        buildingEls[3].setAttribute('x-proportion-material', 6);
        buildingEls[3].setAttribute('z-proportion-geometry', 6);
        buildingEls[3].setAttribute('z-proportion-material', 6);
        buildingEls[3].setAttribute('y-proportion-geometry', 4.5);
        buildingEls[3].setAttribute('y-proportion-material', 4.5);
        buildingEls[3].setAttribute('window-width', -0.5);
        buildingEls[3].setAttribute('window-height', 0.3);
        buildingEls[3].setAttribute('wall-color', '#675342');   // brown brick
        buildingEls[3].setAttribute('wall-src', '#medievalBrick1');
        buildingEls[3].setAttribute('wall-zoom', 3.5);

        buildingEls[4] = document.createElement('a-shader-buildings');
        buildingEls[4].setAttribute('y-proportion-geometry', 5);
        buildingEls[4].setAttribute('y-proportion-material', 5);
        buildingEls[4].setAttribute('window-width', 0.5);
        buildingEls[4].setAttribute('window-height', 0.0);
        buildingEls[4].setAttribute('wall-color', '#a5a696');
        buildingEls[4].setAttribute('wall-src', '#stoneBlocks');
        buildingEls[4].setAttribute('wall-zoom', 5.0);

        buildingEls[5] = document.createElement('a-shader-buildings');
        buildingEls[5].setAttribute('window-width', 0.8);
        buildingEls[5].setAttribute('window-height', -0.1);
        buildingEls[5].setAttribute('wall-color', '#a5a696');
        buildingEls[5].setAttribute('wall-src', '#medievalBrick2');
        buildingEls[5].setAttribute('wall-zoom', 5.0);

        for (let s=0; s<numStyles; ++s) {
            buildingEls[s].setAttribute('elevation-geometry', 1);
            buildingEls[s].setAttribute('elevation-material', 1);
            buildingEls[s].setAttribute('sun-position', "-1 0.5 1");
            buildingEls[s].setAttribute('buildings', JSON.stringify(buildings[s]));
            buildingEls[s].classList.add('landscape');
            sceneEl.appendChild(buildingEls[s]);
        }


        let domeEl = document.createElement('a-entity');
        domeEl.setAttribute('obj-model', (0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.isDesktop)() ? 'obj:dome16.obj' : 'obj:#dome-obj-mobile');
        if ((0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.isDesktop)()) {THREE.Cache.remove("dome14.obj");}
        domeEl.setAttribute('material','shader:flat; color:#222; wireframe:true; side:back');
        domeEl.classList.add('landscape');
        sceneEl.appendChild(domeEl);


        for (let p=0; p<4; ++p) {
            let powerupEl = document.createElement('a-entity');
            powerupEl.setAttribute('class', 'powerup');
            powerupEl.setAttribute('position', this.randomIntersection());
            powerupEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-1.5 -1.5 -1.5', vertexB:'1.5 -1.5 1.5', vertexC:'1.5 1.5 -1.5'});
            powerupEl.setAttribute('material', {visible:false});

            let powerupInnerEl = document.createElement('a-icosahedron');
            powerupInnerEl.setAttribute('material', {color:'#ff0000'});
            powerupInnerEl.setAttribute('glow', {c: '0.2', color: '#ff0000', scale:'3.5'});

            powerupEl.appendChild(powerupInnerEl);
            sceneEl.appendChild(powerupEl);
        }

        let portalEl = document.createElement('a-entity');
        portalEl.setAttribute('id', 'nextQuestPortal');
        portalEl.setAttribute('position', this.randomIntersection());
        portalEl.setAttribute('rotation', '0 45 0');
        portalEl.setAttribute('scale', '5 5 0');
        portalEl.setAttribute('link', 'href:../island/; title:Elfland; image:../island/screenshot.png; on:hitstart; visualAspectEnabled:true');
        sceneEl.appendChild(portalEl);


        // this.positionSph = new THREE.Spherical(1, Math.PI/2, 0);
        // this.position = new THREE.Vector3();
        // this.sss = document.querySelector('a-simple-sun-sky');
        // this.buildingEl = document.getElementById('terrain');

        if ((0,_src_elfland_utils__WEBPACK_IMPORTED_MODULE_0__.isDesktop)()) {
            // This decoration does not need to be pre-loaded via the asset mgr
            let towerEl = document.createElement('a-gltf-model');
            towerEl.setAttribute('src', '../assets/tower/source/tower.gltf');
            towerEl.setAttribute('position', '0 -3 0');
            towerEl.setAttribute('rotation', '0 -135 0');
            towerEl.setAttribute('scale', '15 15 15');
            towerEl.classList.add('landscape');
            sceneEl.appendChild(towerEl);
        }
    },

    // tick: function (time) {
    //     this.positionSph.phi = Math.PI * (0.25 + 0.2 * Math.sin(Math.PI * (time / 120000 - 0.5)));
    //     this.positionSph.theta = Math.PI * time / 120000;
    //     this.position.setFromSpherical(this.positionSph);
    //     let positionStr = this.position.x + ' ' + this.position.y + ' ' + this.position.z;
    //     this.sss.setAttribute('sun-position', positionStr);
    //     // this.buildingEl.setAttribute('material', 'sunPosition', positionStr);
    // }

    randomBuildings: function (numStyles) {
        let buildings = new Array(numStyles);
        for (let s=0; s<numStyles; ++s) {
            buildings[s] = [];
        }
        // increments x by the common multiple of x-proportion for building styles
        for (let i=0, x=-930; x <= 930; ++i, i%4 ? x+= 60 : x+=90) {
            // increments z by the common multiple of z-proportion for building styles
            for (let j=0, z=-930; z<=930; ++j, j%2 ? z+=60 : z+=90) {
                if (Math.abs(x) <= 60 && Math.abs(z) <= 60) {
                    continue;
                }

                const MAX_HEIGHT_SQ = 36864;
                const AVG_STORY = 5;

                let xCoreSections = 1 + Math.floor(Math.random() * 5);
                let xWingSections = Math.floor(Math.random() * 6);
                let zCoreSections = 1 + Math.floor(Math.random() * 5);
                let zWingSections = Math.floor(Math.random() * 6);

                let maxStories = Math.sqrt((1 - x*x/CITY_RADIUS_SQ - z*z/CITY_RADIUS_SQ)*MAX_HEIGHT_SQ) / AVG_STORY;
                if (isNaN(maxStories)) {
                    continue;
                }
                let ySections = Math.ceil((Math.exp(Math.random()) - 0.99999) * 20 * maxStories / 35) + Math.random() * 0.2;
                if (ySections < 1) {
                    continue;
                }

                // sanity-checks proportions
                if (xWingSections >= 2 && zCoreSections < 2) {
                    ++zCoreSections
                }
                if (zWingSections >= 2 && xCoreSections < 2) {
                    ++xCoreSections
                }
                if (ySections >= 2) {
                    while (xCoreSections + xWingSections < 2) {
                        ++xCoreSections;
                    }
                    while (zCoreSections + zWingSections < 2) {
                        ++zCoreSections;
                    }
                }
                if (ySections >= 10) {
                    while (zCoreSections + zWingSections < 3) {
                        ++zCoreSections;
                    }
                }
                if (ySections >= 20) {
                    while (xCoreSections + xWingSections < 3) {
                        ++xCoreSections;
                    }
                }

                let building = {
                    x: x,
                    z: z,
                    xCoreSections: xCoreSections,
                    xWingSections: xWingSections,
                    zCoreSections: zCoreSections,
                    zWingSections: zWingSections,
                    ySections: ySections,
                };

                let style = Math.floor(Math.random() * numStyles);
                if (0 === style % 2) {
                    // makes some walls blank (only works if windowWidth is not too great)
                    if (zCoreSections <= 2 && Math.random() < 0.3) {
                        building.xWingSections += 0.15;
                    } else if (xCoreSections <= 2 && Math.random() < 0.3) {
                        building.zWingSections += 0.15;
                    } else if (zCoreSections + zWingSections <= 4.5 && Math.random() < 0.1) {
                        building.xCoreSections += 0.15;
                    } else if (xCoreSections + xWingSections <= 4.5 && Math.random() < 0.1) {
                        building.zCoreSections += 0.15;
                    }
                }
                buildings[style].push(building);
            }
        }
        return buildings;
    },

    randomIntersection: function () {
        let x, z;
        do {
            x = -975 + Math.floor(Math.random() * 8) * 270;
            z = -975 + Math.floor(Math.random() * 14) * 150;
        } while (x*x + z*z >= CITY_RADIUS_SQ);
        const y = 8.5;
        return x + ' ' + y + ' ' + z;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=city.js.map