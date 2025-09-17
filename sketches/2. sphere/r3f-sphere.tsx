import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function BasicScene() {
  return (
    <Canvas>
      <mesh>
        <ambientLight intensity={Math.PI / 2} />
        <OrbitControls />
        <sphereGeometry args={[2, 32, 16]} />
        <meshStandardMaterial color='orange' wireframe={true} />
      </mesh>
    </Canvas>
  );
}
