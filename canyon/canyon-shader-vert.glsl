// canyon-shader-vert.glsl - vaguely natural-looking material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0

uniform vec3 sunNormal;

attribute float intensityTweak;

varying vec3 pos;
varying vec3 vNormal;
varying float vIntensityTweak;
varying float sunFactor;

void main() {
    pos = position;
    vNormal = normal;
    vIntensityTweak = intensityTweak;
    sunFactor = 0.6875 + 0.75 * max(dot(normal, sunNormal), 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
