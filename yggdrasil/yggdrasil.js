// yggdrasil.js - the tree between the worlds, for Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import {setEnvironmentalSound} from "../src/elfland-utils";
import '../src/state.js'
import '../assets/stella-octangula.js'
import '../src/intro.js'

AFRAME.registerComponent('yggdrasil', {
    init: function () {
        setEnvironmentalSound('Swell2b-64k.mp3', 0.3);

        this.positionSph = new THREE.Spherical(1, Math.PI/2, 0);
        this.position = new THREE.Vector3();
        this.sss = document.querySelector('a-simple-sun-sky');
        this.directional = document.getElementById('directional');

        this.el.emit('countYellowStars', {});

        if (/island/.test(sessionStorage.getItem('previousWorld'))) {
            let prelaunchHelp = AFRAME.scenes[0].querySelector('#prelaunchHelp');
            prelaunchHelp.setAttribute('value', "Congratulations!\\nYou've completed the main quests.\\nExplore all the worlds!");
        }
    },

    tick: function (time) {
        this.positionSph.phi = Math.PI * 0.5 + Math.sin(time / 120000 * 2 * Math.PI) * 0.8;
        this.positionSph.theta = Math.PI * 0.25 + Math.sin(time / 240000 * 2 * Math.PI) * 1;
        this.position.setFromSpherical(this.positionSph);
        let positionStr = this.position.x + ' ' + this.position.y + ' ' + this.position.z;
        this.sss.setAttribute('sun-position', positionStr);
        this.directional.setAttribute('position', positionStr);
    }
});
