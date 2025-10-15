import { FullscreenDocument } from '@/types/types';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { PerspectiveCamera } from 'three';

export default function ResizeHandler() {
  const { gl, camera } = useThree();
  const canvas = gl.domElement;
  const container = canvas.parentElement;
  const colorBg = getComputedStyle(document.documentElement).getPropertyValue(
    '--bg-color'
  );

  useEffect(() => {
    if (!container) return;

    const resizeRenderer = () => {
      const doc: FullscreenDocument = document;

      const fullscreenElement =
        doc.fullscreenElement || doc.webkitExitFullscreen;

      const width = fullscreenElement
        ? window.innerWidth
        : container.clientWidth;
      const height = fullscreenElement
        ? window.innerHeight
        : container.clientHeight;

      gl.setSize(width, height);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      gl.setClearColor(colorBg, 1);

      (camera as PerspectiveCamera).aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resizeRenderer);

    return () => {
      window.removeEventListener('resize', resizeRenderer);
    };
  }, [gl, camera, container]);

  return null;
}
