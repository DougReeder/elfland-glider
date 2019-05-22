// island.js - island world for Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import {calcPosChange, setEnvironmentalSound} from "../src/elfland-utils";
import '../src/state.js'
import '../assets/stella-octangula.js'
import '../src/intro.js'
import './aframe-island-component.js'

const INITIAL_POSITION = {x:0, y:100, z:500};
const INITIAL_ROTATION_X = 0;
const INITIAL_ROTATION_Y = 0;
AFRAME.registerComponent('island-world', {
    init: function () {
        setEnvironmentalSound('Olaf%20Minimalist.mp3', 0.1);

        let sceneEl = this.el;
        sceneEl.emit('setState', {
            gliderPositionStart: INITIAL_POSITION,
            gliderPosition: {x: INITIAL_POSITION.x, y: INITIAL_POSITION.y, z: INITIAL_POSITION.z},
            gliderRotationX: INITIAL_ROTATION_X,
            gliderRotationY: INITIAL_ROTATION_Y,
            gliderRotationYStart: INITIAL_ROTATION_Y
        });

        let islandEl = sceneEl.querySelector('a-island');
        let islandComp = islandEl.components.island;

        for (let p=0; p<6; ++p) {
            let powerupEl = document.createElement('a-entity');
            powerupEl.setAttribute('class', 'powerup');
            let dispersion = 1000;
            let ceiling = p < 1 ? 15 : 100;   // keep one powerup low
            powerupEl.setAttribute('position', this.randomPosition(islandComp, dispersion, 9, ceiling));
            powerupEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-1.5 -1.5 -1.5', vertexB:'1.5 -1.5 1.5', vertexC:'1.5 1.5 -1.5'});
            powerupEl.setAttribute('material', {visible:false});

            let powerupInnerEl = document.createElement('a-icosahedron');
            powerupInnerEl.setAttribute('material', {color:'#ff0000'});
            powerupInnerEl.setAttribute('glow', {c: '0.2', color: '#ff0000', scale:'3.5'});

            powerupEl.appendChild(powerupInnerEl);
            sceneEl.appendChild(powerupEl);
        }


        let starScale = AFRAME.utils.device.isMobile() || AFRAME.utils.device.checkHeadsetConnected() ? 1.0 : 2.0;
        let totalStars = AFRAME.utils.device.isMobile() ? 25 : 30;
        for (let s=0; s<totalStars; ++s) {
            let starEl = document.createElement('a-entity');
            starEl.setAttribute('class', 'star');
            let dispersion = s < 3 ? 1750 : 1000;   // place a couple stars away from the island
            starEl.setAttribute('position', this.randomPosition(islandComp, dispersion, 12, 150));
            starEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-1.5 -1.5 -1.5', vertexB:'1.5 -1.5 1.5', vertexC:'1.5 1.5 -1.5'});
            starEl.setAttribute('material', {visible:false});
            starEl.object3D.scale.set(starScale, starScale, starScale);

            let starInnerEl = document.createElement('a-entity');
            starInnerEl.setAttribute('rotation', '45 0 45');
            starInnerEl.setAttribute('geometry', {primitive: 'stella-octangula'});
            starInnerEl.setAttribute('material', {color:'#ffce00'});
            if (! /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent)) {   // not Mobile Safari
                starInnerEl.setAttribute('glow', {c: '0.2', color: '#feca05', scale:'3.5'});
            }

            starEl.appendChild(starInnerEl);
            sceneEl.appendChild(starEl);
        }

        sceneEl.emit('countYellowStars', {});

        let portalEl = document.getElementById('nextQuestPortal');
        portalEl.setAttribute('position', this.randomPosition(islandComp, 1000, 12, 100));

        let fairiesEl = document.createElement('a-entity');
        fairiesEl.setAttribute('position', this.belowGliderPathAboveIsland(islandComp));
        fairiesEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-15 -15 -15', vertexB:'15 -15 15', vertexC:'15 15 -15'});
        fairiesEl.setAttribute('material', {visible:false});
        fairiesEl.setAttribute('class', 'proximitySound');
        fairiesEl.setAttribute('data-sound-url', 'please help collect stars.ogg');
        fairiesEl.setAttribute('data-text', "Please help collect stars!");
        let fairiesInnerEl = document.createElement('a-gltf-model');
        fairiesInnerEl.setAttribute('position', '0 -6 0');
        fairiesInnerEl.setAttribute('src', '#fairies');
        fairiesInnerEl.setAttribute('scale', '0.5 0.5 0.5');
        fairiesEl.appendChild(fairiesInnerEl);
        sceneEl.appendChild(fairiesEl);

        if (!AFRAME.utils.device.isMobile()) {
            sceneEl.setAttribute('fog', {
                type: 'linear',
                color: '#2a6799',
                near: 10,
                far: 1000
            });

            // These decorations do not need to be pre-loaded via the asset mgr
            let floatingEl = document.createElement('a-gltf-model');
            floatingEl.setAttribute('position', this.randomPosition(islandComp, 750, 50, 100));
            floatingEl.setAttribute('src', '../assets/hermit_s_windmill/scene.gltf');
            floatingEl.setAttribute('scale', '0.01 0.01 0.01');
            floatingEl.setAttribute('class', 'proximitySound');
            floatingEl.setAttribute('data-sound-url', '../assets/look out.ogg');
            floatingEl.setAttribute('data-sound-volume', 1.0);
            floatingEl.setAttribute('data-text', "Look out!");
            sceneEl.appendChild(floatingEl);

            // let buildingEl = document.createElement('a-gltf-model');
            // buildingEl.setAttribute('position', islandComp.buildingPosition());
            // buildingEl.setAttribute('src', '../assets/stabbur/scene.gltf');
            // buildingEl.setAttribute('scale', '3 3 3');
            // buildingEl.setAttribute('class', 'landscape');
            // sceneEl.appendChild(buildingEl);
        }

    },

    randomPosition: function (islandComp, dispersion, verticalOffset, ceiling) {
        let x, y, z;
        do {
            x = (Math.random() - 0.5) * dispersion;
            z = (Math.random() - 0.5) * dispersion;
            y = islandComp.height(x, z) + verticalOffset;
        } while (y > ceiling);
        return x + ' ' + y + ' ' + z;
    },

    belowGliderPathAboveIsland: function (islandComp) {
        let pos;
        let distance = 100;
        do {
            let verticalAngleDeg = INITIAL_ROTATION_X - Math.random() * 15;
            let horizontalAngleDeg = INITIAL_ROTATION_Y + 90 + (Math.random()-0.5) * 30;
            let posChange = calcPosChange(verticalAngleDeg, horizontalAngleDeg, distance);

            pos = {x: INITIAL_POSITION.x + posChange.x,
                y: INITIAL_POSITION.y + posChange.y,
                z: INITIAL_POSITION.z + posChange.z};

//                    console.log("altitudes:", pos.y, islandComp.height(pos.x, pos.z), distance);
            distance -= 2;   // if altitude is too low, reduce distance
        } while (pos.y - islandComp.height(pos.x, pos.z) < 12);

        return pos;
    }
});
