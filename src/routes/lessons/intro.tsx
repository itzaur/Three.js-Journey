import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/lessons/intro')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className='intro'>Select a lesson...</div>;
}
