// dark-elf.js - antagonist behavior for Elfland Glider
// Copyright © 2023 by Doug Reeder; Licensed under the GNU GPL-3.0

 const wanderList = [
   {animation: 'root|flying_idle',      vector: new THREE.Vector3(0, 0, 1),  far: 5},
   {animation: 'root|flying_left',      vector: new THREE.Vector3(2, 0, 0),  far: 5},
   {animation: 'root|flying_right',     vector: new THREE.Vector3(-2, 0, 0), far: 5},
   {animation: 'root|flying_up',        vector: new THREE.Vector3(0, 2, 0),  far: 8},
   {animation: 'root|flying_down',      vector: new THREE.Vector3(0, -2, 0), far: 4},
   {animation: 'root|flying_forward',   vector: new THREE.Vector3(0, 0, 4),  far: 10},
   {animation: 'root|flying_backwards', vector: new THREE.Vector3(0, 0, -2), far: 5},
 ]

const UP = new THREE.Vector3(0, 1, 0);

AFRAME.registerComponent('dark-elf', {
  schema: {
    goalSelector: {type: 'selector'},
    idleSpeed:    {default:  0.5},   // m/s
    pursuitSpeed: {default:  5.0},   // m/s
  },

  vector: new THREE.Vector3(),
  increment: new THREE.Vector3(),
  isAvoidingLandcape: false,
  facingMatrix: new THREE.Matrix4(),
  facingQuaternion: new THREE.Quaternion(),

  init() {
    const {el} = this;

    const newYRot = el.object3D.rotation.y + (Math.random() - 0.5) * Math.PI / 2;
    const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 16;
    el.object3D.rotation.set(newXRot, newYRot, el.object3D.rotation.z);

    const keyTemplate = document.getElementById('keyTemplate');
    const clone = keyTemplate.content.firstElementChild.cloneNode(true);
    clone.setAttribute('id', 'key');
    AFRAME.scenes[0].appendChild(clone);

    this.setModeOrPursuit(wanderList[0]);

    setInterval(this.randomMode.bind(this, el), 3000);

    el.addEventListener('raycaster-intersection', (evt) => {
      // Intersection w/ distance 0 is sometimes sent immediately
      if (evt.detail.intersections.length > 0 && evt.detail.intersections[0].distance > 0) {
        for (const entity of evt.detail.els) {
          if (entity.classList.contains('landscape')) {
            this.isAvoidingLandcape = true;
            const newXRot = el.object3D.rotation.x + (Math.random() - 0.5) * Math.PI / 36;
            el.object3D.rotation.set(newXRot, el.object3D.rotation.y, el.object3D.rotation.z);
            this.setModeOrPursuit(wanderList[0]);
          } else if (entity.id === this.data.goalSelector?.id) {
            console.log("caught goal")
            const keyCaptured = document.getElementById('keyCaptured');
            keyCaptured?.parentNode?.removeChild(keyCaptured);
            AFRAME.scenes[0].emit('cacheAndPlaySound', 'Im-taking-that-back.ogg');
            const subtitle = AFRAME.scenes[0].querySelector('#subtitle');
            subtitle?.setAttribute('value', "I'm taking that back!");
            setTimeout(() => {
              subtitle?.setAttribute('value', "");
            }, 5000);
            for (const entity of document.querySelectorAll('[dark-elf]')) {
              console.info("dark elf wandering");
              entity.setAttribute('dark-elf', 'goalSelector', '');
            }

            AFRAME.scenes[0].emit('setState', {questComplete: false});

            const keyTemplate = document.getElementById('keyTemplate');
            const clone = keyTemplate.content.firstElementChild.cloneNode(true);
            clone.setAttribute('id', 'key');
            AFRAME.scenes[0].appendChild(clone);
          } else {
            console.warn("unexpected raycaster intersection:", entity);
          }
        }
      }
    });
    el.addEventListener('raycaster-intersection-cleared', (evt) => {
      // console.log("cleared intersections:", evt.detail?.clearedEls)
      for (const entity of evt.detail.clearedEls) {
        if (entity.classList.contains('landscape')) {
          setTimeout(() => {   // keeps turning away from wall for another second
            this.isAvoidingLandcape = false;
            this.setModeOrPursuit(wanderList[0]);
          }, 1000);
        }
      }
    });
  },

  update(oldData) {
    const {el} = this;
    if (this.data.goalSelector) {
      el.firstElementChild.classList.remove('proximitySound');
      // raycaster will trigger sound
    }
    this.setModeOrPursuit(wanderList[0]);
  },

  tick(time, timeDelta) {
    const {el} = this;
    const hasGoal = Boolean(this.data.goalSelector?.object3D?.position);
    if (this.isAvoidingLandcape) {
      const newYRot = el.object3D.rotation.y + (hasGoal ? Math.PI : -Math.PI) / 180;
      const newXRot = el.object3D.rotation.x - Math.PI / 1800;
      el.object3D.rotation.set(newXRot, newYRot, el.object3D.rotation.z);
      return;
    } else if (hasGoal) {
      this.facingMatrix.lookAt(this.data.goalSelector.object3D.position, el.object3D.position, UP);
      this.facingQuaternion.setFromRotationMatrix(this.facingMatrix);
      el.object3D.quaternion.rotateTowards(this.facingQuaternion, Math.PI / 180);

      const distance = this.data.pursuitSpeed * timeDelta / 1000;
      this.increment.set(0, 0, distance);
    } else {   // wandering
      if (el.object3D.position.y > -50) {
        el.object3D.rotation.x = Math.PI / 36;   // keeps elf in canyon
      }

      const distance = this.data.idleSpeed * timeDelta / 1000;
      this.increment.copy(this.vector);
      this.increment.multiplyScalar(distance);
    }
    if (!(timeDelta > 0)) {
      return;   // when timeDelta is 0 or NaN, nothing can be done
    }
    this.increment.applyEuler(el.object3D.rotation);
    el.object3D.position.add(this.increment);
  },

  randomMode(el) {
    if (this.data.goalSelector?.object3D?.position) {
      return;
    }
    if (Math.random() > 0.6667) {
      this.setMode(wanderList[Math.floor(wanderList.length * Math.random())])
    } else {
      this.setMode(wanderList[0]);
    }
  },

  setModeOrPursuit(mode) {
    if (this.data.goalSelector?.object3D?.position) {
      this.setPursuit();
    } else {
      this.setMode(mode);
    }
  },

  setMode(mode) {
    this.el.setAttribute('animation-mixer', 'clip', mode.animation);

    this.vector.copy(mode.vector);
    this.el.setAttribute('raycaster', 'direction', {x: mode.vector.x, y: mode.vector.y, z: mode.vector.z});

    this.el.setAttribute('raycaster', 'far', mode.far * this.data.idleSpeed);
  },

  setPursuit() {
    this.el.setAttribute('animation-mixer', 'clip', 'root|flying_forward');

    this.el.setAttribute('raycaster', 'direction', {x: 0, y: 0, z: 1});

    this.el.setAttribute('raycaster', 'far', 5);
  },
});

 // root|flying_idle root|flying_forward root|flying_backwards
 // root|flying_left root|flying_right
 // root|flying_up root|flying_down root|flying_nose_dive
 // root|talk_cycle root|wings_flapping
 // root|idle_look_left root|idle_look_right
