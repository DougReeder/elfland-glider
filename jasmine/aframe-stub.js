// aframe-stub.js - allows testing app code that uses A-Frame
// Copyright © 2017-2020 P. Douglas Reeder; Licensed under the GNU GPL-3.0

var elementParam = {};   // keyed by name

var componentParam = {};   // keyed by name

var geometryParam = {};   // keyed by name

var primitiveParam = {};   // keyed by name

var shaderParam = {};   // keyed by name

var stateParam = null;

var AFRAME = {
    scenes: [{
        is: () => false,
        emit: () => false
    }],

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
    },

    utils: {
        device: {
            isMobile: function () {return false;},
            isMobileVR: function () {return false;},
            isGearVR: function () {return false;},
            checkHeadsetConnected: function () {return false;}
        }
    }
};

var THREE = {
    Color: function () {},
    Vector3: function () {},
    CanvasTexture: function () {},
    PlaneBufferGeometry: function () {
        this.attributes = {position: {array: []}};
    },
    MeshBasicMaterial: function () {},
    Mesh: function () {}
};
THREE.Vector3.prototype.normalize = function () {};
THREE.Vector3.prototype.dot = function (other) {return this;};
THREE.PlaneBufferGeometry.prototype.rotateX = function () {};

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

    setObject3D() {
    }
}



// not actually A-Frame, but used in Elfland Glider
function Howl() {
    this.play = function () {};
}
