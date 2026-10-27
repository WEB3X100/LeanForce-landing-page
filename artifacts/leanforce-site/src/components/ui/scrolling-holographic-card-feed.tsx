import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

type FeedCard = { id: string; label: string };

type ScrollingRowProps = {
  cards: FeedCard[];
  duration?: string;
  direction?: 'left' | 'right';
};

export function HoloCard({ label }: { label: string }) {
  return (
    <article className="holo-card">
      <p>{label}</p>
    </article>
  );
}

export function ScrollingRow({ cards, duration = '42s', direction = 'left' }: ScrollingRowProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [loop, setLoop] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const firstSet = setRef.current;
    if (!frame || !firstSet) return;

    const measure = () => {
      const distance = firstSet.offsetWidth;
      const view = frame.clientWidth;
      if (distance <= 0 || view <= 0) return;
      const needed = Math.max(2, Math.ceil((view + distance) / distance));
      setLoop(distance);
      setCopies((current) => (current === needed ? current : needed));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(firstSet);
    return () => observer.disconnect();
  }, [cards]);

  const style = {
    ['--scroll-duration' as string]: duration,
    ['--loop' as string]: `${loop}px`,
    animationName: direction === 'left' ? 'scroll-left' : 'scroll-right',
    animationPlayState: loop > 0 ? 'running' : 'paused',
  } as CSSProperties;

  return (
    <div className="grid-container" ref={frameRef}>
      <div className="scrolling-grid" style={style}>
        {Array.from({ length: copies }, (_, copy) => (
          <div className="holo-set" key={copy} ref={copy === 0 ? setRef : undefined} aria-hidden={copy > 0 ? true : undefined}>
            {cards.map((card) => (
              <HoloCard key={`${card.id}-${copy}`} label={card.label} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type HoloFeedProps = {
  rows: ScrollingRowProps[];
};

export function HoloFeed({ rows }: HoloFeedProps) {
  return (
    <div className="holo-feed">
      {rows.map((row, index) => (
        <ScrollingRow
          key={row.cards.map((card) => card.id).join('-')}
          cards={row.cards}
          duration={row.duration}
          direction={row.direction ?? (index % 2 === 0 ? 'left' : 'right')}
        />
      ))}
    </div>
  );
}
