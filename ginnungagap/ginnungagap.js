// ginnungagap.js - the boring result of a high-speed crash in Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import {isDesktop, setEnvironmentalSound} from '../src/elfland-utils'

import '../src/state.js'

AFRAME.registerComponent('ginnungagap', {
    init: function () {
        let sceneEl = this.el;

        setEnvironmentalSound('100495__jakobthiesen__light-rain-in-forest.ogg', 1.0);
        // rain visual is too resource-intensive for mobile
        if (isDesktop()) {
            let rain = document.createElement('a-entity');
            rain.setAttribute('particle-system', {preset: 'rain', particleCount: 500});
            rain.setAttribute('bind__position', 'gliderPosition');
            sceneEl.appendChild(rain);
        }

        this.clouds = [];
        let clouds = this.clouds;
        setTimeout(() => {
            for (let i=0; i<=80; ++i) {
                placeCloud(875-i*10, 270);
            }
        }, 4);
        setInterval(placeCloud, 5000);
        function placeCloud(distance=500, variation=80) {
            if (clouds.length >= 100) {
                sceneEl.components.pool__clouds.returnEntity(clouds.shift());
            }

            let cloudEl = sceneEl.components.pool__clouds.requestEntity(true);
            let opacity=0;
            cloudEl.setAttribute('material', 'opacity', opacity);
            let intervalID = setInterval( () => {
                opacity += 0.1 / 120;
                cloudEl.setAttribute('material', 'opacity', opacity);
                if (opacity >= 0.5) {
                    clearInterval(intervalID);
                }
            }, 16);
            AFRAME.scenes[0].emit('placeInGliderPath', {el: cloudEl, distance: distance, variation:variation});
            // cloudEl.object3D.rotation.z = Math.floor(Math.random()*2) * Math.PI + (Math.random()-0.5) * 0.75;
            cloudEl.object3D.rotation.z = Math.random()*2*Math.PI;
            clouds.push(cloudEl);
        }

        this.armaturePosition = document.getElementById('armature').object3D.position;


        var returnPath = sessionStorage.getItem('returnWorld');
        if (returnPath) {
            var returnPortal = document.getElementById('returnPortal');
            returnPortal.setAttribute('link','href', returnPath);
            returnPortal.setAttribute('link','image', returnPath + 'screenshot.png');
        }

        setInterval( () => {
            let returnPortalEl = document.getElementById('returnPortal');
            returnPortalEl.setAttribute('visible', 'true');
            AFRAME.scenes[0].emit('placeInGliderPath', {el: returnPortalEl, distance: 100, variation:45});
        }, 60000);
    },

    play: function () {
        this.el.emit('launch', "ginnungagap play");
    },

    tick: function () {
        this.clouds.forEach(cloud => {
            if (this.armaturePosition.distanceTo(cloud.object3D.position) > 100) {
                let rotationZ = cloud.object3D.rotation.z;
                cloud.object3D.lookAt(this.armaturePosition);
                cloud.object3D.rotation.z = rotationZ;
            }
        });
    }
});
