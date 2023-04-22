import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import EventEmitter from './EventEmitter';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;
    this.items = {}; // the loaded resources
    this.toLoad = this.sources.length; // the number of sources to load
    this.loaded = 0; // the number of sources loaded (starts at 0)

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    };
  }

  startLoading() {
    this.sources.forEach((source) => {
      const { name, type, path } = source;
      if (type === 'gltfModel') {
        this.loaders.gltfLoader.load(path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (type === 'texture') {
        this.loaders.textureLoader.load(path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(path, (file) => {
          file.encoding = THREE.sRGBEncoding;
          this.sourceLoaded(source, file);
        });
      }
    });
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    if (++this.loaded === this.toLoad) console.log('Finished loading all resources.'), this.trigger('ready');
  }
}