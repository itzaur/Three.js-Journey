const r3fModules = import.meta.glob('/sketches/r3f/**/*.{ts,tsx}', {
  eager: false,
});
const vanillaModules = import.meta.glob('/sketches/vanilla/**/*.js', {
  eager: false,
});

export async function loadSketch(type: string, id: string) {
  const map = type === 'r3f' ? r3fModules : vanillaModules;
  const path = Object.keys(map).find(
    (p) => p.split('/').pop() === `${id}.${type === 'r3f' ? 'tsx' : 'js'}`
  );

  if (!path) throw new Error(`Sketch not found: ${type}/${id}`);

  const mod = await map[path]();

  return mod;
}
