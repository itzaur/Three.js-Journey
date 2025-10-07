import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';

export default class Sphere extends BaseSketch {
  private sphere!: THREE.Mesh;

  protected setupScene(): void {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  protected render() {
    super.render();
  }

  // dispose() {
  //   this.renderer.setAnimationLoop(null);
  //   this.renderer.dispose();
  //   this.container.innerHTML = '';
  //   this.scene = null;
  //   this.camera = null;
  //   this.cube = null;
  // }
}

// export default function createSphere(container) {
//   const sphere = new Sphere(container);
//   sphere.init();

//   return {
//     dispose: () => sphere.dispose(),
//   };
// }
