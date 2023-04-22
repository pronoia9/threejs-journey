import * as THREE from 'three';

import Debug from './Utils/Debug';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import sources from './sources';
import { Bone } from 'three';

let instance = null;

export default class App {
  constructor(canvas = document.querySelector('canvas.webgl')) {
    // Singleton
    if (instance) return instance;
    instance = this;

    // Global access
    window.app = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Events
    // Sizes resize event
    this.sizes.on('resize', () => { this.resize(); });
    // Time tick event
    this.time.on('tick', () => { this.update(); });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    // const clock = new THREE.Clock()
    // Update controls
    this.camera.update();
    // Fox animation
    this.world.update();
    // Render
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    // Traverse the whole scene: dispose geometries, materials, textures, and specific things like controls, passes, etc
    this.scene.traverse((child) => {
      // console.log(child.type); // Scene, PerspectiveCamera, Mesh, Group, Object3D, Bone, SkinnedMesh, DirectionalLight
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          // console.log(key);
          const value = child.material[key];
          // console.log(value);
          if (value && typeof value === 'function') value.dispose();
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.gui.destroy();
  }
}