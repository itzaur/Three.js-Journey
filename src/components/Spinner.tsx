import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export const Spinner = ({
  visible,
  text = '',
}: {
  visible: boolean;
  text?: string;
}) => {
  const wrapperRef = useRef(null);
  const circleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapperRef.current || !circleRef.current) return;

      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 1.4,
        transformOrigin: '50% 50%',
        repeat: -1,
        ease: 'linear',
      });

      gsap.to(wrapperRef.current, {
        autoAlpha: visible ? 1 : 0,
        duration: 0.5,
        pointerEvents: visible ? 'auto' : 'none',
        ease: visible ? 'power2.out' : 'power2.in',
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [visible]);

  return (
    <div className='spinner' ref={wrapperRef}>
      <div className='spinner__box'>
        <svg width='64' height='64' viewBox='0 0 100 100'>
          <circle
            ref={circleRef}
            cx='50'
            cy='50'
            r='40'
            strokeWidth='6'
            fill='none'
            strokeLinecap='round'
            strokeDasharray='80 120'
          />
        </svg>
        {text && <div className='spinner__text'>{text}</div>}
      </div>
    </div>
  );
};
