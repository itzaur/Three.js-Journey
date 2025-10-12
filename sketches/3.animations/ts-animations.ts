import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';

export default class Animations extends BaseSketch {
  private mesh!: THREE.Mesh;

  protected setupScene() {
    const geometry = new THREE.CapsuleGeometry(0.5, 0.5, 4, 8);
    const material = new THREE.MeshBasicMaterial({
      color: '#a8b1ff',
      wireframe: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.scene.add(this.mesh);
  }

  protected render() {
    super.render();

    const elapsedTime = this.clock.getElapsedTime();
    this.mesh.rotation.y = Math.sin(elapsedTime) * Math.PI * 0.1;
    this.mesh.rotation.x = Math.cos(elapsedTime) * Math.PI * 0.1;

    this.mesh.position.y = (Math.sin(elapsedTime) * Math.PI) / 2;
    this.mesh.position.x = (Math.cos(elapsedTime) * Math.PI) / 2;
  }
}
