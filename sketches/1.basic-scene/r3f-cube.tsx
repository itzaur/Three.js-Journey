import { OrbitControls } from '@react-three/drei';

export default function BasicScene() {
  return (
    <>
      <OrbitControls />
      <mesh rotation={[0, 0.4, 0]}>
        <boxGeometry args={[2, 2, 2, 10, 10, 10]} />
        <meshStandardMaterial color='#ffa500' wireframe={true} />
      </mesh>
    </>
  );
}
