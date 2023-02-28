// aframe-stub.js - allows testing app code that uses A-Frame
// Copyright © 2017-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0

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
    Vector3: function (x, y, z) {
        this.x = 'number' === typeof x ? x : 0;
        this.y = 'number' === typeof y ? y : 0;
        this.z = 'number' === typeof z ? z : 0;
    },
    Euler: function (x, y, z, order) {
        this.x = 'number' === typeof x ? x : 0;
        this.y = 'number' === typeof y ? y : 0;
        this.z = 'number' === typeof z ? z : 0;
        this.order = 'string' === typeof order ? order : 'XYZ';
    },
    Quaternion: function (x, y, z, w) {
        this.x = 'number' === typeof x ? x : 0;
        this.y = 'number' === typeof y ? y : 0;
        this.z = 'number' === typeof z ? z : 0;
        this.w = 'number' === typeof w ? w : 0;
    },
    Object3D: function() {
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
    },
    CanvasTexture: function () {},
    PlaneGeometry: function () {
        this.attributes = {position: {array: []}};
    },
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
        this.object3D = new THREE.Object3D();
    }

    setAttribute(name, value) {
        this._attributes[name] = value;
    }

    getAttribute(name) {
        return this._attributes[name];
    }

    setObject3D(obj) {
        this.object3D = obj;
    }
}



// not actually A-Frame, but used in Elfland Glider
function Howl() {
    this.play = function () {};
}
