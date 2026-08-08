import React from 'react';
import { StaggerTestimonials } from './ui/stagger-testimonials';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F2F2F2] text-black px-6 sm:px-10 lg:px-14 pt-5 sm:pt-10 pb-14 select-none overflow-hidden">
      <div className="max-w-[1320px] mx-auto flex flex-col space-y-5 sm:space-y-6">

        {/* 1. EDITORIAL TOP HEADER ROW - SECTION [06] - CLIENT TESTIMONIALS */}
        <div className="w-full flex items-center justify-between pb-3.5 border-b border-black/15 relative">
          {/* Top Left Number Label */}
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-black">
              [06]
            </span>
          </div>

          {/* Top Center Title */}
          <h2 className="font-sans text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-black text-center">
            TESTIMONIALS
          </h2>

          {/* Top Right Monospace Badge */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold tracking-widest uppercase text-neutral-500">
              [ CLIENT WORDS ]
            </span>
          </div>
        </div>

        {/* 2. EDITORIAL INTRO ROW */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <p className="font-sans text-neutral-600 text-xs sm:text-sm leading-relaxed tracking-normal max-w-md">
            Don't take our word for it — here's what founders, operators, and creative leaders say after partnering with our studio. Click any card to bring it to the front.
          </p>
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start sm:items-center sm:space-x-3 gap-3 border-t border-black/10 pt-4 sm:border-t-0 sm:pt-0 shrink-0">
            <span className="font-sans text-4xl sm:text-5xl font-light tracking-tight text-black leading-none">
              5.0
            </span>
            <div className="flex flex-col items-end sm:items-start space-y-0.5">
              <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-black whitespace-nowrap">
                AVERAGE RATING
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-neutral-500 whitespace-nowrap">
                20+ HAPPY CLIENTS
              </span>
            </div>
          </div>
        </div>

        {/* 3. STAGGERED TESTIMONIAL CAROUSEL - FULL BLEED TO VIEWPORT EDGES (NO LEFT/RIGHT MARGINS OR PADDING) */}
        <div className="-mx-6 sm:-mx-10 lg:-mx-14">
          <StaggerTestimonials />
        </div>

      </div>
    </section>
  );
};
