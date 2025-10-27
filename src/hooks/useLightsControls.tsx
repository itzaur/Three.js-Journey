import { LightsProps } from '@/types/types';
import { useControls, folder } from 'leva';

export default function useLightsControls({ lights, setLights }: LightsProps) {
  useControls(() => {
    const lightFolders: Record<string, ReturnType<typeof folder>> = {};

    lights.forEach((light, i) => {
      const suffix = `_${i + 1}`;
      const folderName = `${light.type}${suffix}`;

      lightFolders[folderName] = folder({
        [`intensity${suffix}`]: {
          label: 'Intensity',
          value: light.intensity ?? 1,
          min: 0,
          max: 10,
          step: 0.1,
          onChange: (v: number) =>
            setLights((prev) =>
              prev.map((l, idx) => (idx === i ? { ...l, intensity: v } : l))
            ),
        },
        [`color${suffix}`]: {
          label: 'Color',
          value: light.color ?? '#ffffff',
          onChange: (v: string) =>
            setLights((prev) =>
              prev.map((l, idx) => (idx === i ? { ...l, color: v } : l))
            ),
        },
        [`position${suffix}`]: folder({
          [`pos2D${suffix}`]: {
            label: '[x, y]',
            value: { x: light.position?.[0] ?? 0, y: light.position?.[1] ?? 0 },
            step: 0.1,
            joystick: 'invertY',
            onChange: (v: { x: number; y: number }) =>
              setLights((prev) =>
                prev.map((l, idx) =>
                  idx === i
                    ? { ...l, position: [v.x, v.y, l.position?.[2] ?? 0] }
                    : l
                )
              ),
          },
        }),
      });
    });

    return {
      Lights: folder(lightFolders),
    };
  }, [lights, setLights]);
}
