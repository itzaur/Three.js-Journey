import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';

export default class Textures extends BaseSketch {
  protected async setupScene() {
    const loaded = await this.loadAssets({
      textures: this.meta?.textures || {},
    });

    const { doorColor: doorTexture, checkerboard: checkerboardTexture } =
      loaded.textures;

    doorTexture.rotation = Math.PI / 4;
    doorTexture.center.set(0.5, 0.5);
    doorTexture.minFilter = THREE.NearestFilter;
    doorTexture.generateMipmaps = false;

    checkerboardTexture.magFilter = THREE.NearestFilter;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      map: doorTexture,
    });
    const cube = new THREE.Mesh(geometry, material);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshStandardMaterial({ map: checkerboardTexture })
    );
    cube.position.x = -1;
    sphere.position.x = 1;
    sphere.rotation.y = Math.PI / 2;

    this.scene.add(cube, sphere);
  }

  protected render() {
    super.render();
  }

  dispose() {
    super.dispose();
  }
}
