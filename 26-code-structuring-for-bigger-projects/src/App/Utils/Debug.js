import * as dat from 'lil-gui';

import App from '../App';

export default class Debug {
  constructor() {
    this.params = {};
    this.active = window.location.hash == '#debug';
    if (this.active)  this.gui = new dat.GUI();
  }
}