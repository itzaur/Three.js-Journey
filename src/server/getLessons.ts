import { createServerFn } from '@tanstack/react-start';
import { VanillaModule, R3FModule, LessonVariant } from '@/types/types';

const r3fModules = import.meta.glob<R3FModule>('/sketches/**/*.{tsx,jsx}', {
  eager: false,
});
const vanillaModules = import.meta.glob<VanillaModule>(
  '/sketches/**/*.{ts,js}',
  {
    eager: false,
  }
);
const previewCovers = import.meta.glob<{ default: string }>(
  '/sketches/**/*.{png,webp}',
  {
    eager: true,
  }
);

export const getLessons = createServerFn({
  method: 'GET',
}).handler(async () => {
  const entries = [
    ...Object.keys(r3fModules).map((path) => ({ path, type: 'r3f' as const })),
    ...Object.keys(vanillaModules).map((path) => ({
      path,
      type: 'vanilla' as const,
    })),
  ];

  const grouped = entries.reduce<Record<string, LessonVariant[]>>(
    (acc, { path, type }) => {
      const parts = path.split('/');
      const sketch = parts.at(-2)!;
      const file = parts.at(-1)!.replace(/\.(tsx|ts|js|jsx)$/, '');
      const id = `${sketch}/${file}`;

      (acc[sketch] ??= []).push({ type, id, file });

      return acc;
    },
    {}
  );

  const covers = Object.entries(previewCovers).map(([path, mod]) => ({
    path,
    url: mod.default,
  }));

  return Object.entries(grouped).map(([sketch, files]) => {
    const [sketchNumber, sketchName] = sketch.split('.');

    const cover =
      covers.find((cover) => cover.path.includes(sketch))?.url ?? null;

    return {
      sketch: sketchName,
      title: `Lesson ${sketchNumber}: ${sketchName.replace(/-/g, ' ')}`,
      preview: cover,
      id: sketch,
      variants: files.map(({ type, file }) => ({
        type,
        id: file
          .split('/')
          .pop()!
          .replace(/\.(tsx|ts|jsx|js)$/, ''),
      })),
    };
  });
});
