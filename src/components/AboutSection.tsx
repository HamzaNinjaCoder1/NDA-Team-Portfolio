import React from 'react';
import { IconCloudDemo } from './ui/demo';
import aboutImage from '../assets/images/about_architecture_1785673852783.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F2F2F2] px-6 sm:px-10 lg:px-14 pt-12 pb-16 select-none">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-10">
        
        {/* 1. TOP EDITORIAL MONOSPACED HEADING & VERTICAL TAG - SECTION [01] - UPDATED SPACING */}
        <div className="w-full flex items-start justify-between gap-4 sm:gap-6">
          
          {/* Left Tag: [01] */}
          <div className="font-mono text-base sm:text-lg text-black font-bold select-none shrink-0 pt-1.5">
            [01]
          </div>

          {/* Center Heading: Expanded width, thin monospaced typography with elegant word spacing */}
          <div className="flex-1 max-w-full px-2 sm:px-4">
            <h2 
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal uppercase text-black leading-[1.15] [word-spacing:0.12em] tracking-[0.02em]"
              style={{ fontFamily: "'Space Grotesk', 'IBM Plex Mono', monospace" }}
            >
              FROM STRATEGY TO LAUNCH WE DELIVER FAST, ACCESSIBLE SITES AND CLEAR BRANDS WITH GROWTH-DRIVEN RESULTS
            </h2>
          </div>

          {/* Right Tag: [MORE ABOUT] Vertically oriented Bottom to Top, Bold Black */}
          <div className="shrink-0 pt-2 flex items-center justify-center">
            <span 
              className="font-mono text-xs sm:text-sm uppercase tracking-widest text-black font-bold select-none inline-block whitespace-nowrap"
              style={{ 
                writingMode: 'vertical-rl', 
                transform: 'rotate(180deg)' 
              }}
            >
              [MORE ABOUT]
            </span>
          </div>
        </div>

        {/* 2. THREE-COLUMN EQUAL-SPACE BALANCED GRID (IMAGE | DESCRIPTION | ICON CLOUD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center w-full pt-2">
          
          {/* COLUMN 1: CLEAN ARCHITECTURAL VISUAL ASSET */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200 shadow-sm border border-black/5">
              <img
                src={aboutImage}
                alt="Futuristic Architectural Pavilion Design"
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700 ease-out"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* COLUMN 2: EDITORIAL AGENCY DESCRIPTION */}
          <div className="w-full flex flex-col items-center justify-center px-1 text-center md:text-left">
            <p 
              className="text-sm sm:text-base leading-[1.75] text-neutral-800 font-sans font-normal max-w-md"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
            >
              We're a senior creative digital agency focused on clarity and performance. We align strategy, brand, and web into modular systems that ship on time and scale. Our values are simplicity, accountability and measurable impact. The team is small and senior; every project has a lead for strategy, design and build. We partner long-term, iterating with data to keep products fast.
            </p>
          </div>

          {/* COLUMN 3: TRANSPARENT INTERACTIVE ICON CLOUD (NO WHITE BOX, FLOATING ON #F2F2F2) */}
          <div className="w-full flex flex-col items-center justify-center">
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-black select-none text-center -mt-2.5 mb-2.5">
              OUR STACK
            </span>
            <div className="w-full flex items-center justify-center min-h-[240px] sm:min-h-[265px]">
              <IconCloudDemo />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
