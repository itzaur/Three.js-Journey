import {
  SketchType,
  R3FModule,
  VanillaModule,
  LoadedSketch,
} from '@/types/types';

const r3fModules = import.meta.glob<R3FModule>('/sketches/**/*.{tsx,jsx}', {
  eager: false,
});
const vanillaModules = import.meta.glob<VanillaModule>(
  '/sketches/**/*.{ts,js}',
  {
    eager: false,
  }
);

export async function loadSketch(
  type: SketchType,
  id: string
): Promise<LoadedSketch> {
  const map = type === 'r3f' ? r3fModules : vanillaModules;
  const exts = type === 'r3f' ? ['tsx', 'jsx'] : ['ts', 'js'];

  const path = Object.keys(map).find((path) => {
    const fileName = path.split('/').pop()!;

    return exts.some((ext) => fileName === `${id}.${ext}`);
  });

  if (!path) throw new Error(`Sketch not found: ${type}/${id}`);

  const mod = await map[path]!();

  return type === 'r3f'
    ? { kind: 'r3f', mod: mod as R3FModule }
    : { kind: 'vanilla', mod: mod as VanillaModule };
}
