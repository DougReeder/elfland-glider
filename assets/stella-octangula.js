// stella-octangula.js - geometry for A-Frame
// Copyright © 2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0

AFRAME.registerGeometry('stella-octangula', {
    schema: {
        vertices: {
            default: ['0 0.5 0', '-0.5 0.5 0.5', '0.5 0.5 0.5', '0.5 0.5 -0.5', '-0.5 0.5 -0.5',
            '-0.5 0 0', '0 0 0.5', '0.5 0 0', '0 0 -0.5',
            '-0.5 -0.5 0.5', '0.5 -0.5 0.5', '0.5 -0.5 -0.5', '-0.5 -0.5 -0.5', '0 -0.5 0' ],
        }
    },
    init: function (data) {
        var geometry = new THREE.Geometry();
        geometry.vertices = data.vertices.map(function (vertex) {
            var points = vertex.split(' ').map(function(x){return parseFloat(x);});
            return new THREE.Vector3(points[0], points[1], points[2]);
        });
        geometry.computeBoundingBox();
        geometry.faces.push(new THREE.Face3(0, 1, 6));
        geometry.faces.push(new THREE.Face3(0, 6, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 7));
        geometry.faces.push(new THREE.Face3(0, 7, 3));
        geometry.faces.push(new THREE.Face3(0, 3, 8));
        geometry.faces.push(new THREE.Face3(0, 8, 4));
        geometry.faces.push(new THREE.Face3(0, 4, 5));
        geometry.faces.push(new THREE.Face3(0, 5, 1));

        geometry.faces.push(new THREE.Face3(1, 5, 6));
        geometry.faces.push(new THREE.Face3(2, 6, 7));
        geometry.faces.push(new THREE.Face3(3, 7, 8));
        geometry.faces.push(new THREE.Face3(4, 8, 5));

        geometry.faces.push(new THREE.Face3(5, 9, 6));
        geometry.faces.push(new THREE.Face3(6, 10, 7));
        geometry.faces.push(new THREE.Face3(7, 11, 8));
        geometry.faces.push(new THREE.Face3(8, 12, 5));

        geometry.faces.push(new THREE.Face3(13, 6, 9));
        geometry.faces.push(new THREE.Face3(13, 10, 6));
        geometry.faces.push(new THREE.Face3(13, 7, 10));
        geometry.faces.push(new THREE.Face3(13, 11, 7));
        geometry.faces.push(new THREE.Face3(13, 8, 11));
        geometry.faces.push(new THREE.Face3(13, 12, 8));
        geometry.faces.push(new THREE.Face3(13, 5, 12));
        geometry.faces.push(new THREE.Face3(13, 9, 5));

        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        this.geometry = geometry;
    }
});