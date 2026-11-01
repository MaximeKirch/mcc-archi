import { Fragment, useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '#/lib/gsap.ts';

interface AnimatedTitleProps {
  title: string;
  className?: string;
  delay?: number;
}

export function AnimatedTitle({ title, className = '', delay = 0 }: AnimatedTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = title.split(' ');

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(ref.current!.querySelectorAll('.word-inner'), {
      y: '110%',
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      delay,
    });
  }, { scope: ref });

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom">
            <span className="word-inner inline-block">{word}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </h1>
  );
}
