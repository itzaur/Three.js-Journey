import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSketchLoader } from '@/hooks/useSketchLoader';
import { Spinner } from '@/components/Spinner';
import { sketchDescriptions } from 'core/SketchDescription';
import { gsap } from 'gsap';

export const Route = createFileRoute('/lessons/$sketch/$type/$id')({
  loader: async ({ params }) => {
    const { sketch, type, id } = params;
    const description =
      sketchDescriptions[sketch] ?? 'No description available';

    return { sketch, type: type as 'r3f' | 'vanilla', id, description };
  },
  component: LessonDetail,
});

function LessonDetail() {
  const { type, id, description } = Route.useLoaderData();

  const { containerRef, descriptionRef, R3FComponent, isLoading, error } =
    useSketchLoader(type, id);

  useEffect(() => {
    if (!isLoading && descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { autoAlpha: 0, y: -30 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }
      );
    }
  }, [isLoading]);

  const renderContent = () => {
    if (error) throw error;

    return (
      <>
        {type === 'vanilla' ? (
          <>
            <div className='container' ref={containerRef} />
            {isLoading && <Spinner visible={isLoading} text='Loading 3D...' />}
          </>
        ) : R3FComponent ? (
          <>
            {isLoading && <Spinner visible={isLoading} text='Loading 3D...' />}
            <R3FComponent />
          </>
        ) : (
          <Spinner visible text='Loading component...' />
        )}

        {!isLoading && description && (
          <h1 ref={descriptionRef} className='description'>
            {description.text}
          </h1>
        )}
      </>
    );
  };

  return renderContent();
}
