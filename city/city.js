// city.js - a domed acrtic city, for Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import {isDesktop, setEnvironmentalSound} from "../src/elfland-utils";
import '../src/state.js'
import '../src/aframe-heightgrid-component.min.js'
import '../src/settlement-shader.js'
import '../src/intro.js'


const INITIAL_POSITION = {x:385, y:101, z:385};
const INITIAL_ROTATION_X = 0;
const INITIAL_ROTATION_Y = 45;
const CITY_RADIUS_SQ = 921600;
AFRAME.registerComponent('city', {
    init: function () {
        setEnvironmentalSound('Gabriel Baker - Worlds.mp3', 0.2);

        let sceneEl = this.el;
        sceneEl.emit('setState', {
            gliderPositionStart: INITIAL_POSITION,
            gliderPosition: {x: INITIAL_POSITION.x, y: INITIAL_POSITION.y, z: INITIAL_POSITION.z},
            gliderRotationX: INITIAL_ROTATION_X,
            gliderRotationY: INITIAL_ROTATION_Y,
            gliderRotationYStart: INITIAL_ROTATION_Y
        });

        // sceneEl.emit('countYellowStars', {});


        fetch('terrain-heights-city.txt').then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                console.error("terrain-heights:", response);
                return '0 2 1'
            }
        }).then((text) => {
            // console.log("heights:", text.split(/\s/));
            let terrainEl = document.getElementById('terrain');
            terrainEl.setAttribute('heightgrid', 'heights', text);
        });


        const numStyles = 6;
        let buildings = this.randomBuildings(numStyles);   // array of arrays

        let buildingEls = new Array(numStyles);

        buildingEls[0] = document.createElement('a-shader-buildings');
        buildingEls[0].setAttribute('wall-color', '#808080');

        buildingEls[1] = document.createElement('a-shader-buildings');
        buildingEls[1].setAttribute('x-proportion-geometry', 5);
        buildingEls[1].setAttribute('x-proportion-material', 5);
        buildingEls[1].setAttribute('z-proportion-geometry', 5);
        buildingEls[1].setAttribute('z-proportion-material', 5);
        buildingEls[1].setAttribute('y-proportion-geometry', 3.5);
        buildingEls[1].setAttribute('y-proportion-material', 3.5);
        buildingEls[1].setAttribute('window-width', -0.5);
        buildingEls[1].setAttribute('window-height', 0.0);
        buildingEls[1].setAttribute('wall-color', '#6e2b11');   // brick red

        buildingEls[2] = document.createElement('a-shader-buildings');
        buildingEls[2].setAttribute('x-proportion-geometry', 6);
        buildingEls[2].setAttribute('x-proportion-material', 6);
        buildingEls[2].setAttribute('z-proportion-geometry', 6);
        buildingEls[2].setAttribute('z-proportion-material', 6);
        buildingEls[2].setAttribute('y-proportion-geometry', 4.5);
        buildingEls[2].setAttribute('y-proportion-material', 4.5);
        buildingEls[2].setAttribute('window-width', -0.5);
        buildingEls[2].setAttribute('window-height', 0.3);
        buildingEls[2].setAttribute('wall-color', '#675342');   // brown brick

        buildingEls[3] = document.createElement('a-shader-buildings');
        buildingEls[3].setAttribute('x-proportion-geometry', 6);
        buildingEls[3].setAttribute('x-proportion-material', 6);
        buildingEls[3].setAttribute('z-proportion-geometry', 6);
        buildingEls[3].setAttribute('z-proportion-material', 6);
        buildingEls[3].setAttribute('y-proportion-geometry', 5.5);
        buildingEls[3].setAttribute('y-proportion-material', 5.5);
        buildingEls[3].setAttribute('window-width', 0.95);
        buildingEls[3].setAttribute('window-height', 0.0);
        buildingEls[3].setAttribute('wall-color', '#a0a0a0');   // light gray
        // buildingEls[3].setAttribute('wall-color', '#6e210b');   // brick red

        buildingEls[4] = document.createElement('a-shader-buildings');
        buildingEls[4].setAttribute('window-width', 0.8);
        buildingEls[4].setAttribute('window-height', -0.1);
        // buildingEls[4].setAttribute('wall-color', '#44cc88');

        buildingEls[5] = document.createElement('a-shader-buildings');
        buildingEls[5].setAttribute('y-proportion-geometry', 5);
        buildingEls[5].setAttribute('y-proportion-material', 5);
        buildingEls[5].setAttribute('window-width', 0.5);
        buildingEls[5].setAttribute('window-height', 0.0);
        buildingEls[5].setAttribute('wall-color', '#a5a696');

        for (let s=0; s<numStyles; ++s) {
            buildingEls[s].setAttribute('elevation-geometry', 1);
            buildingEls[s].setAttribute('elevation-material', 1);
            buildingEls[s].setAttribute('sun-position', "-1 0.5 1");
            buildingEls[s].setAttribute('buildings', JSON.stringify(buildings[s]));
            buildingEls[s].classList.add('landscape');
            sceneEl.appendChild(buildingEls[s]);
        }


        let domeEl = document.createElement('a-entity');
        domeEl.setAttribute('obj-model', isDesktop() ? 'obj:dome16.obj' : 'obj:#dome-obj-mobile');
        if (isDesktop()) {THREE.Cache.remove("dome14.obj");}
        domeEl.setAttribute('material','shader:flat; color:#222; wireframe:true; side:back');
        domeEl.classList.add('landscape');
        sceneEl.appendChild(domeEl);


        for (let p=0; p<4; ++p) {
            let powerupEl = document.createElement('a-entity');
            powerupEl.setAttribute('class', 'powerup');
            powerupEl.setAttribute('position', this.randomIntersection());
            powerupEl.setAttribute('geometry', {primitive:'triangle', vertexA:'-1.5 -1.5 -1.5', vertexB:'1.5 -1.5 1.5', vertexC:'1.5 1.5 -1.5'});
            powerupEl.setAttribute('material', {visible:false});

            let powerupInnerEl = document.createElement('a-icosahedron');
            powerupInnerEl.setAttribute('material', {color:'#ff0000'});
            powerupInnerEl.setAttribute('glow', {c: '0.2', color: '#ff0000', scale:'3.5'});

            powerupEl.appendChild(powerupInnerEl);
            sceneEl.appendChild(powerupEl);
        }

        let portalEl = document.createElement('a-entity');
        portalEl.setAttribute('id', 'nextQuestPortal');
        portalEl.setAttribute('position', this.randomIntersection());
        portalEl.setAttribute('rotation', '0 45 0');
        portalEl.setAttribute('scale', '5 5 0');
        portalEl.setAttribute('link', 'href:../island/; title:Elfland; image:../island/screenshot.png; on:hitstart; visualAspectEnabled:true');
        sceneEl.appendChild(portalEl);


        // this.positionSph = new THREE.Spherical(1, Math.PI/2, 0);
        // this.position = new THREE.Vector3();
        // this.sss = document.querySelector('a-simple-sun-sky');
        // this.buildingEl = document.getElementById('terrain');
    },

    // tick: function (time) {
    //     this.positionSph.phi = Math.PI * (0.25 + 0.2 * Math.sin(Math.PI * (time / 120000 - 0.5)));
    //     this.positionSph.theta = Math.PI * time / 120000;
    //     this.position.setFromSpherical(this.positionSph);
    //     let positionStr = this.position.x + ' ' + this.position.y + ' ' + this.position.z;
    //     this.sss.setAttribute('sun-position', positionStr);
    //     // this.buildingEl.setAttribute('material', 'sunPosition', positionStr);
    // }

    randomBuildings: function (numStyles) {
        let buildings = new Array(numStyles);
        for (let s=0; s<numStyles; ++s) {
            buildings[s] = [];
        }
        // increments x by the common multiple of x-proportion for building styles
        for (let i=0, x=-930; x <= 930; ++i, i%4 ? x+= 60 : x+=90) {
            // increments z by the common multiple of z-proportion for building styles
            for (let j=0, z=-930; z<=930; ++j, j%2 ? z+=60 : z+=90) {
                if (Math.abs(x) <= 60 && Math.abs(z) <= 60) {
                    continue;
                }

                const MAX_HEIGHT_SQ = 36864;
                const AVG_STORY = 5;

                let xCoreSections = 1 + Math.floor(Math.random() * 5);
                let xWingSections = Math.floor(Math.random() * 6);
                let zCoreSections = 1 + Math.floor(Math.random() * 5);
                let zWingSections = Math.floor(Math.random() * 6);

                let maxStories = Math.sqrt((1 - x*x/CITY_RADIUS_SQ - z*z/CITY_RADIUS_SQ)*MAX_HEIGHT_SQ) / AVG_STORY;
                if (isNaN(maxStories)) {
                    continue;
                }
                let ySections = Math.ceil((Math.exp(Math.random()) - 0.99999) * 20 * maxStories / 35) + Math.random() * 0.2;
                if (ySections < 1) {
                    continue;
                }

                // sanity-checks proportions
                if (xWingSections >= 2 && zCoreSections < 2) {
                    ++zCoreSections
                }
                if (zWingSections >= 2 && xCoreSections < 2) {
                    ++xCoreSections
                }
                if (ySections >= 2) {
                    while (xCoreSections + xWingSections < 2) {
                        ++xCoreSections;
                    }
                    while (zCoreSections + zWingSections < 2) {
                        ++zCoreSections;
                    }
                }
                if (ySections >= 10) {
                    while (zCoreSections + zWingSections < 3) {
                        ++zCoreSections;
                    }
                }
                if (ySections >= 20) {
                    while (xCoreSections + xWingSections < 3) {
                        ++xCoreSections;
                    }
                }

                let building = {
                    x: x,
                    z: z,
                    xCoreSections: xCoreSections,
                    xWingSections: xWingSections,
                    zCoreSections: zCoreSections,
                    zWingSections: zWingSections,
                    ySections: ySections,
                };

                let style = Math.floor(Math.random() * numStyles);
                if (style < numStyles/2) {
                    // makes some walls blank (only works if windowWidth is not too great)
                    if (zCoreSections <= 2 && Math.random() < 0.3) {
                        building.xWingSections += 0.15;
                    } else if (xCoreSections <= 2 && Math.random() < 0.3) {
                        building.zWingSections += 0.15;
                    } else if (zCoreSections + zWingSections <= 4.5 && Math.random() < 0.1) {
                        building.xCoreSections += 0.15;
                    } else if (xCoreSections + xWingSections <= 4.5 && Math.random() < 0.1) {
                        building.zCoreSections += 0.15;
                    }
                }
                buildings[style].push(building);
            }
        }
        return buildings;
    },

    randomIntersection: function () {
        let x, z;
        do {
            x = -975 + Math.floor(Math.random() * 8) * 270;
            z = -975 + Math.floor(Math.random() * 14) * 150;
        } while (x*x + z*z >= CITY_RADIUS_SQ);
        const y = 8.5;
        return x + ' ' + y + ' ' + z;
    }
});
