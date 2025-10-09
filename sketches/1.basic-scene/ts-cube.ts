import * as THREE from 'three';
import { BaseSketch } from '../../core/BaseSketch';

export default class Cube extends BaseSketch {
  private cube!: THREE.Mesh;

  protected setupScene() {
    const geometry = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10);
    const material = new THREE.MeshBasicMaterial({
      color: '#ffa500',
      wireframe: true,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.rotation.set(0, 0.4, 0);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  protected render() {
    super.render();
  }
}
