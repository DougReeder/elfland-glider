// canyon.js - maneuvering in cramped spaces, for Elfland Glider
// Copyright © 2019-2020 P. Douglas Reeder; Licensed under the GNU GPL-3.0

// import {setEnvironmentalSound} from "../src/elfland-utils";
import '../src/state.js'
import './canyon-terrain'
import '../assets/land-shader.js'
import '../src/intro.js'


AFRAME.registerComponent('canyon', {
    init: function () {
        let sceneEl = this.el;
        sceneEl.emit('setState', {
            gliderPositionStart: {x:150, y:-5, z:150},
            gliderPosition: {x:150, y:-5, z:150},
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
