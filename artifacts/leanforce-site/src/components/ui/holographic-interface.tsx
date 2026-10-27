import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BentoItemProps = {
  className?: string;
  children: ReactNode;
};

export function BentoItem({ className, children }: BentoItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = () => {
      item.style.removeProperty('--mouse-x');
      item.style.removeProperty('--mouse-y');
    };

    item.addEventListener('mousemove', handleMouseMove);
    item.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      item.removeEventListener('mousemove', handleMouseMove);
      item.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={itemRef} className={cn('bento-item', className)}>
      {children}
    </div>
  );
}

export default BentoItem;
