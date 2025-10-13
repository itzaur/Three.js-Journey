import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';

export default class Cameras extends BaseSketch {
  private plane!: THREE.Mesh;
  private mesh!: THREE.Mesh;

  protected setupScene() {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: '#262743',
      side: 2,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.position.set(0, -1, 0);
    this.plane.rotation.set(-Math.PI / 2, 0, 0);

    const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: '#a8b1ff',
    });
    this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    this.mesh.position.y = -0.5;

    this.controls.enabled = false;

    this.scene.add(this.plane, this.mesh);
  }

  protected render() {
    super.render();
    const elapsedTime = this.clock.getElapsedTime();

    this.camera.position.x = (Math.sin(elapsedTime) * Math.PI * 0.4) / 0.6;
    this.camera.position.y = (Math.cos(elapsedTime) * Math.PI * 0.6) / 3;
  }
}
