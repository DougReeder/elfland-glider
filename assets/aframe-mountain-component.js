// var ImprovedNoise = require('./lib/ImprovedNoise.js');

/**
 * Mountain component.
 */
AFRAME.registerComponent('mountain', {
    schema: {
        color: {default: 'rgb(92, 32, 0)'},
        shadowColor: {default: 'rgb(128, 96, 96)'},
        seaColor: {default: 'rgb(0, 105, 148)'},
        sunPosition: {type: 'vec3', default: {x: 1, y: 1, z: 1}},
        worldDepth: {default: 256},
        worldWidth: {default: 256}
    },

    update: function () {
        var data = this.data;

        var worldDepth = data.worldDepth;
        var worldWidth = data.worldWidth;

        // Generate heightmap.
        var terrainData = generateHeight(worldWidth, worldDepth);

        // Texture.
        var canvas = generateTexture(
            terrainData, worldWidth, worldDepth, new THREE.Color(data.color),
            new THREE.Color(data.shadowColor), new THREE.Color(data.seaColor), data.sunPosition);
        var texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        // Create geometry.
        var geometry = new THREE.PlaneBufferGeometry(1000, 1000, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);
        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = terrainData[i] * 10;
        }

        // Create material.
        var material = new THREE.MeshBasicMaterial({map: texture});

        // Create mesh.
        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
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
            imageData[i] = (red + shade * redShadow) * (0.5 + terrainData[j] * 0.007);
            imageData[i + 1] = (green + shade * blueShadow) * (0.5 + terrainData[j] * 0.007);
            imageData[i + 2] = (blue + shade * greenShadow) * (0.5 + terrainData[j] * 0.007);
        } else {
            imageData[i] = redSea;
            imageData[i+1] = greenSea;
            imageData[i+2] = blueSea;
        }
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x.
    var canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
        var v = ~~(Math.random() * 4 - 2);
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);
    return canvasScaled;
}

/**
 * <a-mountain>
 */
AFRAME.registerPrimitive('a-mountain', {
    defaultComponents: {
        mountain: {}
    },

    mappings: {
        color: 'mountain.color',
        'shadow-color': 'mountain.shadowColor',
        'sea-color': 'mountain.seaColor',
        'sun-position': 'mountain.sunPosition',
        'world-depth': 'mountain.worldDepth',
        'world-width': 'mountain.worldWidth'
    }
});