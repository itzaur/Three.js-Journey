import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Geometries() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const meshRef2 = useRef<THREE.Mesh>(null!);
  const meshRef3 = useRef<THREE.Mesh>(null!);
  const meshRef4 = useRef<THREE.Mesh>(null!);

  const count = 500;

  const positions = useMemo(() => {
    const position = new Array(count * 3 * 3)
      .fill(0)
      .map((_) => (Math.random() - 0.5) * 5);

    return new Float32Array(position);
  }, [count]);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;

    meshRef.current.rotation.x = Math.sin(elapsedTime) * Math.PI * 0.5;

    meshRef2.current.rotation.x = Math.sin(elapsedTime) * Math.PI * 0.5;
    meshRef2.current.rotation.y = Math.cos(elapsedTime) * Math.PI * 2 * 0.1;

    meshRef3.current.position.z = Math.sin(elapsedTime) * Math.PI * 0.1;
    meshRef3.current.position.y = Math.cos(elapsedTime) * Math.PI * 4 * 0.1;
    meshRef3.current.rotation.z = Math.tan(elapsedTime) * Math.PI * 2 * 0.01;
  });

  return (
    <>
      <OrbitControls />
      <group scale={[0.8, 0.8, 0.8]}>
        <mesh ref={meshRef}>
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              args={[positions, 3]}
            />
          </bufferGeometry>
          <shaderMaterial wireframe={true} />
        </mesh>

        <mesh ref={meshRef2} position={[-6, 0, 0]} scale={[0.2, 0.2, 0.2]}>
          <torusGeometry args={[10, 3, 16, 100]} />
          <meshToonMaterial />
        </mesh>

        <mesh ref={meshRef3} position={[6, 0, 0]} scale={[0.2, 0.2, 0.2]}>
          <torusKnotGeometry args={[10, 3, 100, 16]} />
          <meshLambertMaterial />
        </mesh>

        <mesh ref={meshRef4} position={[0, 0, -20]}>
          <planeGeometry args={[70, 35]} />
          <meshPhongMaterial color={0x00ffff} />
        </mesh>
      </group>
    </>
  );
}
