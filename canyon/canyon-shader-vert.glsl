// canyon-shader-vert.glsl - vaguely natural-looking material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0

uniform vec3 sunNormal;

attribute float intensityTweak;

varying vec3 pos;
varying float vIntensityTweak;
varying float sunFactor;
varying float cameraZ;

void main() {
    pos = position;

    vIntensityTweak = intensityTweak;
    sunFactor = 0.6875 + 0.75 * max(dot(normal, sunNormal), 0.0);

    vec4 cameraSpacePosition = modelViewMatrix * vec4(position, 1.0);
    cameraZ = cameraSpacePosition.z;
    gl_Position = projectionMatrix * cameraSpacePosition;
}
