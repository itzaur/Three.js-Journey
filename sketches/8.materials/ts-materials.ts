import * as THREE from 'three';
import { BaseSketch } from 'core/BaseSketch';

export default class Materials extends BaseSketch {
  protected async setupScene() {
    const loaded = await this.loadAssets({
      textures: this.meta?.textures || {},
      hdri: this.meta?.hdri || {},
    });

    const {
      doorColor,
      doorAlpha,
      doorAmbientOcclusion,
      doorHeight,
      doorNormal,
      doorMetalness,
      doorRoughness,
      matCaps1,
      matCaps2,
      gradientMap,
    } = loaded.textures;
    const { studio: hdriTexture } = loaded.hdri;

    this.scene.background = hdriTexture;
    this.scene.environment = hdriTexture;

    const material = new THREE.MeshStandardMaterial({
      map: doorColor,
      displacementMap: doorHeight,
      displacementScale: 0.1,
      normalMap: doorNormal,
      aoMap: doorAmbientOcclusion,
      aoMapIntensity: 1,
      alphaMap: doorAlpha,
      transparent: true,
      side: 2,
      metalnessMap: doorMetalness,
      roughnessMap: doorRoughness,
      metalness: 1,
      roughness: 1,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });

    const material2 = new THREE.MeshPhongMaterial({
      shininess: 100,
      specular: new THREE.Color(0x1188ff),
    });
    const material3 = new THREE.MeshMatcapMaterial({
      matcap: matCaps1,
    });
    const material4 = new THREE.MeshNormalMaterial({ flatShading: true });
    const material5 = new THREE.MeshLambertMaterial({});
    const material6 = new THREE.MeshToonMaterial({ gradientMap });
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.generateMipmaps = false;

    const material7 = new THREE.MeshStandardMaterial({
      metalness: 0.7,
      roughness: 0.2,
      color: 0xffaa00,
    });
    const material8 = new THREE.MeshPhysicalMaterial({
      clearcoat: 1,
      clearcoatRoughness: 0,
      sheen: 1,
      sheenRoughness: 0.25,
      sheenColor: new THREE.Color(0x8800ff),
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      color: 0xff9900,
      transmission: 1,
      thickness: 2,
      ior: 1.5,
      roughness: 0,
      metalness: 0,
    });
    const material9 = new THREE.MeshMatcapMaterial({
      matcap: matCaps2,
    });

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material2
    );
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 100, 100),
      material
    );
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material3
    );
    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material9
    );
    const sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      material4
    );
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      material5
    );
    const sphere3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material6
    );
    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      material7
    );
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 64), material8);

    sphere.position.set(-1.5, 1, 0);
    torus.position.set(1.5, 1, 0);
    torus2.position.set(-1.5, -1, 0);
    sphere2.position.set(0, 1, 0);
    sphere3.position.set(1.5, 0, 0);
    cube.position.set(-1.5, 0, 0);
    cube2.position.set(1.5, -1, 0);
    cone.position.set(0, -1, 0);

    this.scene.add(
      sphere,
      plane,
      torus,
      torus2,
      sphere2,
      cube,
      cube2,
      cone,
      sphere3
    );
  }

  protected render() {
    super.render();

    const elapsedTime = this.clock.getElapsedTime();

    this.scene.children.forEach((child) => {
      child.rotation.y = 0.1 * elapsedTime;
      child.rotation.x = -0.15 * elapsedTime;
    });
  }

  dispose() {
    super.dispose();
  }
}
