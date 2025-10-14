import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Animations() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    meshRef.current.rotation.y = Math.sin(elapsedTime) * Math.PI * 0.1;
    meshRef.current.rotation.x = Math.cos(elapsedTime) * Math.PI * 0.1;

    meshRef.current.position.y = (Math.sin(elapsedTime) * Math.PI) / 2;
    meshRef.current.position.x = (Math.cos(elapsedTime) * Math.PI) / 2;
  });

  return (
    <>
      <OrbitControls enableDamping={true} makeDefault />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <meshStandardMaterial color='#a8b1ff' wireframe={true} />
        <capsuleGeometry args={[0.5, 0.5, 4, 8]} />
      </mesh>
    </>
  );
}
