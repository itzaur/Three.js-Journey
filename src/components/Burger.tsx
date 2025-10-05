import { BurgerProps } from '@/types/types';

export function Burger({ isMenuOpen, onToggle }: BurgerProps) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <button
      className='burger'
      type='button'
      onClick={handleClick}
      aria-label={isMenuOpen ? 'Open menu' : 'Close menu'}
      aria-expanded={!isMenuOpen}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 256 256'
      >
        <title>nav</title>
        <path d='M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z'></path>
      </svg>
    </button>
  );
}
