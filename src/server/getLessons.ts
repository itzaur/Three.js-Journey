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

// console.log('Vanilla Modules:', vanillaModules);
// console.log('R3F Modules:', r3fModules);

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

  return Object.entries(grouped).map(([sketch, files]) => {
    const [sketchNumber, sketchName] = sketch.split('. ');

    return {
      sketch: sketchName,
      title: `Lesson ${sketchNumber}: ${sketchName}`,
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
