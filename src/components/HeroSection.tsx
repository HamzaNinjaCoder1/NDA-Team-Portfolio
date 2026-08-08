import React, { useEffect, useState } from 'react';
import { ThreeGlassCanvas } from './ThreeGlassCanvas';
import CurvedLoop from './CurvedLoop';
import { GlassParams } from '../types';

interface HeroSectionProps {
  params: GlassParams;
  customImageSrc: string | null;
  onSceneReady?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  params,
  customImageSrc,
  onSceneReady,
}) => {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return (
    <section className="relative w-full flex flex-col items-center px-6 sm:px-10 lg:px-14 pt-0 pb-2 max-w-7xl mx-auto bg-[#F2F2F2]">
      
      {/* Subtle Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-neutral-300/20 via-stone-200/10 to-neutral-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* MOBILE (below md): award-style centered composition —
          eyebrow, big headline, crystal slab, mirrored words, all perfectly centered */}
      <div className="md:hidden relative z-10 w-full pt-2 flex flex-col items-center select-none">
        <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-neutral-500 mb-4">
          NDA ✦ REFRACTION
        </span>

        <h1
          className="text-[46px] min-[400px]:text-[52px] sm:text-6xl font-black tracking-tighter text-black leading-[0.88] uppercase"
          style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" }}
        >
          IGNITE
        </h1>
        <span
          className="text-3xl min-[400px]:text-4xl sm:text-5xl font-extralight italic text-black/85 tracking-tight leading-none mt-1"
          style={{ fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif" }}
        >
          inspire.
        </span>

        <div className="w-full max-w-[300px] min-[400px]:max-w-[340px] sm:max-w-[420px] h-[280px] min-[400px]:h-[300px] sm:h-[360px] mt-5">
          {!isDesktop && <ThreeGlassCanvas params={params} customImageSrc={customImageSrc} onReady={onSceneReady} />}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 mt-1">
          [ touch &amp; drag ]
        </span>

        <span
          className="text-3xl min-[400px]:text-4xl sm:text-5xl font-extralight italic text-black/85 tracking-tight leading-none mt-5"
          style={{ fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif" }}
        >
          innovate.
        </span>
        <h1
          className="text-[46px] min-[400px]:text-[52px] sm:text-6xl font-black tracking-tighter text-black leading-[0.88] uppercase mt-1"
          style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" }}
        >
          IMPACT.
        </h1>
      </div>

      {/* DESKTOP (md+): editorial three-column composition (left / centre / right) */}
      <div className="hidden md:flex relative z-10 w-full pt-2 pb-0 flex-row items-center justify-between select-none">

        {/* LEFT COLUMN: IGNITE + inspire. */}
        <div className="w-[32%] flex flex-col items-start justify-center text-left space-y-2 z-10 shrink-0">
          <h1
            className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-black leading-[0.88] uppercase whitespace-nowrap"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" }}
          >
            IGNITE
          </h1>
          <span
            className="text-4xl lg:text-5xl xl:text-6xl font-extralight italic text-black/85 tracking-tight leading-none pl-1"
            style={{ fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif" }}
          >
            inspire.
          </span>
        </div>

        {/* CENTER COLUMN: Sleek Tall 3D WebGL Crystal Slab (Slightly moved left, zero text overlap behind) */}
        <div className="w-[36%] flex flex-col items-center justify-center md:-ml-12 relative z-20">
          <div className="w-full h-[400px] max-w-[400px]">
            {isDesktop && <ThreeGlassCanvas params={params} customImageSrc={customImageSrc} onReady={onSceneReady} />}
          </div>
        </div>

        {/* RIGHT COLUMN: innovate. + IMPACT. */}
        <div className="w-[32%] flex flex-col items-end justify-center text-right space-y-2 z-10 shrink-0">
          <span
            className="text-4xl lg:text-5xl xl:text-6xl font-extralight italic text-black/85 tracking-tight leading-none pr-1"
            style={{ fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif" }}
          >
            innovate.
          </span>
          <h1
            className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-black leading-[0.88] uppercase whitespace-nowrap"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" }}
          >
            IMPACT.
          </h1>
        </div>

      </div>

      {/* BOTTOM CURVED LOOP REACT BITS MARQUEE COMPONENT (Prominently visible below 3D model) */}
      <div className="relative z-30 w-full mt-12 sm:mt-16 lg:mt-4 pb-2 pointer-events-auto">
        <CurvedLoop
          marqueeText="CREATIVE ✦ WEBGL 2.0 ✦ REFRACTION STUDIO ✦ IGNITE ✦ INNOVATE ✦ INSPIRE ✦ IMPACT ✦ "
          speed={2}
          curveAmount={80}
          direction="left"
          interactive={true}
        />
      </div>
    </section>
  );
};
