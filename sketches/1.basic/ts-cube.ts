import * as THREE from 'three';
import { BaseSketch } from '../../core/BaseSketch';

export default class Cube extends BaseSketch {
  private cube!: THREE.Mesh;

  protected setupScene() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  protected render() {
    super.render();
  }
}
