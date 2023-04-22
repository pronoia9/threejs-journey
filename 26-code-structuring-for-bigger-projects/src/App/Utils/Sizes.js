import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRation = Math.min(window.devicePixelRatio, 2);

    // Resize event
    window.addEventListener('resize', () => {
      // Update sizes
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRation = Math.min(window.devicePixelRatio, 2);

      // Add trigger from eventemitter to alert other classes
      this.trigger('resize');
    });
  }
}