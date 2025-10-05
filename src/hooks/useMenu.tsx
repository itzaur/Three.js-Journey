import { useCallback, useEffect, useRef, useState } from 'react';

export default function useMenu(breakpoint = 768) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const asideRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const aside = asideRef.current;
    const burger = burgerRef.current;

    const controler = new AbortController();
    const { signal } = controler;

    const updateAsideVisibility = () => {
      if (aside) {
        aside.setAttribute('data-hidden', isMenuOpen ? 'false' : 'true');
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        aside &&
        !aside.contains(event.target as Node) &&
        (!burger || !burger?.contains(event.target as Node))
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handleMediaQueryChange = (
      e: MediaQueryListEvent | MediaQueryList
    ) => {
      if (e.matches) {
        setIsMenuOpen(false);

        if (aside) aside.setAttribute('data-hidden', 'false');
      } else {
        updateAsideVisibility();
      }
    };

    updateAsideVisibility();
    handleMediaQueryChange(mediaQuery);

    document.addEventListener('mousedown', handleClickOutside, { signal });
    document.addEventListener('keydown', handleKeyDown, { signal });
    mediaQuery.addEventListener('change', handleMediaQueryChange, { signal });

    return () => controler.abort();
  }, [isMenuOpen, closeMenu]);

  return { isMenuOpen, toggleMenu, closeMenu, asideRef, burgerRef };
}
