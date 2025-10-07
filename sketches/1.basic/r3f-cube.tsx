import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function BasicScene() {
  return (
    <Canvas>
      <mesh>
        <ambientLight intensity={Math.PI / 2} />
        <OrbitControls />
        <boxGeometry args={[2, 2, 2, 10, 10, 10]} />
        <meshStandardMaterial color='orange' wireframe={true} />
      </mesh>
    </Canvas>
  );
}
