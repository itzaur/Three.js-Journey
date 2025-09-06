import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';
import { loadSketch } from '@/utils/sketchLoader';

export const Route = createFileRoute('/lessons/lesson/$type/$id')({
  loader: async ({ params }) => params,
  component: LessonDetail,
});

function LessonDetail() {
  const { type, id } = Route.useLoaderData();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const mod = (await loadSketch(type, id)) as {
        default: React.ComponentType | ((container: HTMLElement) => void);
      };

      return type === 'vanilla'
        ? (mod.default as (container: HTMLElement) => void)(
            containerRef.current!
          )
        : setComponent(() => mod.default as React.ComponentType);
    })();
  }, [type, id]);

  if (type === 'vanilla')
    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;

  return Component ? <Component /> : <div>Loading...</div>;
}
