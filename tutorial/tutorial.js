// tutorial.js - Learn to fly, in Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import {isDesktop} from "../src/elfland-utils";
import '../src/state.js'
import '../assets/land-shader.js'
import '../src/intro.js'


AFRAME.registerComponent('tutorial', {
    init: function () {
        let sceneEl = this.el;
        sceneEl.emit('setState', {gliderPositionStart: {x: 0, y: 501, z: 0}});
        sceneEl.emit('setState', {gliderPosition: {x: 0, y: 501, z: 0}});

        for (let x = -2000; x <= 2000; x += 500) {
            for (let z = -2000; z <= 2000; z += 500) {
                if (x === 0 && z === 0) {
                    continue;   // no buoy at column location
                }
                for (let y = 0; y <= 500; y += 500) {
                    let buoyEl = document.createElement('a-entity');
                    buoyEl.object3D.position.x = x;
                    buoyEl.object3D.position.y = y;
                    buoyEl.object3D.position.z = z;
                    buoyEl.setAttribute('mixin', "tetra");
                    if ((x + z + y) % 1000 === 0) {
                        buoyEl.setAttribute('material', 'color:red');
                    } else {
                        buoyEl.setAttribute('material', 'color:white');
                    }
                    sceneEl.appendChild(buoyEl);
                }
            }
        }

        if (isDesktop()) {
            sceneEl.setAttribute('fog', {
                type: 'linear',
                color: '#4f81a2',
                near: 100,
                far: 10000
            });
        }
    }
});
