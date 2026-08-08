import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'nda-page-reveal-seen';
const FULL_MOTION_MS = 3000;
const REDUCED_MOTION_MS = 520;
const SCENE_FALLBACK_MS = 2200;
const IMAGES_MAX_WAIT_MS = 4200;
type RevealPhase = 'intro' | 'exit' | 'settle' | 'done';

function hasSeenReveal() {
  try { return window.sessionStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}

function markRevealSeen() {
  try { window.sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* Storage may be unavailable in private browsing. */ }
}

function lockScroll() {
  const html = document.documentElement;
  const body = document.body;
  const previous = {
    htmlOverflow: html.style.overflow, bodyOverflow: body.style.overflow,
    htmlTouchAction: html.style.touchAction, bodyTouchAction: body.style.touchAction,
    htmlOverscroll: html.style.overscrollBehavior, bodyOverscroll: body.style.overscrollBehavior,
  };
  html.style.overflow = 'hidden'; body.style.overflow = 'hidden';
  html.style.touchAction = 'none'; body.style.touchAction = 'none';
  html.style.overscrollBehavior = 'none'; body.style.overscrollBehavior = 'none';
  const preventScroll = (event: Event) => event.preventDefault();
  const preventKeys = (event: KeyboardEvent) => {
    if ([' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
  };
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventKeys, { passive: false });
  return () => {
    html.style.overflow = previous.htmlOverflow; body.style.overflow = previous.bodyOverflow;
    html.style.touchAction = previous.htmlTouchAction; body.style.touchAction = previous.bodyTouchAction;
    html.style.overscrollBehavior = previous.htmlOverscroll; body.style.overscrollBehavior = previous.bodyOverscroll;
    window.removeEventListener('wheel', preventScroll); window.removeEventListener('touchmove', preventScroll); window.removeEventListener('keydown', preventKeys);
  };
}

interface PageRevealProps { appReady: boolean; sceneReady: boolean; }

export function PageReveal({ appReady, sceneReady }: PageRevealProps) {
  const [shouldShow] = useState(() => !hasSeenReveal());
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<RevealPhase>('intro');
  const [sceneFallbackReady, setSceneFallbackReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const reducedMotion = useRef(false);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const unlockScrollRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef(0);
  const timersScheduledRef = useRef(false);

  useEffect(() => {
    if (!shouldShow) return;
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    unlockScrollRef.current = lockScroll();
    return () => { unlockScrollRef.current?.(); unlockScrollRef.current = null; };
  }, [shouldShow]);

  useEffect(() => {
    if (phase === 'settle' || phase === 'done') {
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
    }
  }, [phase]);

  useEffect(() => {
    if (!shouldShow || sceneReady) return;
    const timer = window.setTimeout(() => setSceneFallbackReady(true), SCENE_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [sceneReady, shouldShow]);

  useEffect(() => {
    if (!shouldShow) return;
    let done = false;
    let consecutiveIdle = 0;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('load', onLoad);
      window.clearInterval(poll);
      window.clearTimeout(cap);
      setImagesReady(true);
    };
    const onLoad = () => finish();
    const poll = window.setInterval(() => {
      const viewportH = window.innerHeight;
      let pending = 0;
      for (const img of Array.from(document.images)) {
        const rect = img.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        if (rect.top >= viewportH || rect.bottom <= 0) continue;
        if (!img.complete || img.naturalWidth === 0) pending++;
      }
      if (pending === 0) { consecutiveIdle++; if (consecutiveIdle >= 2) finish(); } else { consecutiveIdle = 0; }
    }, 200);
    const cap = window.setTimeout(finish, IMAGES_MAX_WAIT_MS);
    window.addEventListener('load', onLoad);
    return () => { done = true; window.removeEventListener('load', onLoad); window.clearInterval(poll); window.clearTimeout(cap); };
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow || started) return;
    markRevealSeen();
    startedAtRef.current = performance.now();
    setStarted(true);
  }, [shouldShow, started]);

  useEffect(() => {
    if (!shouldShow || !started || !appReady || !imagesReady || (!sceneReady && !sceneFallbackReady) || timersScheduledRef.current) return;
    timersScheduledRef.current = true;
    const duration = reducedMotion.current ? REDUCED_MOTION_MS : FULL_MOTION_MS;
    const elapsed = performance.now() - startedAtRef.current;
    const exitIn = Math.max(0, duration - 450 - elapsed);
    const exitTimer = window.setTimeout(() => setPhase('exit'), exitIn);
    const settleTimer = window.setTimeout(() => setPhase('settle'), exitIn + 350);
    const doneTimer = window.setTimeout(() => setPhase('done'), exitIn + 650);
    return () => { window.clearTimeout(exitTimer); window.clearTimeout(settleTimer); window.clearTimeout(doneTimer); };
  }, [appReady, sceneReady, sceneFallbackReady, imagesReady, shouldShow, started]);

  useEffect(() => {
    if (!shouldShow) return;
    const watchdog = window.setTimeout(() => {
      markRevealSeen();
      setPhase('done');
    }, SCENE_FALLBACK_MS + FULL_MOTION_MS + 1200);
    return () => window.clearTimeout(watchdog);
  }, [shouldShow]);

  useEffect(() => { if (phase === 'done') previouslyFocused.current?.focus({ preventScroll: true }); }, [phase]);
  if (!shouldShow || phase === 'done') return null;

  return <div className={`page-reveal${started ? ' page-reveal--started' : ''}${phase === 'exit' || phase === 'settle' ? ' page-reveal--exit' : ''}${reducedMotion.current ? ' page-reveal--reduced' : ''}`} role="status" aria-live="polite" aria-label="NDA loading"><div className="page-reveal__stage" aria-hidden="true"><span className="page-reveal__wordmark">NDA</span><span className="page-reveal__caption">Senior By Default</span></div></div>;
}
