// settlement-shader-vert.glsl - smooth noise, with one pair of colors inside a radius, another pair outside
// Copyright © 2019, 2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0

uniform vec3 sunNormal;

varying vec3 pos;
varying float sunFactor;

void main() {
    sunFactor = 0.5 + max(dot(normal, sunNormal), 0.0);

    vec4 globalPosition = modelMatrix * vec4(position, 1.0);
    pos = globalPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * globalPosition;
}
