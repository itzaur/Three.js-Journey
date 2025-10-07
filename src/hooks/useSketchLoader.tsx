import { useEffect, useRef, useState } from 'react';
import { SketchType } from '@/types/types';
import { Disposable } from 'core/BaseSketch';
import { loadSketch } from '@/utils/sketchLoader';
import { createSketchFactory } from 'core/sketchFactory';

export const useSketchLoader = (type: SketchType, id: string) => {
  const [R3FComponent, setR3FComponent] = useState<React.ComponentType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const vanillaRef = useRef<Disposable | null>(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadSketchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { mod, kind } = await loadSketch(type, id);

        if (!isMounted) return;

        if (kind === 'vanilla') {
          if (containerRef.current) {
            containerRef.current?.replaceChildren();

            const vanillaModule = mod.default;
            const factory = createSketchFactory(vanillaModule);

            vanillaRef.current = factory(containerRef.current!);
          }
        } else {
          const r3fComponent = mod.default;
          setR3FComponent(() => r3fComponent);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load sketch')
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSketchData();

    return () => {
      isMounted = false;
      vanillaRef.current?.dispose();
      vanillaRef.current = null;
    };
  }, [type, id]);

  return {
    containerRef,
    descriptionRef,
    R3FComponent,
    isLoading,
    error,
  };
};
