import * as THREE from 'three';

import App from '../App';
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;

    this.resources.on('ready', () => {
      console.log('Resources are ready.');
      
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}