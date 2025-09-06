import { createServerFn } from '@tanstack/react-start';

export type LessonType = 'r3f' | 'vanilla';
export type Lesson = {
  id: string;
  title: string;
  variants: { type: LessonType }[];
};

const r3fModules = import.meta.glob('/sketches/r3f/**/*.{ts,tsx,js,jsx}', {
  eager: false,
});
const vanillaModules = import.meta.glob('/sketches/vanilla/**/*.js', {
  eager: false,
});
// console.log(
//   'Сканирую R3F:',
//   import.meta.glob('/sketches/r3f/*', { eager: false })
// );
// console.log('r3fModules', r3fModules);
// console.log('vanillaModules', vanillaModules);

export const getLessons = createServerFn({
  method: 'GET',
}).handler(async () => {
  const r3fIds = Object.keys(r3fModules).map(getId);
  const vanillaIds = Object.keys(vanillaModules).map(getId);

  const allIds = [...new Set([...r3fIds, ...vanillaIds])];

  console.log('getLessons', {
    r3fIds,
    vanillaIds,
    allIds,
  });

  return allIds.map((id) => ({
    id,
    title: `Lesson ${id}`,
    variants: [
      ...(r3fIds.includes(id) ? [{ type: 'r3f' as const }] : []),
      ...(vanillaIds.includes(id) ? [{ type: 'vanilla' as const }] : []),
    ],
  }));
});

function getId(path: string) {
  console.log('getId', path);
  return path
    .split('/')
    .pop()!
    .replace(/\.(tsx|ts|js)$/, '');
}
