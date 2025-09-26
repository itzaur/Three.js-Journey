import * as THREE from 'three';

export interface Disposable {
  dispose(): void;
}

export abstract class BaseSketch implements Disposable {
  protected readonly container: HTMLElement;
  protected readonly width: number;
  protected readonly height: number;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  protected abstract setupScene(): void;

  init() {
    this.setupScene();
    this.renderer.setAnimationLoop(() => this.render());
  }

  protected render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();

    this.scene.traverse((object) => {
      if ((object as THREE.Mesh).geometry) {
        (object as THREE.Mesh).geometry.dispose();
      }
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material;

        if (Array.isArray(material)) {
          material.forEach((mat) => mat.dispose());
        } else {
          material.dispose();
        }
      }
    });

    this.container.innerHTML = '';
  }
}
