import * as THREE from 'three';

class Sphere {
  constructor(container) {
    this.container = container;
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
  }

  init() {
    this.addScene();
    this.addCamera();
    this.addRenderer();
    this.addMesh();

    this.renderer.setAnimationLoop(() => this.render());
  }

  addScene() {
    this.scene = new THREE.Scene();
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 3;
  }

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  addMesh() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
    this.container.innerHTML = '';
    this.scene = null;
    this.camera = null;
    this.cube = null;
  }
}

export default function createSphere(container) {
  const sphere = new Sphere(container);
  sphere.init();

  return {
    dispose: () => sphere.dispose(),
  };
}
