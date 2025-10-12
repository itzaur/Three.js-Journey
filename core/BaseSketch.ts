import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface Disposable {
  dispose(): void;
}

export abstract class BaseSketch implements Disposable {
  protected container: HTMLElement;
  protected width: number;
  protected height: number;
  protected scene!: THREE.Scene;
  protected camera!: THREE.PerspectiveCamera;
  protected renderer!: THREE.WebGLRenderer;
  protected controls!: OrbitControls;
  protected clock!: THREE.Clock;
  protected resize: () => void;
  protected resizeObserver?: ResizeObserver;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.resize = () => this.onResize();
  }

  protected abstract setupScene(): void;

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.createClock();
    this.setupScene();
    this.setupListeners();

    this.renderer.setAnimationLoop(() => {
      this.update();
      this.render();
    });
  }

  protected createScene() {
    this.scene = new THREE.Scene();
  }

  protected createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 3;
  }

  protected createControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
  }

  protected createClock() {
    this.clock = new THREE.Clock();
  }

  protected createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  protected render() {
    this.renderer.render(this.scene, this.camera);
  }

  protected update() {
    this.controls.update();
  }

  protected onResize() {
    // Update sizes
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected setupListeners() {
    window.addEventListener('resize', this.resize, { passive: true });
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
