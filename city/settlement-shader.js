// settlement-shader.js - smooth noise, with one pair of colors inside a radius, another pair outside
// Copyright © 2019, 2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//
// The produced texture is a mix of the specified colors.
// Faces will be 50% brighter in direct sun and 50% darker when facing away from the sun.
// Example: material="shader:settlement; colorYinInside:#63574d"

import vertexShader from './settlement-shader-vert.glsl';
import fragmentShader from './settlement-shader-frag.glsl';

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
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
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
