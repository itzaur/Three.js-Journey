import { Link } from '@tanstack/react-router';
import { SketchType } from '@/types/types';
import fallback from '/fallback.jpg';

function Card({
  sketch,
  preview,
  variant,
}: {
  sketch: string;
  preview?: string | null;
  variant: { type: SketchType; id: string };
}) {
  return (
    <Link
      key={variant.id}
      className='lesson-card card'
      to='/lessons/$sketch/$type/$id'
      params={{
        sketch,
        type: variant.type,
        id: variant.id,
      }}
    >
      <div className='card__cover'>
        <img
          className='cover-preview'
          src={preview ? preview : fallback}
          alt={sketch}
        />
      </div>
      <div className='card__info'>
        <span className='card__info-dot'></span>
        <span className='card__info-text'>{variant.type}</span>
        <span className='card__info-dot'></span>
      </div>
      <div className='card__bg' />
    </Link>
  );
}

export default Card;
