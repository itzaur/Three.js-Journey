import { createFileRoute } from '@tanstack/react-router';
import { useSketchLoader } from '@/hooks/useSketchLoader';

export const Route = createFileRoute('/lessons/$sketch/$type/$id')({
  loader: async ({ params }) => ({
    ...params,
    type: params.type as 'r3f' | 'vanilla',
  }),
  component: LessonDetail,
});

function LessonDetail() {
  const { type, id } = Route.useLoaderData();

  const { containerRef, R3FComponent, isLoading, error } = useSketchLoader(
    type,
    id
  );

  const renderContent = () => {
    if (error) throw error;

    if (type === 'vanilla') {
      return (
        <div className='container'>
          <div className='container__box' ref={containerRef} />

          {isLoading && (
            <div className='container__preloader'>
              Loading vanilla sketch...
            </div>
          )}
        </div>
      );
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return R3FComponent ? (
      <R3FComponent />
    ) : (
      <div>Loading r3f component...</div>
    );
  };

  return renderContent();
}
