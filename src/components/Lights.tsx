import { LightConfig, MetaConfig } from '@/types/types';

export default function Lights({ lights }: { lights: LightConfig[] }) {
  return lights.map((light, i) => {
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
  });
}
