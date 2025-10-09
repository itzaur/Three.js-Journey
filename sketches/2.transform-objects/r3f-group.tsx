import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { AxesHelper } from 'three';

extend(AxesHelper);

export default function Sketch() {
  return (
    <Canvas camera={{ position: [3, 2, 3] }}>
      <TransformControls size={1} detach={false}>
        <group position={[0, 0.5, 0]}>
          <mesh position={[1.5, 0.5, 0]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial color={0xadfcbb} wireframe={true} />
          </mesh>
          <mesh position={[-2, 0, 0]}>
            <boxGeometry args={[1, 1, 1, 5, 5, 5]} />
            <meshStandardMaterial color={0xadfcbb} wireframe={true} />
          </mesh>
        </group>
      </TransformControls>
      <ambientLight intensity={Math.PI / 2.5} />
      <axesHelper scale={2} />
      <gridHelper args={[5, 10, 0x888888, 0x444444]} />
      <OrbitControls enableDamping={true} makeDefault />
    </Canvas>
  );
}
