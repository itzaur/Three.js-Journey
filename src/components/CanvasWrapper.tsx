import { Canvas } from '@react-three/fiber';
import {
  CanvasWrapperProps,
  FullscreenDocument,
  FullscreenElement,
} from '@/types/types';
import { useCallback, useRef } from 'react';
import ResizeHandler from './ResizeHandler';

const CanvasWraper = ({ Component, meta }: CanvasWrapperProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDoubleClick = useCallback(() => {
    const canvas = canvasRef.current as FullscreenElement;
    const doc: FullscreenDocument = document;
    const fullscreenElement = doc.fullscreenElement || doc.webkitExitFullscreen;

    if (!canvas) return;

    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      onDoubleClick={handleDoubleClick}
      camera={{
        position: meta?.camera?.position ?? [0, 0, 3],
        fov: meta?.camera?.fov ?? 75,
        near: meta?.camera?.near ?? 0.1,
        far: meta?.camera?.far ?? 1000,
      }}
    >
      <ResizeHandler />

      {Array.isArray(meta?.lights) &&
        meta.lights.map((light, i) => {
          switch (light.type) {
            case 'directional':
              return (
                <directionalLight
                  key={i}
                  position={light.position ?? [2, 2, 2]}
                  intensity={light.intensity ?? 1}
                  color={light.color ?? 0xffffff}
                />
              );
            case 'point':
              return (
                <pointLight
                  key={i}
                  position={light.position ?? [0, 3, 3]}
                  intensity={light.intensity ?? 1}
                />
              );
            case 'spot':
              return (
                <spotLight
                  key={i}
                  position={light.position ?? [0, 3, 3]}
                  intensity={light.intensity ?? 1}
                />
              );
            default:
              return (
                <ambientLight
                  key={i}
                  intensity={light.intensity ?? 0.3}
                  color={light.color ?? 0xffffff}
                />
              );
          }
        })}

      <Component />
    </Canvas>
  );
};

export default CanvasWraper;
