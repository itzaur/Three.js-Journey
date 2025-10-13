import { Canvas } from '@react-three/fiber';
import { CanvasWrapperProps } from '@/types/types';

const CanvasWraper = ({ Component, meta }: CanvasWrapperProps) => {
  return (
    <Canvas
      camera={{
        position: meta?.camera?.position,
        fov: meta?.camera?.fov ?? 75,
        near: meta?.camera?.near ?? 0.1,
        far: meta?.camera?.far ?? 1000,
      }}
    >
      {Array.isArray(meta?.lights) &&
        meta.lights.map((light, i) => {
          switch (light.type) {
            case 'directional':
              return (
                <directionalLight
                  key={i}
                  position={light.position || [2, 2, 2]}
                  intensity={light.intensity ?? 1}
                />
              );
            case 'point':
              return (
                <pointLight
                  key={i}
                  position={light.position || [0, 3, 3]}
                  intensity={light.intensity ?? 1}
                />
              );
            case 'spot':
              return (
                <spotLight
                  key={i}
                  position={light.position || [0, 3, 3]}
                  intensity={light.intensity ?? 1}
                />
              );
            default:
              return (
                <ambientLight key={i} intensity={light.intensity ?? 0.3} />
              );
          }
        })}
      <Component />
    </Canvas>
  );
};

export default CanvasWraper;
