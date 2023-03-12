// canyon-shader.js - vaguely natural-looking material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0
//
// There are several strata at various levels below y=0. They alternate between the
// color1 colors (default gray brown and dirt brown) and color2 colors (default gray sand and sand).
// Faces will be 44% brighter in direct sun and 44% darker when facing away from the sun.
// Example: material="shader:canyon; color1Yin:#63574d"

import vertexShader from './canyon-shader-vert.glsl'
import fragmentShader from './canyon-shader-frag.glsl'

AFRAME.registerShader('canyon', {
    schema: {
        color1Yin: {type: 'color', default: '#63574d'},   // gray brown
        color1Yang: {type: 'color', default: '#553c29'},   // dirt brown
        color2Yin: {type: 'color', default: '#655b43'},   // gray sand
        color2Yang: {type: 'color', default: '#60502f'},   // sand
        sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
    },

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
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
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
