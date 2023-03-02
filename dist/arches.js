/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/stella-octangula.js":
/*!************************************!*\
  !*** ./assets/stella-octangula.js ***!
  \************************************/
/***/ (() => {

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
/******/ 			"arches": 0
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
  !*** ./arches/arches.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/state.js */ "./src/state.js");
/* harmony import */ var _assets_stella_octangula__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/stella-octangula */ "./assets/stella-octangula.js");
/* harmony import */ var _assets_stella_octangula__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_stella_octangula__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_intro_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/intro.js */ "./src/intro.js");
// arches.js - prototype world for Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0





AFRAME.registerComponent('arches', {
    init: function () {
        this.el.emit('countYellowStars', {});
    }
});

})();

/******/ })()
;
//# sourceMappingURL=arches.js.map