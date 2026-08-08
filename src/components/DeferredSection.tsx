import { ReactNode, useEffect, useRef, useState } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  /** Reserves document flow until the section's code is requested. */
  minHeight: string;
}

export function DeferredSection({ children, minHeight }: DeferredSectionProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '1400px 0px' });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} style={shouldLoad ? undefined : { minHeight }}>
      {shouldLoad ? children : null}
    </div>
  );
}
