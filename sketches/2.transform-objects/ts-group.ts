import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

import { BaseSketch } from 'core/BaseSketch';

export default class Sphere extends BaseSketch {
  private sphere!: THREE.Mesh;
  private cube!: THREE.Mesh;
  private axesHelper!: THREE.AxesHelper;
  private group!: THREE.Group;
  private transformControls!: TransformControls;
  gismo!: THREE.Object3D;

  protected setupScene(): void {
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xadfcbb,
      wireframe: true,
      depthTest: false,
    });
    this.group = new THREE.Group();
    this.sphere = new THREE.Mesh(geometry, material);
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
      material
    );
    this.cube.position.set(-2, 0, 0);
    this.sphere.position.set(1.5, 0.5, 0);
    this.group.add(this.sphere, this.cube);
    this.scene.add(this.group);
    this.camera.position.set(3, 2, 3);
    this.group.position.y = 0.5;

    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.transformControls.attach(this.group);

    this.axesHelper = new THREE.AxesHelper(3);
    this.axesHelper.renderOrder = 1;
    this.scene.add(this.axesHelper);
    this.scene.add(new THREE.GridHelper(5, 10, 0x888888, 0x444444));

    this.transformControls.addEventListener('change', () => this.render());
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });
    this.transformControls.attach(this.group);

    this.gismo = this.transformControls.getHelper();
    this.scene.add(this.gismo);
  }

  protected render() {
    super.render();
  }
}
