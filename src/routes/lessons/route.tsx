import { getLessons } from '@/server/getLessons';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/lessons')({
  loader: () => getLessons(),
  component: Lessons,
});

function Lessons() {
  const lessons = Route.useLoaderData();

  console.log('lessons', lessons);

  return (
    <div className='home'>
      <aside className='lessons'>
        <h2>Lessons</h2>

        {lessons.map((lesson) => (
          <div key={lesson.title} className='lesson-block'>
            <h3 className='lesson-block__title'>{lesson.title}</h3>
            <div className='lesson-block__grid'>
              {lesson.variants.map((variant) => (
                <Link
                  key={variant.id}
                  className='lesson-card'
                  to='/lessons/$sketch/$type/$id'
                  params={{
                    sketch: lesson.sketch,
                    type: variant.type,
                    id: variant.id,
                  }}
                >
                  {variant.type.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <main id='root'>
        <Outlet />
      </main>
    </div>
  );
}
