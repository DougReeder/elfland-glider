// canyon.js - maneuvering in cramped spaces, for Elfland Glider
// Copyright © 2019-2020 P. Douglas Reeder; Licensed under the GNU GPL-3.0

// import {setEnvironmentalSound} from "../src/elfland-utils";
import '../src/state.js'
import './canyon-terrain'
import '../assets/land-shader.js'
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
