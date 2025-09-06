import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function BasicScene() {
  return (
    <Canvas>
      <mesh>
        <ambientLight intensity={Math.PI / 2} />
        <OrbitControls />
        <boxGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>
    </Canvas>
  );
}
