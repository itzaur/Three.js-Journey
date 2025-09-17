const r3fModules = import.meta.glob('/sketches/**/*.{ts,tsx,jsx}', {
  eager: false,
});
const vanillaModules = import.meta.glob('/sketches/**/*.js', { eager: false });

export async function loadSketch(type: 'r3f' | 'vanilla', id: string) {
  const map = type === 'r3f' ? r3fModules : vanillaModules;
  const path = Object.keys(map).find(
    (path) => path.split('/').pop() === `${id}.${type === 'r3f' ? 'tsx' : 'js'}`
  );

  if (!path) throw new Error(`Sketch not found: ${type}/${id}`);

  const mod = await map[path]();

  return mod;
}
