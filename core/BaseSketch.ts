import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MetaConfig } from '@/types/types';

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
  protected mousemove!: (e: MouseEvent) => void;
  protected meta?: MetaConfig;

  constructor(container: HTMLElement, meta?: MetaConfig) {
    this.container = container;
    this.meta = meta;
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
    this.createLights();
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
    const cameraOptions = this.meta?.camera;

    this.camera = new THREE.PerspectiveCamera(
      cameraOptions?.fov ?? 75,
      this.width / this.height,
      cameraOptions?.near ?? 0.1,
      cameraOptions?.far ?? 1000
    );
    const [x, y, z] = cameraOptions?.position ?? [0, 0, 3];
    this.camera.position.set(x, y, z);
  }

  protected createControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
  }

  protected createClock() {
    this.clock = new THREE.Clock();
  }

  protected createLights() {
    if (Array.isArray(this.meta?.lights)) {
      this.meta.lights.forEach((light) => {
        let lightObj: THREE.Light;

        switch (light.type) {
          case 'directional':
            lightObj = new THREE.DirectionalLight(
              light.color ?? 0xffffff,
              light.intensity ?? 1
            );
            break;
          case 'point':
            lightObj = new THREE.PointLight(
              light.color ?? 0xffffff,
              light.intensity ?? 1,
              light.distance ?? 50,
              light.decay ?? 2
            );
            break;
          case 'spot':
            lightObj = new THREE.SpotLight(
              light.color ?? 0xffffff,
              light.intensity ?? 1,
              light.distance ?? 100,
              light.angle ?? Math.PI / 4,
              light.penumbra ?? 0.3,
              light.decay ?? 2
            );
            break;
          default:
            lightObj = new THREE.AmbientLight(
              light.color ?? 0xffffff,
              light.intensity ?? 0.3
            );
        }

        const position: [number, number, number] = light?.position ?? [0, 3, 3];
        lightObj.position.set(...position);

        this.scene.add(lightObj);
      });
    }
  }

  protected createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
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

  protected enableMouseInteraction(): void {
    this.mousemove = (e) => this.onMouseMove(e);

    window.addEventListener('mousemove', this.mousemove, {
      passive: true,
    });
  }

  protected onMouseMove(e: MouseEvent) {
    const x = e.clientX / this.width - 0.5;
    const y = -(e.clientY / this.height - 0.5);

    this.camera.position.x = Math.sin(x * Math.PI * 2) * 2;
    this.camera.position.z = Math.cos(x * Math.PI * 2) * 2;
    this.camera.position.y = y * 3;
  }

  protected setupListeners() {
    window.addEventListener('resize', this.resize, { passive: true });
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();

    window.removeEventListener('resize', this.resize);

    if (this.mousemove) {
      window.removeEventListener('mousemove', this.mousemove);
    }

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
