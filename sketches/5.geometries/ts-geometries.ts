import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';

export default class Geometries extends BaseSketch {
  private mesh!: THREE.Mesh;
  private mesh2!: THREE.Mesh;
  private mesh3!: THREE.Mesh;
  private mesh4!: THREE.Mesh;

  protected setupScene() {
    const group = new THREE.Group();
    const geometry = new THREE.BufferGeometry();

    const count = 500;
    const positionsArray = new Float32Array(count * 3 * 3);

    for (let i = 0; i < positionsArray.length; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 5;
    }

    const positionsAttributes = new THREE.BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', positionsAttributes);

    const material = new THREE.ShaderMaterial({ wireframe: true });
    this.mesh = new THREE.Mesh(geometry, material);

    const geometry2 = new THREE.TorusGeometry(10, 3, 16, 100);
    const material2 = new THREE.MeshToonMaterial();
    this.mesh2 = new THREE.Mesh(geometry2, material2);
    this.mesh2.position.set(-6, 0, 0);
    this.mesh2.scale.set(0.2, 0.2, 0.2);

    const geometry3 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material3 = new THREE.MeshLambertMaterial();
    this.mesh3 = new THREE.Mesh(geometry3, material3);
    this.mesh3.scale.set(0.2, 0.2, 0.2);
    this.mesh3.position.set(6, 0, 0);

    const geometry4 = new THREE.PlaneGeometry(70, 35);
    const material4 = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
    });
    this.mesh4 = new THREE.Mesh(geometry4, material4);
    this.mesh4.position.set(0, 0, -20);

    group.add(this.mesh, this.mesh2, this.mesh3, this.mesh4);
    group.scale.set(0.8, 0.8, 0.8);
    this.scene.add(group);
  }

  protected render() {
    super.render();

    const elapsedTime = this.clock.getElapsedTime();

    this.mesh.rotation.x = Math.sin(elapsedTime) * Math.PI * 0.5;

    this.mesh2.rotation.x = Math.sin(elapsedTime) * Math.PI * 0.5;
    this.mesh2.rotation.y = Math.cos(elapsedTime) * Math.PI * 2 * 0.1;

    this.mesh3.position.z = Math.sin(elapsedTime) * Math.PI * 0.1;
    this.mesh3.position.y = Math.cos(elapsedTime) * Math.PI * 4 * 0.1;
    this.mesh3.rotation.z = Math.tan(elapsedTime) * Math.PI * 2 * 0.01;
  }
}
