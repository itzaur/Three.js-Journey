import * as THREE from 'three';
import { OrbitControls, useTexture } from '@react-three/drei';
import doorColor from '/textures/door/color.jpg';
import checkerboard from '/textures/checkerboard-8x8.png';

export default function Textures() {
  const [doorTexture, checkerboardTexture] = useTexture(
    [doorColor, checkerboard],
    (textures) => {
      textures.forEach((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
      });
    }
  );

  doorTexture.rotation = Math.PI / 4;
  doorTexture.center.set(0.5, 0.5);
  doorTexture.minFilter = THREE.NearestFilter;
  doorTexture.generateMipmaps = false;

  checkerboardTexture.magFilter = THREE.NearestFilter;

  return (
    <>
      <OrbitControls makeDefault />

      <mesh position={[-1, 0, 0]}>
        <meshStandardMaterial map={doorTexture} />
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh position={[1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial map={checkerboardTexture} />
        <sphereGeometry args={[0.8, 32, 32]} />
      </mesh>
    </>
  );
}
