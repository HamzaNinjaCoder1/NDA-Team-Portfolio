import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { OptimizedImage } from './OptimizedImage';

// Import high quality generated assets
import webDesignImg from '../assets/images/service_web_design_1785678016624.jpg';
import webDesignImgWebp from '../assets/images/service_web_design_1785678016624.webp';
import webDevImg from '../assets/images/service_web_dev_1785678035261.jpg';
import webDevImgWebp from '../assets/images/service_web_dev_1785678035261.webp';
import brandStrategyImg from '../assets/images/service_brand_strategy_1785678050686.jpg';
import brandStrategyImgWebp from '../assets/images/service_brand_strategy_1785678050686.webp';
import visualIdentityImg from '../assets/images/service_visual_identity_1785678066566.jpg';
import visualIdentityImgWebp from '../assets/images/service_visual_identity_1785678066566.webp';
import motion3dImg from '../assets/images/service_motion_3d_1785678083789.jpg';
import motion3dImgWebp from '../assets/images/service_motion_3d_1785678083789.webp';
import contentArtImg from '../assets/images/service_content_art_1785678105992.jpg';
import contentArtImgWebp from '../assets/images/service_content_art_1785678105992.webp';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  webp: string;
  // Staggered layout parameters for desktop
  widthClass: string;
  alignClass: string;
  descPosition: 'left' | 'right';
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-design',
    number: '01',
    title: 'WEB DESIGN',
    description: 'UX/UI, DESIGN SYSTEMS, PROTOTYPES',
    image: webDesignImg,
    webp: webDesignImgWebp,
    widthClass: 'w-full md:w-[90%]',
    alignClass: 'mr-auto ml-0',
    descPosition: 'right',
  },
  {
    id: 'web-dev',
    number: '02',
    title: 'WEB DEVELOPMENT',
    description: 'FRAMER/NEXT.JS, CMS, ANALYTICS',
    image: webDevImg,
    webp: webDevImgWebp,
    widthClass: 'w-full md:w-[98%]',
    alignClass: 'ml-auto mr-0',
    descPosition: 'left',
  },
  {
    id: 'brand-strategy',
    number: '03',
    title: 'BRAND STRATEGY',
    description: 'CREATE HISTORY AND VALUES',
    image: brandStrategyImg,
    webp: brandStrategyImgWebp,
    widthClass: 'w-full md:w-[93%]',
    alignClass: 'mr-auto ml-0',
    descPosition: 'right',
  },
  {
    id: 'visual-identity',
    number: '04',
    title: 'VISUAL IDENTITY',
    description: 'LOGO, VISUAL SYSTEM, GUIDELINES',
    image: visualIdentityImg,
    webp: visualIdentityImgWebp,
    widthClass: 'w-full md:w-[99%]',
    alignClass: 'ml-auto mr-0',
    descPosition: 'left',
  },
  {
    id: 'motion-3d',
    number: '05',
    title: 'MOTION & 3D',
    description: 'ANIMATION, MICRO-INTERACTIONS, LAUNCH VISUALS',
    image: motion3dImg,
    webp: motion3dImgWebp,
    widthClass: 'w-full md:w-[95%]',
    alignClass: 'mr-auto ml-0',
    descPosition: 'right',
  },
  {
    id: 'content-art',
    number: '06',
    title: 'CONTENT & ART',
    description: 'COPY, PHOTO, VIDEO',
    image: contentArtImg,
    webp: contentArtImgWebp,
    widthClass: 'w-full md:w-[92%]',
    alignClass: 'ml-auto mr-0',
    descPosition: 'left',
  },
];

