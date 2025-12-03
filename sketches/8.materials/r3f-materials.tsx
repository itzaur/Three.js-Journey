import * as THREE from 'three';
import { Environment, OrbitControls, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import meta from './meta.json';

export default function Materials() {
  const hdri = meta.hdri.studio;
  const [
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
  ] = useTexture(
    [
      meta.textures.doorColor,
      meta.textures.doorAlpha,
      meta.textures.doorAmbientOcclusion,
      meta.textures.doorHeight,
      meta.textures.doorNormal,
      meta.textures.doorMetalness,
      meta.textures.doorRoughness,
      meta.textures.matCaps1,
      meta.textures.matCaps2,
      meta.textures.gradientMap,
    ],
    (textures) => {
      textures.forEach((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
      });
    }
  );

  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;

  const material = {
    map: doorColor,
    displacementMap: doorHeight,
    displacementScale: 0.1,
    normalMap: doorNormal,
    aoMap: doorAmbientOcclusion,
    aoMapIntensity: 1,
    alphaMap: doorAlpha,
    transparent: true,
    side: THREE.DoubleSide,
    metalnessMap: doorMetalness,
    roughnessMap: doorRoughness,
    metalness: 1,
    roughness: 1,
    normalScale: new THREE.Vector2(0.5, 0.5),
  };

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    state.scene.children.forEach((child) => {
      child.rotation.y = 0.1 * elapsedTime;
      child.rotation.x = -0.15 * elapsedTime;
    });
  });

  return (
    <>
      <Environment files={hdri} background />
      <OrbitControls makeDefault />

      <mesh>
        <planeGeometry args={[1, 1, 100, 100]} />
        <meshStandardMaterial {...material} />
      </mesh>

      <mesh position={[-1.5, 1, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhongMaterial
          shininess={100}
          specular={new THREE.Color(0x1188ff)}
        />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshNormalMaterial flatShading={true} />
      </mesh>

      <mesh position={[1.5, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshToonMaterial gradientMap={gradientMap} />
      </mesh>

      <mesh position={[1.5, 1, 0]}>
        <torusGeometry args={[0.3, 0.2, 64, 128]} />
        <meshMatcapMaterial matcap={matCaps1} />
      </mesh>

      <mesh position={[-1.5, -1, 0]}>
        <torusGeometry args={[0.3, 0.2, 64, 128]} />
        <meshMatcapMaterial matcap={matCaps2} />
      </mesh>

      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshLambertMaterial />
      </mesh>

      <mesh position={[1.5, -1, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          metalness={0.7}
          roughness={0.2}
          color={0xffaa00}
        />
      </mesh>

      <mesh position={[0, -1, 0]}>
        <coneGeometry args={[0.5, 1, 64]} />
        <meshPhysicalMaterial
          metalness={0}
          roughness={0}
          ior={1.5}
          thickness={2}
          transmission={1}
          clearcoat={1}
          clearcoatRoughness={0}
          sheen={1}
          sheenRoughness={0.25}
          sheenColor={new THREE.Color(0x8800ff)}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          color={0xff9900}
        />
      </mesh>
    </>
  );
}
