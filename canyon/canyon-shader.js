// canyon-shader.js - stratified material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0
//
// `src` must be the selector for an img element with a seamless texture, preferably grayish.
// There are several strata at various levels below y=0.
// Some shift the color of the texture toward red, and some toward yellow.
// Faces will be 44% brighter in direct sun and 44% darker when facing away from the sun.
// Example: material="shader:canyon; src:#rock"

import vertexShader from './canyon-shader-vert.glsl'
import fragmentShader from './canyon-shader-frag.glsl'

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
                rockTexture: {value: null},
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
