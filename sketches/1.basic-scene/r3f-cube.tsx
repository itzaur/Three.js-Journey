import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function BasicScene() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 1.6} />
      <mesh rotation={[0, 0.4, 0]}>
        <OrbitControls />
        <boxGeometry args={[2, 2, 2, 10, 10, 10]} />
        <meshStandardMaterial color='#ffa500' wireframe={true} />
      </mesh>
    </Canvas>
  );
}
