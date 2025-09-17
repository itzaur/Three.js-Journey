import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';
import { loadSketch } from '@/utils/sketchLoader';

export const Route = createFileRoute('/lessons/$sketch/$type/$id')({
  loader: async ({ params }) => ({
    ...params,
    type: params.type as 'r3f' | 'vanilla',
  }),
  component: LessonDetail,
});

function LessonDetail() {
  const { type, id } = Route.useLoaderData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let isMounted = true;

    let cleanup: (() => void) | null = null; // Track cleanup function

    (async () => {
      const mod = (await loadSketch(type, id)) as {
        default:
          | React.ComponentType
          | ((container: HTMLElement) => {
              render: () => void;
              destroy: () => void;
            })
          | ((container: HTMLElement) => void);
      };

      if (!isMounted) return;

      if (type === 'vanilla') {
        // Get cleanup function from module if exists

        const vanillaModule = mod.default as (
          container: HTMLElement
        ) => { render: () => void; destroy: () => void } | void;

        // Clear existing canvas

        if (containerRef.current) {
          containerRef.current?.replaceChildren();
          cleanup = null;
        }

        // Render new sketch and save cleanup

        const sketchInstance = vanillaModule(containerRef.current!);

        cleanup = sketchInstance?.destroy
          ? sketchInstance.destroy
          : () => {
              /* Default cleanup */
              if (containerRef.current) {
                containerRef.current?.replaceChildren();
              }
            };
      } else {
        // For R3F, use standard component cleanup

        setComponent(() => mod.default as React.ComponentType);

        cleanup = () => setComponent(null);
      }
    })();

    return () => {
      isMounted = false;

      cleanup?.(); // Execute cleanup on unmount
    };
  }, [type, id]);

  if (type === 'vanilla') {
    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
  }

  return Component ? <Component /> : <div>Loading...</div>;
}
