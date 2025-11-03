import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';
import doorColor from '/textures/door/color.jpg';
import checkerboard from '/textures/checkerboard-8x8.png';

export default class Textures extends BaseSketch {
  protected setupScene() {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
      // console.log('loading started');
    };
    loadingManager.onProgress = () => {
      // console.log('loading progressing');
    };
    loadingManager.onLoad = () => {
      // console.log('loading finished');
    };
    loadingManager.onError = () => {
      // console.log('loading error');
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const doorTexture = textureLoader.load(doorColor);
    doorTexture.wrapS = THREE.RepeatWrapping;
    doorTexture.wrapT = THREE.RepeatWrapping;
    doorTexture.rotation = Math.PI / 4;
    doorTexture.center.set(0.5, 0.5);

    doorTexture.colorSpace = THREE.SRGBColorSpace;
    doorTexture.minFilter = THREE.NearestFilter;
    doorTexture.generateMipmaps = false;

    const checkerboardTexture = textureLoader.load(checkerboard);
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
