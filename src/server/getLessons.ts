import { createServerFn } from '@tanstack/react-start';

export type LessonType = 'r3f' | 'vanilla';
export type LessonVariant = { type: LessonType; id: string; file: string };
export type Lesson = {
  sketch: string;
  title: string;
  id: string;
  variants: LessonVariant[];
};

const r3fModules = import.meta.glob('/sketches/**/*.{ts,tsx,jsx}', {
  eager: false,
});
const vanillaModules = import.meta.glob('/sketches/**/*.js', {
  eager: false,
});

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
