import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();
    // Setup
    this.start = Date.now(); // timestamp when the app starts and will stay the same
    this.current = this.start; // current timestamp and will change on each frame
    this.elapsedTime = 0; // how much time was spent since the start of the app
    this.deltaTime = 16; // how much time was spent since the previous frame (16 by default b/c its close to how many ms there is between two frames at 60fps)

    // Dont call tick method by itself/immediately to avoid having delta equal to 0 on the first frame
    window.requestAnimationFrame(() => { this.tick(); });
  }

  tick() {
    const currentTime = Date.now();
    this.deltaTime = currentTime - this.current;
    this.current = currentTime;
    this.elapsedTime = this.current - this.start;
    this.trigger('tick');
    window.requestAnimationFrame(() => { this.tick(); });
  }
}