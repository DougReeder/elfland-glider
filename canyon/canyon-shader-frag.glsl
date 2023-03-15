// canyon-shader-frag.glsl - vaguely natural-looking material for A-Frame
// Copyright © 2018,2023 Doug Reeder; Licensed under the GNU GPL-3.0

uniform sampler2D rockTexture;

varying vec3 pos;
varying vec3 vNormal;
varying float vIntensityTweak;
varying float sunFactor;

// by Inigo Quilez - https://iquilezles.org/articles/biplanar/
// "sampler" texture sampler
// "position" point being textured
// "normal" surface normal at "p"
// "weight" controls the sharpness of the blending in the transitions areas
vec4 biplanar(in sampler2D sampler, in vec3 position, in vec3 normal, in float weight) {
    // grab coord derivatives for texturing
    vec3 dpdx = dFdx(position);
    vec3 dpdy = dFdy(position);
    normal = abs(normal);

    // major axis (in x; yz are following axis)
    ivec3 major = (normal.x > normal.y && normal.x > normal.z) ?
        ivec3(0,1,2) :
        (normal.y > normal.z) ? ivec3(1,2,0) : ivec3(2,0,1);
    // minor axis (in x; yz are following axis)
    ivec3 minor = (normal.x < normal.y && normal.x < normal.z) ?
        ivec3(0,1,2) :
        (normal.y < normal.z) ? ivec3(1,2,0) : ivec3(2,0,1);

    // median axis (in x;  yz are following axis)
    ivec3 median = ivec3(3) - minor - major;

    // project+fetch
    vec4 x = textureGrad(sampler, vec2(position[major.y], position[major.z]),
        vec2(dpdx[major.y], dpdx[major.z]),
        vec2(dpdy[major.y], dpdy[major.z]));
    vec4 y = textureGrad(sampler, vec2(position[median.y], position[median.z]),
        vec2(dpdx[median.y],dpdx[median.z]),
        vec2(dpdy[median.y],dpdy[median.z]));

    // blend and return
    vec2 blend = vec2(normal[major.x], normal[median.x]);
//    // optional - add local support (prevents discontinuty)
//    m = clamp((m - 0.5773) / (1.0 - 0.5773), 0.0, 1.0 );
    // transition control
    blend = pow(blend, vec2(weight / 8.0));
    return (x * blend.x + y * blend.y) / (blend.x + blend.y);
}

void main() {
    vec3 mappedColor = biplanar(rockTexture, pos / 10., vNormal, 16.).xyz;

    float yellowStratum = smoothstep(-255.0, -253.0, pos.y) - smoothstep(-205.0, -203.0, pos.y);
    float redStratum = 1. - smoothstep(-255.0, -253.0, pos.y) + smoothstep(-103.0, -100.5, pos.y);

    vec3 inherentColor = mappedColor
            + vec3(0.005,  0.005, -0.010) * yellowStratum
            + vec3(0.010, -0.005, -0.005) * redStratum;

    gl_FragColor = vec4(inherentColor * (sunFactor + vIntensityTweak), 1.0);
}
