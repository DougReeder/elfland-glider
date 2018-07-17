// island.js - island world for Elfland Glider
// Copyright © 2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0


const INITIAL_POSITION = {x:-500, y:100, z:500};
const INITIAL_ROTATION_X = 0;
const INITIAL_ROTATION_Y = -45;
AFRAME.registerComponent('island', {
    init: function () {
        this.minimalist = new Howl({
            src: ['../assets/Olaf%20Minimalist.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.2
        });

        let sceneEl = this.el;
        sceneEl.emit('setState', {
            gliderPositionStart: INITIAL_POSITION,
            gliderPosition: {x: INITIAL_POSITION.x, y: INITIAL_POSITION.y, z: INITIAL_POSITION.z},
            gliderRotationX: INITIAL_ROTATION_X,
            gliderRotationY: INITIAL_ROTATION_Y
        });

        let mountainEl = sceneEl.querySelector('a-mountain');
        let mountainComp = mountainEl.components.mountain;

        for (let p=0; p<6; ++p) {
            let powerupEl = document.createElement('a-entity');
            powerupEl.setAttribute('class', 'powerup');
            let dispersion = 1000;
            let ceiling = p < 1 ? 15 : 100;   // keep one powerup low
            powerupEl.setAttribute('position', this.randomPosition(mountainComp, dispersion, 9, ceiling));
            powerupEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-1.5 -1.5 -1.5', vertexB:'1.5 -1.5 1.5', vertexC:'1.5 1.5 -1.5'});
            powerupEl.setAttribute('material', {visible:false});

            let powerupInnerEl = document.createElement('a-icosahedron');
            powerupInnerEl.setAttribute('material', {color:'#ff0000'});
            powerupInnerEl.setAttribute('glow', {c: '0.2', color: '#ff0000', scale:'3.5'});

            powerupEl.appendChild(powerupInnerEl);
            sceneEl.appendChild(powerupEl);
        }


        let starScale = AFRAME.utils.device.isMobile() || AFRAME.utils.device.checkHeadsetConnected() ? 1.0 : 2.0;
        let totalStars = AFRAME.utils.device.isMobile() ? 50 : 75;
        for (let s=0; s<totalStars; ++s) {
            let starEl = document.createElement('a-entity');
            starEl.setAttribute('class', 'star');
            let dispersion = s < 3 ? 1750 : 1000;   // place a couple stars away from the island
            starEl.setAttribute('position', this.randomPosition(mountainComp, dispersion, 12, 150));
            starEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-1.5 -1.5 -1.5', vertexB:'1.5 -1.5 1.5', vertexC:'1.5 1.5 -1.5'});
            starEl.setAttribute('material', {visible:false});
            starEl.object3D.scale.set(starScale, starScale, starScale);

            let starInnerEl = document.createElement('a-entity');
            starInnerEl.setAttribute('rotation', '45 0 45');
            starInnerEl.setAttribute('geometry', {primitive: 'stella-octangula'});
            starInnerEl.setAttribute('material', {color:'#ffce00'});
            starInnerEl.setAttribute('glow', {c: '0.2', color: '#feca05', scale:'3.5'});

            starEl.appendChild(starInnerEl);
            sceneEl.appendChild(starEl);
        }

        sceneEl.emit('countYellowStars', {});

        let portalEl = document.getElementById('nextQuestPortal');
        portalEl.setAttribute('position', this.randomPosition(mountainComp, 1000, 12, 100));

        let fairiesEl = document.createElement('a-gltf-model');
        fairiesEl.setAttribute('position', this.belowGliderPathAboveMountain(mountainComp));
        fairiesEl.setAttribute('src', '#fairies');
        fairiesEl.setAttribute('scale', '0.5 0.5 0.5');
        sceneEl.appendChild(fairiesEl);

        if (!AFRAME.utils.device.isMobile()) {
            // These decorations do not need to be pre-loaded via the asset mgr
            let floatingEl = document.createElement('a-gltf-model');
            floatingEl.setAttribute('position', this.randomPosition(mountainComp, 750, 50, 100));
            floatingEl.setAttribute('src', '../assets/hermit_s_windmill/scene.gltf');
            floatingEl.setAttribute('scale', '0.01 0.01 0.01');
            sceneEl.appendChild(floatingEl);

            let buildingEl = document.createElement('a-gltf-model');
            buildingEl.setAttribute('position', mountainComp.buildingPosition());
            buildingEl.setAttribute('src', '../assets/stabbur/scene.gltf');
            buildingEl.setAttribute('scale', '3 3 3');
            buildingEl.setAttribute('class', 'landscape');
            sceneEl.appendChild(buildingEl);
        }

    },

    randomPosition: function (mountainComp, dispersion, verticalOffset, ceiling) {
        let x, y, z;
        do {
            x = (Math.random() - 0.5) * dispersion;
            z = (Math.random() - 0.5) * dispersion;
            y = mountainComp.height(x, z) + verticalOffset;
        } while (y > ceiling);
        return x + ' ' + y + ' ' + z;
    },

    belowGliderPathAboveMountain: function (mountainComp) {
        let pos;
        let distance = 100;
        do {
            let verticalAngleDeg = INITIAL_ROTATION_X - Math.random() * 15;
            let horizontalAngleDeg = INITIAL_ROTATION_Y + 90 + (Math.random()-0.5) * 30;
            let posChange = calcPosChange(verticalAngleDeg, horizontalAngleDeg, distance);

            pos = {x: INITIAL_POSITION.x + posChange.x,
                y: INITIAL_POSITION.y + posChange.y,
                z: INITIAL_POSITION.z + posChange.z};

//                    console.log("altitudes:", pos.y, mountainComp.height(pos.x, pos.z), distance);
            distance -= 2;   // if altitude is too low, reduce distance
        } while (pos.y - mountainComp.height(pos.x, pos.z) < 12);

        return pos;
    }
});
