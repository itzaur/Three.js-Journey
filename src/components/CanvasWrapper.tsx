import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
  CanvasWrapperProps,
  FullscreenDocument,
  FullscreenElement,
  LightConfig,
} from '@/types/types';
import { Suspense, useCallback, useRef, useState } from 'react';
import ResizeHandler from './ResizeHandler';
import Lights from './Lights';

const CanvasWraper = ({ Component, meta }: CanvasWrapperProps) => {
  const [lights, setLights] = useState<LightConfig[]>(meta?.lights || []);
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
    <Suspense fallback={null}>
      <Canvas
        // gl={{
        //   outputColorSpace: THREE.SRGBColorSpace,
        //   toneMapping: THREE.ACESFilmicToneMapping,
        //   toneMappingExposure: 1.0,
        //   antialias: true,
        // }}
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
        <Lights lights={lights} />

        <Component meta={{ ...meta, lights }} setLights={setLights} />
      </Canvas>
    </Suspense>
  );
};

export default CanvasWraper;
