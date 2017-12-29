// aframe-stub.js - allows testing app code that uses A-Frame
// Copyright © 2017 P. Douglas Reeder; Licensed under the GNU GPL-3.0

var elementParam = {};   // keyed by name

var componentParam = {};   // keyed by name

var geometryParam = {};   // keyed by name

var primitiveParam = {};   // keyed by name

var shaderParam = {};   // keyed by name

var stateParam = null;

var AFRAME = {
    registerElement: function (name, param) {
        elementParam[name] = param;
    },

    registerComponent: function (name, param) {
        componentParam[name] = param;
    },

    registerGeometry: function (name, param) {
        geometryParam[name] = param;
    },

    registerPrimitive: function (name, param) {
        primitiveParam[name] = param;
    },

    registerShader: function (name, param) {
        shaderParam[name] = param;
    },

    registerState: function(param) {
        stateParam = param;
    }
};

class MockElement {
    constructor(attributes) {
        if (attributes instanceof Object) {
            this._attributes = attributes;
        } else {
            this._attributes = {};
        }
    }

    setAttribute(name, value) {
        this._attributes[name] = value;
    }

    getAttribute(name) {
        return this._attributes[name];
    }
}
