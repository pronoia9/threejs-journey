import * as THREE from 'three';

import App from '../App';

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;
    this.debug = this.app.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder =
        // this.debug.gui.children.find((folder) => folder._title == 'Environment') ||
        this.debug.gui.addFolder('Environment');
      // this.debug.gui.children.filter((folder) => folder._title == 'Environment').length == 1
      //   ? this.debugFolder.close()
      //   : this.debugFolder.open();
      this.debugFolder.open();
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#fff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);
    // Debug
    if (this.debug.active) {
      // !this.debugFolder.children.find((opt) => opt._name === 'sunlight intensity') &&
      this.debugFolder.add(this.sunLight, 'intensity', 0, 10, 0.001).name('sunlight intensity').listen();
      // !this.debugFolder.children.find((opt) => opt._name === 'sunlight posX') &&
      this.debugFolder.add(this.sunLight.position, 'x', -5, 5, 0.001).name('sunlight posX').listen();
      // !this.debugFolder.children.find((opt) => opt._name === 'sunlight posY') &&
      this.debugFolder.add(this.sunLight.position, 'y', -5, 5, 0.001).name('sunlight posY').listen();
      // !this.debugFolder.children.find((opt) => opt._name === 'sunlight posZ') &&
      this.debugFolder.add(this.sunLight.position, 'z', -5, 5, 0.001).name('sunlight posZ').listen();
    }
  }

  setEnvironmentMap() {
    this.environmentMap = { intensity: null, texture: null };
    this.environmentMap.intensity = 0.04;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    //! this.environmentMap.texture.texture.encoding = THREE.sRGBEncoding;
    // // scene.background = environmentMap
    this.scene.environment = this.environmentMap.texture;

    if (this.debug.active) {
      // !this.debugFolder.children.find((opt) => opt._name === 'envMap intensity') &&
      this.debugFolder
        .add(this.environmentMap, 'intensity', 0, 4, 0.001)
        .name('envMap intensity')
        .onChange(() => this.environmentMap.updateMaterials())
        .listen();
    }

    // Update scene
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };
    this.environmentMap.updateMaterials();
  }
}