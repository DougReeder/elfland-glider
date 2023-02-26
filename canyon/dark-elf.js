// dark-elf.js - antagonist behavior for Elfland Glider
// Copyright © 2023 by Doug Reeder; Licensed under the GNU GPL-3.0

 const modeList = [
   {animation: 'root|flying_idle',      vector: new THREE.Vector3(0, 0, 1),  far: 5},
   {animation: 'root|flying_left',      vector: new THREE.Vector3(2, 0, 0),  far: 5},
   {animation: 'root|flying_right',     vector: new THREE.Vector3(-2, 0, 0), far: 5},
   {animation: 'root|flying_up',        vector: new THREE.Vector3(0, 2, 0),  far: 8},
   {animation: 'root|flying_down',      vector: new THREE.Vector3(0, -2, 0), far: 4},
   {animation: 'root|flying_forward',   vector: new THREE.Vector3(0, 0, 4),  far: 10},
   {animation: 'root|flying_backwards', vector: new THREE.Vector3(0, 0, -2), far: 5},
 ]

const X_ROT_LIMIT = Math.PI / 10;

AFRAME.registerComponent('dark-elf', {
  schema: {
    isPursuing: {default: false},
    goalLocation: {type: 'vec3'},
    idleSpeed:    {default:  0.5},   // m/s
    pursuitSpeed: {default: 10.0},   // m/s
  },

  vector: new THREE.Vector3(),
  increment: new THREE.Vector3(),
  isAvoidingLandcape: false,
  goalNormal: new THREE.Vector3(),

  init() {
    const {el} = this;

    const newYRot = el.object3D.rotation.y + (Math.random() - 0.5) * Math.PI / 2;
    const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 16;
    el.object3D.rotation.set(newXRot, newYRot, el.object3D.rotation.z);

    this.setMode(modeList[0]);

    setInterval(this.randomMode.bind(this, el), 3000);

    el.addEventListener('raycaster-intersection', (evt) => {
      // Intersection w/ distance 0 is sometimes sent immediately
      if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
        // console.log("intersections[0]:", evt.detail.intersections[0])
        this.isAvoidingLandcape = true;
        const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 36;
        el.object3D.rotation.set(newXRot, el.object3D.rotation.y, el.object3D.rotation.z);
        this.setMode(modeList[0]);
      }
    });
    el.addEventListener('raycaster-intersection-cleared', (evt) => {
      // console.log("cleared intersections:", evt.detail?.clearedEls)
      this.isAvoidingLandcape = false;
    });
  },

  update(oldData) {
  },

  tick(time, timeDelta) {
    const {el} = this;
    let distance = 0;
    if (this.isAvoidingLandcape) {
      const newYRot = el.object3D.rotation.y - Math.PI / 90;   // turns right
      el.object3D.rotation.set(el.object3D.rotation.x, newYRot, el.object3D.rotation.z);
      return;
    } else if (this.data.isPursuing) {
      this.goalNormal.copy(this.data.goalLocation);
      this.goalNormal.sub(el.object3D.position);
      this.goalNormal.normalize();
    } else {   // wandering
      if (el.object3D.position.y > -50) {
        el.object3D.rotation.x = Math.PI / 36;   // keeps elf in canyon
      }

      distance = this.data.idleSpeed * timeDelta / 1000;
      this.increment.copy(this.vector);
      this.increment.multiplyScalar(distance);
    }
    this.increment.applyEuler(el.object3D.rotation);
    el.object3D.position.add(this.increment);
    // console.log("", this.increment, el.object3D.position)
  },

  randomMode(el) {
    if (this.data.isPursuing) {
      return;
    }
    if (Math.random() > 0.6667) {
      this.setMode(modeList[Math.floor(modeList.length * Math.random())])
    } else {
      this.setMode(modeList[0]);
    }
  },

  setMode(mode) {
    this.el.setAttribute('animation-mixer', 'clip', mode.animation);

    this.vector.copy(mode.vector);
    this.el.setAttribute('raycaster', 'direction', {x: mode.vector.x, y: mode.vector.y, z: mode.vector.z});

    this.el.setAttribute('raycaster', 'far', mode.far * this.data.idleSpeed);
  },
});

 // root|flying_idle root|flying_forward root|flying_backwards
 // root|flying_left root|flying_right
 // root|flying_up root|flying_down root|flying_nose_dive
 // root|talk_cycle root|wings_flapping
 // root|idle_look_left root|idle_look_right
