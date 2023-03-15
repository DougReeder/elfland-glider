// canyon-shader-frag.glsl - vaguely natural-looking material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0

uniform sampler2D rockTexture;

varying vec3 pos;
varying vec3 vNormal;
varying float vIntensityTweak;
varying float sunFactor;

// "sampler" texture sampler
// "position" point being textured
// "normal" surface normal at "p"
// "weight" controls the sharpness of the blending in the transitions areas
vec4 triplanar(in sampler2D sampler, in vec3 position, in vec3 normal, in float weight) {
    // project+fetch
    vec4 x = texture( sampler, position.yz );
    vec4 y = texture( sampler, position.zx );
    vec4 z = texture( sampler, position.xy );

    // blend weights
    vec3 w = pow( abs(normal), vec3(weight) );
    // blend and return
    return (x*w.x + y*w.y + z*w.z) / (w.x + w.y + w.z);
}

void main() {
    vec3 mappedColor = triplanar(rockTexture, pos / 10., vNormal, 2.).xyz;

    float yellowStratum = smoothstep(-255.0, -253.0, pos.y) - smoothstep(-205.0, -203.0, pos.y);
    float redStratum = 1. - smoothstep(-255.0, -253.0, pos.y) + smoothstep(-103.0, -100.5, pos.y);

    vec3 inherentColor = mappedColor
            + vec3(0.005,  0.005, -0.010) * yellowStratum
            + vec3(0.010, -0.005, -0.005) * redStratum;

    gl_FragColor = vec4(inherentColor * (sunFactor + vIntensityTweak), 1.0);
}