export const ServicesSection: React.FC = () => {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  // Mouse Motion Values relative to Viewport (e.clientX, e.clientY)
  const rawMouseX = useMotionValue(-500);
  const rawMouseY = useMotionValue(-500);

  // High performance spring inertia follow for floating preview
  const springX = useSpring(rawMouseX, { stiffness: 220, damping: 24, mass: 0.5 });
  const springY = useSpring(rawMouseY, { stiffness: 220, damping: 24, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    rawMouseX.set(e.clientX);
    rawMouseY.set(e.clientY);
  };

  const handleCardMouseEnter = (id: string, e: React.MouseEvent) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setActiveHoverId(id);
    handleMouseMove(e);
  };

  const handleCardMouseLeave = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setActiveHoverId(null);
  };

  const activeService = SERVICES_DATA.find((s) => s.id === activeHoverId);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#F2F2F2] px-6 sm:px-10 lg:px-14 pt-12 pb-16 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-6 sm:space-y-8">
        
        {/* SECTION HEADER: SERVICES [02] - INTERACTIVE CINEMATIC SECTION - UPDATED SPACING */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-black/10">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase text-black">
            SERVICES
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-black">
            [02]
          </span>
        </div>

        {/* WHITE CONTAINER BOX WRAPPER FOR ALL SERVICES */}
        <div className="w-full bg-white rounded-[28px] p-3 sm:p-5 lg:p-6 border border-black/5 shadow-sm flex flex-col space-y-2 sm:space-y-2.5 relative">
          {SERVICES_DATA.map((service, index) => {
            const isHovered = activeHoverId === service.id;
            const isDimmed = activeHoverId !== null && !isHovered;
            const isMobileExpanded = mobileExpandedId === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05, 
                  ease: [0.215, 0.61, 0.355, 1.0] 
                }}
                className={`w-full ${service.alignClass}`}
              >
                <div
                  className={`${service.widthClass} group relative cursor-pointer rounded-[18px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] border ${
                    isHovered || isMobileExpanded
                      ? 'bg-[#111111] text-white border-black shadow-2xl shadow-black/30 scale-[1.01] z-20'
                      : isDimmed
                      ? 'bg-[#F2F2F2]/60 text-black/30 border-black/5 opacity-40 scale-[0.99] z-0'
                      : 'bg-[#F2F2F2] text-black border-black/5 hover:bg-[#111111] hover:text-white hover:border-black z-10'
                  }`}
                  onMouseEnter={(e) => handleCardMouseEnter(service.id, e)}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => {
                    setMobileExpandedId(isMobileExpanded ? null : service.id);
                  }}
                >
                  {/* CARD INNER PADDING & COMPACT EDITORIAL HEIGHT */}
                  <div className="px-5 sm:px-8 lg:px-10 py-4 sm:py-4.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 min-h-[80px] sm:min-h-[96px] overflow-hidden">
                    
                    {/* MOBILE-ONLY (below md): title + expand icon on one row, description below */}
                    <div className="w-full md:hidden flex flex-col items-start gap-1.5 min-w-0">
                      <div className="flex w-full items-center justify-between gap-3 min-w-0">
                        <h3 
                          className={`font-mono text-base sm:text-lg font-bold uppercase tracking-[0.04em] transition-colors duration-300 leading-none truncate ${
                            isHovered || isMobileExpanded ? 'text-white' : 'text-black group-hover:text-white'
                          }`}
                          style={{ fontFamily: "'Space Grotesk', 'IBM Plex Mono', monospace" }}
                        >
                          {service.title}
                        </h3>
                        <span 
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            isHovered || isMobileExpanded
                              ? 'border-white/40 text-white'
                              : 'border-black/20 text-black group-hover:border-white/40 group-hover:text-white'
                          }`}
                        >
                          <Plus
                            size={15}
                            strokeWidth={2.25}
                            className={`transition-transform duration-300 ${isMobileExpanded ? 'rotate-45' : ''}`}
                          />
                        </span>
                      </div>
                      <span 
                        className={`font-mono text-[10px] font-normal tracking-wider uppercase leading-snug transition-colors duration-300 ${
                          isHovered || isMobileExpanded ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-300'
                        }`}
                      >
                        {service.description}
                      </span>
                    </div>

                    {/* DESKTOP+ (md+): editorial row */}
                    <div className="hidden md:flex md:w-full md:flex-1 items-center justify-between gap-6 min-w-0">
                      {service.descPosition === 'left' ? (
                        <>
                          <div className="flex flex-1 items-center text-left min-w-0 pr-4">
                            <span 
                              className={`font-mono text-sm sm:text-base tracking-wider uppercase transition-colors duration-300 font-normal truncate ${
                                isHovered ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-300'
                              }`}
                            >
                              {service.description}
                            </span>
                          </div>
                          <h3 
                            className={`font-mono text-4xl lg:text-[44px] font-bold uppercase tracking-[0.08em] transition-colors duration-300 leading-none whitespace-nowrap text-right ${
                              isHovered ? 'text-white' : 'text-black group-hover:text-white'
                            }`}
                            style={{ fontFamily: "'Space Grotesk', 'IBM Plex Mono', monospace" }}
                          >
                            {service.title}
                          </h3>
                        </>
                      ) : (
                        <>
                          <h3 
                            className={`font-mono text-4xl lg:text-[44px] font-bold uppercase tracking-[0.08em] transition-colors duration-300 leading-none whitespace-nowrap text-left ${
                              isHovered ? 'text-white' : 'text-black group-hover:text-white'
                            }`}
                            style={{ fontFamily: "'Space Grotesk', 'IBM Plex Mono', monospace" }}
                          >
                            {service.title}
                          </h3>
                          <div className="flex flex-1 items-center justify-end text-right min-w-0 pl-4">
                            <span 
                              className={`font-mono text-sm sm:text-base tracking-wider uppercase transition-colors duration-300 font-normal truncate ${
                                isHovered ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-300'
                              }`}
                            >
                              {service.description}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                  </div>

                  {/* MOBILE TAP ACCORDION EMBEDDED PREVIEW IMAGE */}
                  <AnimatePresence>
                    {isMobileExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="md:hidden px-6 pb-6 pt-2 overflow-hidden border-t border-white/10"
                      >
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                          <OptimizedImage 
                            src={service.image} 
                            webp={service.webp} 
                            alt={service.title} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <p className="mt-3 font-mono text-xs text-neutral-400 font-medium tracking-wider uppercase">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FLOATING CURSOR-FOLLOWING CINEMATIC PREVIEW CARD (ACCURATE VIEWPORT FIXED) */}
        <AnimatePresence>
          {activeHoverId && activeService && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              exit={{ opacity: 0, scale: 0.82, rotate: -2 }}
              transition={{ 
                opacity: { duration: 0.2 },
                scale: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: 0.35, ease: 'easeOut' }
              }}
              style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              className="hidden md:block fixed pointer-events-none z-50 top-0 left-0 w-60 h-80 sm:w-64 sm:h-84 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl shadow-black/60 bg-black/50 backdrop-blur-md"
            >
              <OptimizedImage 
                src={activeService.image} 
                webp={activeService.webp} 
                alt={activeService.title} 
                className="w-full h-full object-cover grayscale-[10%] contrast-[1.05]" 
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-white/90 drop-shadow">
                <span>{activeService.number} — {activeService.title}</span>
                <span>AWWWARDS</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
