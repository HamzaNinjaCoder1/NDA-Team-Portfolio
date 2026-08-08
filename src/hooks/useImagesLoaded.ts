import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseImagesLoadedOptions {
  capMs?: number;
  pollMs?: number;
  viewportOnly?: boolean;
  containerRef?: RefObject<HTMLElement | null>;
  preloadSources?: string[];
}

export function useImagesLoaded(options: UseImagesLoadedOptions = {}) {
  const { capMs = 4200, pollMs = 150, viewportOnly = false, containerRef, preloadSources } = options;
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const sourcesRef = useRef(preloadSources ?? []);

  useEffect(() => {
    let done = false;
    let stable = 0;
    let preloaded = 0;
    let preloadTotal = 0;

    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('load', onLoad);
      window.clearInterval(poll);
      window.clearTimeout(cap);
      setReady(true);
    };

    const update = () => {
      if (done) return;
      const container = containerRef?.current ?? null;
      let total = preloadTotal;
      let loaded = preloaded;
      for (const img of Array.from(document.images)) {
        if (container && !container.contains(img)) continue;
        const rect = img.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (viewportOnly && (rect.top >= window.innerHeight || rect.bottom <= 0)) continue;
        total++;
        if (img.complete && img.naturalWidth > 0) loaded++;
      }
      if (total === 0) {
        setProgress(1);
        finish();
        return;
      }
      const p = Math.min(1, loaded / total);
      setProgress(p);
      if (p >= 1) {
        stable++;
        if (stable >= 2) finish();
      } else {
        stable = 0;
      }
    };

    for (const url of sourcesRef.current) {
      preloadTotal++;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { preloaded++; update(); };
      img.onerror = () => { preloaded++; update(); };
      img.src = url;
    }

    const poll = window.setInterval(update, pollMs);
    const onLoad = () => finish();
    window.addEventListener('load', onLoad);
    const cap = window.setTimeout(finish, capMs);
    const kick = window.setTimeout(update, 250);

    return () => {
      done = true;
      window.removeEventListener('load', onLoad);
      window.clearInterval(poll);
      window.clearTimeout(cap);
      window.clearTimeout(kick);
    };
  }, [capMs, pollMs, viewportOnly]);

  return { ready, progress };
}
