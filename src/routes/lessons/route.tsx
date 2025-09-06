import { getLessons } from '@/server/lessons';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/lessons')({
  loader: () => getLessons(),
  component: Lessons,
});

function Lessons() {
  const lessons = Route.useLoaderData();

  return (
    <div className='home'>
      <aside className='lessons'>
        <h2>Lessons</h2>
        <ul className='lessons__list'>
          {lessons.map((lesson) =>
            lesson.variants.map((variant) => (
              <li
                className='lessons__item'
                key={`${lesson.id}-${variant.type}`}
              >
                <Link
                  className='lessons__link'
                  to='/lessons/lesson/$type/$id'
                  params={{ type: variant.type, id: lesson.id }}
                >
                  {lesson.title} ({variant.type})
                </Link>
              </li>
            ))
          )}
        </ul>
      </aside>

      <main id='root'>
        <Outlet />
      </main>
    </div>
  );
}
