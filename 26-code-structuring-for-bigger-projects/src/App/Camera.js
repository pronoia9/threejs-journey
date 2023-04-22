import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import App from './App';
export default class Camera {
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;
    this.fov = 35;
    this.near = 0.1;
    this.far = 100;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(this.fov, this.sizes.width / this.sizes.height, this.near, this.far);
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}