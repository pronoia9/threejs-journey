import * as THREE from 'three';

import App from '../App';

export default class Fox {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;
    this.debug = this.app.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder('Fox');
      this.debugFolder.open();
    }

    // Setup
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    // Moved to Environment.js's updateMaterials()
    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
    //     child.castShadow = true;
    //   }
    // })
  }

  setAnimation() {
    this.animation = { mixer: null, actions: { current: null, idle: null, walking: null, running: null }, play: null };
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);
    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();
    this.animation.play = (name) => {
      const newAction = this.animation.actions[name],
        oldAction = this.animation.actions.current;
      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);
      this.animation.actions.current = newAction;
    };

    if (this.debug.active) {
      const debugObject = {
        playIdle: () => { this.animation.play('idle'); },
        playWalking: () => { this.animation.play('walking'); },
        playRunning: () => { this.animation.play('running'); },
      };
      this.debugFolder.add(debugObject, 'playIdle').name('stay');
      this.debugFolder.add(debugObject, 'playWalking').name('walk');
      this.debugFolder.add(debugObject, 'playRunning').name('run');
    }
  }

  update() {
    this.animation.mixer.update(this.app.time.deltaTime * 0.001);
  }
}
