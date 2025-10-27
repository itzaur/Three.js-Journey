import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';
import { MeshParams, MetaConfig } from '@/types/types';
import gsap from 'gsap';
import { depth } from 'three/tsl';

export default class DebugUI extends BaseSketch {
  protected geometry!: THREE.BoxGeometry;
  protected material!: THREE.MeshStandardMaterial;
  protected mesh!: THREE.Mesh;
  protected params!: MeshParams;
  protected gsapContext!: gsap.Context | null;
  protected prevParams: Partial<MeshParams> = {};

  constructor(container: HTMLElement, meta?: MetaConfig) {
    super(container, meta);

    this.params = {
      position: { x: 0, y: 0, z: 0 },
      width: 1,
      height: 1,
      depth: 1,
      widthSegments: 10,
      heightSegments: 10,
      depthSegments: 10,
      rotationSpeed: 0.5,
      rotationIndex: 0.8,
      autoRotate: true,
      color: 0x00ffdd,
    };

    this.prevParams = {
      ...this.params,
    };
  }

  protected setupScene() {
    this.geometry = new THREE.BoxGeometry(
      this.params.width,
      this.params.height,
      this.params.depth,
      this.params.widthSegments,
      this.params.heightSegments,
      this.params.depthSegments
    );
    this.material = new THREE.MeshStandardMaterial({
      color: this.params.color,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(
      this.params.position.x,
      this.params.position.y,
      this.params.position.z
    );
    this.mesh.scale.set(1, 1, 1);

    this.scene.add(this.mesh);

    this.setupDebugUI();
  }

  protected setupDebugUI() {
    /**
     * Debug UI
     */
    // Folders
    const folders = ['Position', 'Sizes', 'Appearance', 'Animation'].map(
      (title) => this.pane.addFolder({ title })
    );
    const [positions, sizes, appearance, animation] = folders;

    // Change position
    positions.addBinding(this.mesh, 'position', {
      x: { min: -3, max: 3, step: 0.01 },
      y: { min: -3, max: 3, step: 0.01, inverted: true },
      z: 0,
    });

    // Change sizes
    const sizeConfigs = [
      {
        keys: ['width', 'height', 'depth'] as const,
        options: { min: 0.1, max: 3, step: 0.01 },
      },
      {
        keys: ['widthSegments', 'heightSegments', 'depthSegments'] as const,
        options: { min: 1, max: 50, step: 0.01 },
      },
    ];

    sizeConfigs.flatMap(({ keys, options }) =>
      keys.map((key) =>
        sizes.addBinding(this.params, key, options).on('change', (e) => {
          // finishchange handler
          if (e.last) {
            this.updateMesh();
          }
        })
      )
    );

    // Visibility toggle
    appearance.addBinding(this.mesh, 'visible');

    // Wireframe toggle
    appearance.addBinding(this.material, 'wireframe');

    // Change color
    this.pane
      .addBinding(this.params, 'color', {
        view: 'color',
        picker: 'inline',
      })
      .on('change', (e) => {
        try {
          this.material.color.set(e.value);
        } catch (error) {
          console.warn('Invalid color:', e.value, error);

          this.material.color.set(0xffffff);
        }
      });

    // Animations
    animation.addBinding(this.params, 'autoRotate');
    animation.addBinding(this.params, 'rotationSpeed', {
      min: 0,
      max: 3,
      step: 0.01,
    });

    this.pane.addBlade({
      view: 'separator',
    });

    // Buttons
    this.pane
      .addButton({ title: 'spin' })
      .on('click', () => this.spinAnimation());

    this.pane.addBlade({
      view: 'separator',
    });

    // Lights
    this.setupLightsUI();
  }

  protected spinAnimation() {
    if (this.gsapContext) this.gsapContext.revert();

    this.gsapContext = gsap.context(() => {
      gsap.to(this.mesh.rotation, {
        z: this.mesh.rotation.z + Math.PI * 2,
        ease: 'elastic.out(1.2, 0.8)',
        duration: 1.2,
      });
    });
  }

  private updateMesh() {
    const {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    } = this.params;

    const prev = this.prevParams;

    const needsRebuild =
      widthSegments !== prev.widthSegments ||
      heightSegments !== prev.heightSegments ||
      depthSegments !== prev.depthSegments;

    if (needsRebuild) {
      this.geometry.dispose();

      this.geometry = new THREE.BoxGeometry(
        1,
        1,
        1,
        widthSegments,
        heightSegments,
        depthSegments
      );

      this.mesh.geometry = this.geometry;
    }

    this.mesh.scale.set(width, height, depth);

    this.prevParams = {
      ...this.params,
    };
  }

  protected render() {
    super.render();

    if (this.params.autoRotate) {
      const delta = Math.min(this.clock.getDelta(), 0.1);
      const rotationSpeed = this.params.rotationSpeed ?? 0.5;
      const rotationIndex = this.params.rotationIndex ?? 0.8;

      this.mesh.rotation.x += delta * rotationSpeed * rotationIndex;
      this.mesh.rotation.y += delta * rotationSpeed * rotationIndex;
    }
  }

  dispose() {
    super.dispose();

    this.gsapContext?.revert();
    this.gsapContext = null;
  }
}
