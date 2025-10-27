import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { button, folder, useControls } from 'leva';
import { LightConfig, MetaConfig } from '@/types/types';
import useLightsControls from '@/hooks/useLightsControls';
import gsap from 'gsap';

export default function DebugUI({
  meta,
  setLights,
}: {
  meta: MetaConfig;
  setLights: React.Dispatch<React.SetStateAction<LightConfig[]>>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  /*
   * Add debug UI for position
   */
  const { position } = useControls('Position', {
    position: {
      value: { x: 0, y: 0 },
      min: -3,
      max: 3,
      step: 0.1,
      joystick: 'invertY',
    },
  });

  /*
   * Add debug UI for sizes
   */
  const { size, segments } = useControls('Sizes', {
    size: {
      value: { width: 1, height: 1, depth: 1 },
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    segments: {
      value: { width: 10, height: 10, depth: 10 },
      min: 1,
      max: 50,
      step: 1,
    },
  });

  /*
   * Add debug UI for appearance
   */
  const { visible, wireframe } = useControls('Appearance', {
    visible: {
      value: true,
    },
    wireframe: {
      value: false,
    },
  });

  /*
   * Add debug UI for animation
   */
  const { autoRotate, rotationSpeed } = useControls('Animation', {
    autoRotate: {
      value: true,
    },
    rotationSpeed: {
      value: 0.5,
      min: 0,
      max: 3,
      step: 0.01,
    },
  });

  /*
   * Add debug UI for color
   */
  const { color } = useControls({
    color: { value: '#00ffdd' },
  });

  /*
   * Add debug UI for button
   */
  useControls({
    spin: button(() => {
      gsap.to(meshRef.current.rotation, {
        z: meshRef.current.rotation.z + Math.PI * 2,
        ease: 'elastic.out(1.2, 0.8)',
        duration: 1.2,
      });
    }),
  });

  /*
   * Add debug UI for lights based on meta.lights
   */
  const lightsMeta = meta.lights || [];

  useLightsControls({ lights: lightsMeta, setLights });

  useEffect(() => {
    return () => gsap.killTweensOf(meshRef.current?.rotation);
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    if (!meshRef.current) return;

    if (autoRotate) {
      meshRef.current.rotation.x += clampedDelta * rotationSpeed * 0.8;
      meshRef.current.rotation.y += clampedDelta * rotationSpeed * 0.8;
    }
  });

  return (
    <>
      <OrbitControls makeDefault />
      <mesh
        ref={meshRef}
        position={[position.x, position.y, 0]}
        visible={visible}
        scale={[size.width, size.height, size.depth]}
      >
        <boxGeometry
          args={[1, 1, 1, segments.width, segments.height, segments.depth]}
        />
        <meshStandardMaterial color={color} wireframe={wireframe} />
      </mesh>
    </>
  );
}
