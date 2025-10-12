import {
  SketchType,
  R3FModule,
  VanillaModule,
  LoadedSketch,
  MetaConfig,
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
const metaModules = import.meta.glob<{ default: MetaConfig }>(
  '/sketches/**/meta.json',
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

  const folder = path?.split('/').slice(0, -1).join('/');
  const metaPath = Object.keys(metaModules).find((path) => {
    return path.startsWith(folder) && path.endsWith('.json');
  });

  const mod = await map[path]!();

  let meta: MetaConfig | null = null;

  if (metaPath) {
    try {
      const metaMod = await metaModules[metaPath]!();
      meta = metaMod?.default ?? null;
    } catch (e) {
      meta = null;
    }
  }

  return type === 'r3f'
    ? { kind: 'r3f', mod: mod as R3FModule, meta }
    : { kind: 'vanilla', mod: mod as VanillaModule, meta };
}
