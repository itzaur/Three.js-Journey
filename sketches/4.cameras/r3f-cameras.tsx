import { useFrame } from '@react-three/fiber';

export default function Cameras() {
  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;

    state.camera.position.x = (Math.sin(elapsedTime) * Math.PI * 0.4) / 0.6;
    state.camera.position.y = (Math.cos(elapsedTime) * Math.PI * 0.6) / 3;

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color={'#262743'}
          side={2}
          polygonOffset={true}
          polygonOffsetFactor={-1}
        />
      </mesh>

      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'#a8b1ff'} />
      </mesh>
    </>
  );
}
