import { useEffect } from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { getLessons } from '@/server/getLessons';
import Card from '@/components/Card';
import { Burger } from '@/components/Burger';
import useMenu from '@/hooks/useMenu';

export const Route = createFileRoute('/lessons')({
  loader: () => getLessons(),
  component: Lessons,
});

function Lessons() {
  const lessons = Route.useLoaderData();
  const { isMenuOpen, toggleMenu, asideRef } = useMenu();
  // console.log('lessons', lessons);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLDivElement>('.card');

    const handlePointerMove = (e: PointerEvent) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document
      .querySelector<HTMLDivElement>('[data-grid]')
      ?.addEventListener('pointermove', handlePointerMove);

    return () => {
      document
        .querySelector<HTMLDivElement>('[data-grid]')
        ?.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className='home'>
      <aside ref={asideRef} className='lessons' data-grid data-hidden='true'>
        <h2 className='lessons__title'>Lessons</h2>

        {lessons.map((lesson) => (
          <div key={lesson.title} className='lesson-block'>
            <h3 className='lesson-block__title'>{lesson.title}</h3>
            <div className='lesson-block__grid'>
              {lesson.variants.map((variant) => (
                <Card
                  key={variant.id}
                  variant={variant}
                  sketch={lesson.sketch}
                />
              ))}
            </div>
          </div>
        ))}
      </aside>

      <main id='root'>
        <Burger isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
        <Outlet />
      </main>
    </div>
  );
}
