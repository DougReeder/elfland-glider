// aframe-island-component.js - island terrain for Elfland Glider
// Copyright © 2018–2024 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import ImprovedNoise from "../src/ImprovedNoise.js"

/**
 * Creates an island, with elevation 0 at the edge.
 */
AFRAME.registerComponent('island', {
    schema: {
        color: {default: 'rgb(92, 32, 0)'},
        shadowColor: {default: 'rgb(128, 96, 96)'},
        seaColor: {default: 'rgb(0, 105, 148)'},
        sunPosition: {type: 'vec3', default: {x: 1, y: 1, z: 1}},
        worldDepth: {default: 256},
        worldWidth: {default: 256}
    },

    terrainData: null,

    height: function(x, z) {
        if (x <= -500 || x >= 500 || z <= -500 || z >= 500) {
            return 0;
        } else {
            const width = this.data.worldWidth;
            const depth = this.data.worldDepth;
            let i = Math.floor((x + 500) / 1000 * (width-1));
            let j = Math.floor((z + 500) / 1000 * (depth-1));
            let h = Math.max(this.terrainData[i+j*width],
                this.terrainData[(i+1)+j*width] || 0,
                this.terrainData[i+(j+1)*width] || 0,
                this.terrainData[(i+1)+(j+1)*width] || 0);
            return h*10;
        }
    },

    /** flat area not at sea level */
    buildingPosition: function () {
        const width = this.data.worldWidth;
        const depth = this.data.worldDepth;
        let i, j, h1, h2, h3, h4;
        do {
            i = Math.floor(Math.random() * (width-3)) + 1;   // edge squares can't qualify
            j = Math.floor(Math.random() * (depth-3)) + 1;
            h1 = this.terrainData[i + j * width] || 0;
            h2 = this.terrainData[(i + 1) + j * width] || 0;
            h3 = this.terrainData[i + (j + 1) * width] || 0;
            h4 = this.terrainData[(i + 1) + (j + 1) * width] || 0;
            // console.log("buildingPosition heights:", h1, h2, h3, h4);
        } while (h1 === 0 || h1 !== h2 || h2 !== h3 || h3 !== h4 );

        let x = ((i+0.5)/(width-1) * 1000) - 500;
        let z = ((j+0.5)/(depth-1) * 1000) - 500;
        let y = h1 * 10;

        return x + ' ' + y + ' ' + z;
    },

    update: function () {
        var data = this.data;

        var worldDepth = data.worldDepth;
        var worldWidth = data.worldWidth;

        // Generate heightmap.
        this.terrainData = generateHeight(worldWidth, worldDepth);

        // Texture.
        var canvas = generateTexture(
            this.terrainData, worldWidth, worldDepth, new THREE.Color(data.color),
            new THREE.Color(data.shadowColor), new THREE.Color(data.seaColor), data.sunPosition);
        var texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        // Create geometry.
        var geometry = new THREE.PlaneGeometry(1000, 1000, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);
        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = this.terrainData[i] * 10;
        }

        // Create material.
        var material = new THREE.MeshBasicMaterial({map: texture});

        // Create mesh.
        var mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D('mesh', mesh);
    }
});

function generateHeight(width, height) {
    let size = width * height;
    let plateauEdge = Math.max(width, height) / 8;
    let data = new Uint8Array(size);
    let perlin = new ImprovedNoise();
    let z = Math.random() * 100;

    for (let i = 0; i < size; i++) {
        let x = i % width, y = ~~(i / width);
        if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
            let d = 0;
            // generates smooth noisy terrain
            for (let quality = 1; quality <= 25; quality *= 5) {
                d += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            // lowers the whole and flattens the bottom, so it's continuous with a sea or plain
            if (d < 6) {
              d = 0;
            } else {
              d -= 6;
            }
            // avoids cliffs at the edge
            d *= Math.min(x*0.5, y*0.5, (width-x)*0.5, (height-y)*0.5, plateauEdge) / plateauEdge;
            //
            data[i] = d;
        }
    }

    return data;
}

function generateTexture(terrainData, width, height, color, colorShadow, colorSea, sunPos) {
    var sun = new THREE.Vector3(sunPos.x, sunPos.y, sunPos.z);
    sun.normalize();

    // Create canvas and context.
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    var imageData = image.data;

    // Convert three.js rgb to 256.
    var red = color.r * 256;
    var green = color.g * 256;
    var blue = color.b * 256;
    var redShadow = colorShadow.r * 256;
    var greenShadow = colorShadow.g * 256;
    var blueShadow = colorShadow.b * 256;
    let redSea = colorSea.r * 256;
    let greenSea = colorSea.g * 256;
    let blueSea = colorSea.b * 256;

    var shade;
    var vector3 = new THREE.Vector3(0, 0, 0);
    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        if (terrainData[j-1] || terrainData[j] || terrainData[j+1] ||
                terrainData[j-width-1] || terrainData[j-width] || terrainData[j-width+1] ||
                terrainData[j+width-1] || terrainData[j+width] || terrainData[j+width+1]) {
            vector3.x = (terrainData[j-2] || 0) - (terrainData[j+2] || 0);
            vector3.y = 2;
            vector3.z = (terrainData[j-width*2] || 0) - (terrainData[j+width*2] || 0);
            vector3.normalize();
            shade = vector3.dot(sun);
            imageData[i] = (red + shade * redShadow) * (0.5 + terrainData[j] * 0.007) + ~~(Math.random() * 17 - 8);
            imageData[i+1] = (green + shade * blueShadow) * (0.5 + terrainData[j] * 0.007) + ~~(Math.random() * 17 - 8);
            imageData[i+2] = (blue + shade * greenShadow) * (0.5 + terrainData[j] * 0.007) + ~~(Math.random() * 17 - 8);
        } else {
            imageData[i] = redSea + ~~(Math.random() * 5 - 2);
            imageData[i+1] = greenSea + ~~(Math.random() * 5 - 2);
            imageData[i+2] = blueSea + ~~(Math.random() * 5 - 2);
        }
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x.
    var canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    let contextScaled = canvasScaled.getContext('2d');
    contextScaled.scale(4, 4);
    contextScaled.drawImage(canvas, 0, 0);

    return canvasScaled;
}

/**
 * <a-island>
 */
AFRAME.registerPrimitive('a-island', {
    defaultComponents: {
        island: {}
    },

    mappings: {
        color: 'island.color',
        'shadow-color': 'island.shadowColor',
        'sea-color': 'island.seaColor',
        'sun-position': 'island.sunPosition',
        'world-depth': 'island.worldDepth',
        'world-width': 'island.worldWidth'
    }
});
