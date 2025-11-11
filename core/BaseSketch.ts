import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  AssetMap,
  FullscreenDocument,
  FullscreenElement,
  LightConfig,
  LoadedAssets,
  MetaConfig,
  TextureOptions,
} from '@/types/types';
import { Pane } from 'tweakpane';

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
  protected lights: Array<{ config: LightConfig; obj: THREE.Light }> = [];
  protected isFullscreen!: boolean;
  protected loadingManager: THREE.LoadingManager;
  protected resize: () => void;
  protected doubleClick: () => void;
  protected mousemove!: (e: MouseEvent) => void;
  protected pane!: Pane;
  protected meta?: MetaConfig;

  constructor(container: HTMLElement, meta?: MetaConfig) {
    this.container = container;
    this.meta = meta;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.isFullscreen = false;

    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = () => this.startRenderLoop();

    this.resize = () => this.onResize();
    this.doubleClick = () => this.onDoubleClick();
  }

  protected abstract setupScene(): Promise<void> | void;

  async init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.createClock();
    this.createLights();
    this.createDebugUI();
    this.setupListeners();

    try {
      const result = this.setupScene();

      if (result instanceof Promise) {
        await result;
      }

      this.startRenderLoop();
    } catch (error) {
      console.error('Error during setupScene:', error);
    }
  }

  protected startRenderLoop() {
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

  protected async loadAssets<T extends AssetMap>(
    map: T
  ): Promise<LoadedAssets<T>> {
    const texturesLoader = new THREE.TextureLoader(this.loadingManager);
    const rgbeLoader = new (
      await import('three/examples/jsm/loaders/RGBELoader.js')
    ).RGBELoader(this.loadingManager);

    const loadRecord = async <R>(
      record: Record<string, string> | undefined,
      loadFn: (url: string) => Promise<R>
    ) => {
      return record
        ? Object.fromEntries(
            await Promise.all(
              Object.entries(record).map(async ([key, value]) => [
                key,
                await loadFn(value),
              ])
            )
          )
        : {};
    };

    const [textures, hdri] = await Promise.all([
      // Add textures loader here if needed
      loadRecord(
        map.textures,
        (url) =>
          new Promise<THREE.Texture>((resolve, reject) =>
            texturesLoader.load(
              url,
              (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.needsUpdate = true;
                resolve(tex);
              },
              undefined,
              (err) => reject(err)
            )
          )
      ),
      // TODO: Add model loader here if needed

      // TODO: Add HDRI loader here if needed
      loadRecord(map.hdri, (url) => {
        return new Promise<THREE.DataTexture>((resolve, reject) => {
          rgbeLoader.load(
            url,
            (hdr) => {
              hdr.mapping = THREE.EquirectangularReflectionMapping;

              resolve(hdr);
            },
            undefined,
            (err) => reject(err)
          );
        });
      }),
    ]);

    return { textures, hdri } as LoadedAssets<T>;
  }

  protected async loadTextures(url: string, options: TextureOptions = {}) {
    const loader = new THREE.TextureLoader(this.loadingManager);
    const texture = await loader.loadAsync(url);

    Object.entries(options).forEach(([key, value]) => {
      switch (key) {
        case 'center':
          if (value instanceof THREE.Vector2) {
            texture.center.copy(value);
          }
          break;
        case 'repeat':
          if (value instanceof THREE.Vector2) {
            texture.repeat.copy(value);
          }
          break;
        case 'offset':
          if (value instanceof THREE.Vector2) {
            texture.offset.copy(value);
          }
          break;
        default:
          Reflect.set(texture, key, value);
      }
    });

    texture.needsUpdate = true;

    return texture;
  }

  protected createClock() {
    this.clock = new THREE.Clock();
  }

  protected createLights() {
    if (!this.meta) this.meta = {};
    if (!Array.isArray(this.meta?.lights)) this.meta.lights = [];

    this.createLightsFrpomMeta();
  }

  protected createLightsFrpomMeta() {
    this.meta?.lights?.forEach((light) => {
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

      const position: THREE.Vector3Tuple = light?.position ?? [0, 3, 3];
      lightObj.position.set(...position);

      if (lightObj.castShadow) lightObj.castShadow = true;

      this.scene.add(lightObj);

      this.lights.push({ config: light, obj: lightObj });
    });
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
    if (this.isFullscreen) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    } else {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
    }

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

  protected onDoubleClick() {
    this.isFullscreen = !this.isFullscreen;

    const doc: FullscreenDocument = document;
    const canvas: FullscreenElement = this.renderer.domElement;

    const fullscreenElement =
      doc.fullscreenElement || doc.webkitFullscreenElement;

    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }

    const colorBg = getComputedStyle(document.documentElement).getPropertyValue(
      '--bg-color'
    );

    this.renderer.setClearColor(colorBg, 1);
  }

  protected setupListeners() {
    window.addEventListener('resize', this.resize, { passive: true });
    window.addEventListener('dblclick', this.doubleClick, { passive: true });
  }

  protected createDebugUI() {
    this.pane = new Pane();
  }

  protected setupLightsUI() {
    const [ambientLight, directionalLight] = this.lights;
    const lightsFolder = this.pane.addFolder({ title: 'Lights' });

    const lightsTab = lightsFolder.addTab({
      pages: [
        { title: ambientLight.config.type },
        { title: directionalLight.config.type },
      ],
    });

    const [ambientLightTab, directionalLightTab] = lightsTab.pages;

    ambientLightTab
      .addBinding(ambientLight.obj, 'position', {
        x: { min: -10, max: 10, step: 0.01 },
        y: { min: -10, max: 10, step: 0.01, inverted: true },
        z: 0,
      })
      .on('change', (e) => {
        ambientLight.obj.position.copy(e.value);
      });

    ambientLightTab.addBinding(ambientLight.obj, 'intensity', {
      min: 0,
      max: 10,
      step: 0.01,
    });

    ambientLightTab
      .addBinding(ambientLight.obj, 'color', {
        view: 'color',
        // picker: 'inline',
        color: { type: 'float', alpha: true },
      })
      .on('change', (e) => {
        try {
          ambientLight.obj.color.set(e.value);
        } catch (error) {
          console.warn('Invalid color:', e.value, error);

          ambientLight.obj.color.set(0xffffff);
        }
      });

    directionalLightTab
      .addBinding(directionalLight.obj, 'position', {
        x: { min: -3, max: 3, step: 0.01 },
        y: { min: -3, max: 3, step: 0.01, inverted: true },
        z: 0,
      })
      .on('change', (e) => {
        directionalLight.obj.position.copy(e.value);
      });

    directionalLightTab.addBinding(directionalLight.obj, 'intensity', {
      min: 0,
      max: 20,
      step: 0.01,
    });

    directionalLightTab
      .addBinding(directionalLight.obj, 'color', {
        view: 'color',
        // picker: 'inline',
        color: { type: 'float' },
      })
      .on('change', (e) => {
        try {
          directionalLight.obj.color.set(e.value);
        } catch (error) {
          console.warn('Invalid color:', e.value, error);

          directionalLight.obj.color.set(0xffffff);
        }
      });
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();

    if (this.controls) this.controls.dispose();
    if (this.pane) this.pane.dispose();

    window.removeEventListener('resize', this.resize);
    window.removeEventListener('dblclick', this.doubleClick);

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
    this.scene.clear();

    this.container.innerHTML = '';
  }
}
