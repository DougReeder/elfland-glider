// settlement-shader.js - smooth noise, with one pair of colors inside a radius, another pair outside
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0
//
// The produced texture is a mix of the specified colors.
// Faces will be 50% brighter in direct sun and 50% darker when facing away from the sun.
// Example: material="shader:settlement; colorYinInside:#63574d"

AFRAME.registerShader('settlement', {
    schema: {
        colorYinInside: {type: 'color', default: '#599432'},   // grass green
        colorYangInside: {type: 'color', default: '#557736'},   // dark green
        colorYinOutside: {type: 'color', default: '#e8e5e2'},   // off white
        colorYangOutside: {type: 'color', default: '#d8d2d0'},   // darker off white
        radius: {type: 'number', default: 1000},
        sunPosition: {type: 'vec3', default: {x:-1.0, y:1.0, z:-1.0}}
    },

    vertexShader: `
uniform vec3 sunNormal;

varying vec3 pos;
varying float sunFactor;

void main() {
  pos = position;
    
  sunFactor = 0.5 + max(dot(normal, sunNormal), 0.0);
   
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,

    fragmentShader: `
uniform vec3 colorYinInside;
uniform vec3 colorYangInside;
uniform vec3 colorYinOutside;
uniform vec3 colorYangOutside;
uniform float radiusSquared;

varying vec3 pos;
varying float sunFactor;

//	Simplex 3D Noise
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vec3 colorYin = pos.x * pos.x + pos.z * pos.z < radiusSquared ? colorYinInside : colorYinOutside;
    vec3 colorYang = pos.x * pos.x + pos.z * pos.z < radiusSquared ? colorYangInside : colorYangOutside;
    
    vec3 inherent = mix(
        colorYin,
        colorYang,
        0.5 * (1.0 + snoise(pos*0.4))
    );
    gl_FragColor = vec4(inherent * sunFactor, 1.0);
}
`,

    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                colorYinInside: {value: new THREE.Color(data.colorYinInside)},
                colorYangInside: {value: new THREE.Color(data.colorYangInside)},
                colorYinOutside: {value: new THREE.Color(data.colorYinOutside)},
                colorYangOutside: {value: new THREE.Color(data.colorYangOutside)},
                radiusSquared: {value: data.radius * data.radius},
                sunNormal: {value: sunPos.normalize()}
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        });
    },
    /**
     * `update` used to update the material. Called on initialization and when data updates.
     */
    update: function (data) {
        this.material.uniforms.colorYinInside.value.set(data.colorYinInside);
        this.material.uniforms.colorYangInside.value.set(data.colorYangInside);
        this.material.uniforms.colorYinOutside.value.set(data.colorYinOutside);
        this.material.uniforms.colorYangOutside.value.set(data.colorYangOutside);
        this.material.uniforms.radiusSquared.value = data.radius * data.radius;
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material.uniforms.sunNormal.value = sunPos.normalize();
    },
});
