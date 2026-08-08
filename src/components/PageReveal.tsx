import { useEffect, useRef, useState } from 'react';
import { useImagesLoaded } from '../hooks/useImagesLoaded';
import { HOME_IMAGE_SOURCES } from '../assets/homeImages';

const STORAGE_KEY = 'nda-page-reveal-seen';
const FULL_MOTION_MS = 3000;
const REDUCED_MOTION_MS = 520;
const SCENE_FALLBACK_MS = 2200;
const IMAGES_MAX_WAIT_MS = 4500;
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
  const reducedMotion = useRef(false);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const unlockScrollRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef(0);
  const timersScheduledRef = useRef(false);

  const images = useImagesLoaded({ viewportOnly: true, capMs: IMAGES_MAX_WAIT_MS, preloadSources: HOME_IMAGE_SOURCES });

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
    if (!shouldShow || started) return;
    markRevealSeen();
    startedAtRef.current = performance.now();
    setStarted(true);
  }, [shouldShow, started]);

  useEffect(() => {
    if (!shouldShow || !started || !appReady || !images.ready || (!sceneReady && !sceneFallbackReady) || timersScheduledRef.current) return;
    timersScheduledRef.current = true;
    const duration = reducedMotion.current ? REDUCED_MOTION_MS : FULL_MOTION_MS;
    const elapsed = performance.now() - startedAtRef.current;
    const exitIn = Math.max(0, duration - 450 - elapsed);
    const exitTimer = window.setTimeout(() => setPhase('exit'), exitIn);
    const settleTimer = window.setTimeout(() => setPhase('settle'), exitIn + 350);
    const doneTimer = window.setTimeout(() => setPhase('done'), exitIn + 700);
    return () => { window.clearTimeout(exitTimer); window.clearTimeout(settleTimer); window.clearTimeout(doneTimer); };
  }, [appReady, sceneReady, sceneFallbackReady, images.ready, shouldShow, started]);

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

  const percent = Math.round(images.progress * 100);
  const statusLabel = images.ready ? 'READY' : 'LOADING';

  return <div className={`page-reveal${started ? ' page-reveal--started' : ''}${phase === 'exit' || phase === 'settle' ? ' page-reveal--exit' : ''}${reducedMotion.current ? ' page-reveal--reduced' : ''}`} role="status" aria-live="polite" aria-label="NDA loading">
    <div className="page-reveal__stage" aria-hidden="true"><span className="page-reveal__wordmark">NDA</span><span className="page-reveal__caption">Senior By Default</span></div>
    <div className="page-reveal__status" aria-hidden="true"><span className="page-reveal__status-label">{statusLabel}</span><span className="page-reveal__status-pct">{percent}%</span></div>
    <div className="page-reveal__bar" aria-hidden="true"><span className="page-reveal__bar-fill" style={{ transform: `scaleX(${images.progress})` }} /></div>
  </div>;
}
