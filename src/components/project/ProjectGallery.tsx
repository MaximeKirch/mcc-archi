import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '#/lib/gsap.ts';

interface ProjectGalleryProps {
  images: string[];
  projectTitle: string;
}

export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const items = sectionRef.current?.querySelectorAll('.gallery-item');
    if (!items?.length) return;

    items.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
      });
    });
  }, { scope: sectionRef });

  if (images.length === 0) return null;

  return (
    <section ref={sectionRef} className="mt-16 space-y-8">
      <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
        Documentation Visuelle ({images.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {images.map((imageUrl, index) => {
          const isFullWidth = index === 2;
          return (
            <div
              key={index}
              className={`gallery-item bg-neutral-200 overflow-hidden relative group rounded-sm shadow-sm hover:shadow-md transition-shadow ${
                isFullWidth ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
              }`}
            >
              <img
                src={imageUrl}
                alt={`Détail du projet ${projectTitle} - ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
