import React from 'react';
import { motion } from 'motion/react';
import { SitePath } from '../site';
import { OptimizedImage } from './OptimizedImage';
import alexPhoto from '../../project images/Alex.jpg';
import alexPhotoWebp from '../../project images/Alex.webp';
import nakashimaPhoto from '../../project images/Nakashima.jpg';
import nakashimaPhotoWebp from '../../project images/Nakashima.webp';
import oleksandrPhoto from '../../project images/Oleksandr.jpg';
import oleksandrPhotoWebp from '../../project images/Oleksandr.webp';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
  imageWebp: string;
  side: 'left' | 'right';
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'daniel-viloria',
    name: 'Oleksandr Balarnovich',
    role: 'Senior Full Stack Software Engineer',
    company: 'NDA Studio',
    quote: '"True engineering is not just building code, but crafting reliable systems that transform complex requirements into seamless digital experiences."',
    image: alexPhoto,
    imageWebp: alexPhotoWebp,
    side: 'left',
  },
  {
    id: 'nakashima-radon',
    name: 'Nakashima Radon',
    role: 'Senior Web, Blockchain & Unity Developer',
    company: 'NDA Studio',
    quote: '"We create immersive interfaces with the precision of architects—ensuring interactive performance and invisible elegance across every platform."',
    image: nakashimaPhoto,
    imageWebp: nakashimaPhotoWebp,
    side: 'right',
  },
  {
    id: 'oleksandr-balanovich',
    name: 'Daniel Andres Viloria',
    role: 'Team Manager',
    company: 'NDA Studio',
    quote: '"A project workflow should feel like a well-orchestrated symphony—clear, deliberate, and deeply aligned from planning to final delivery."',
    image: oleksandrPhoto,
    imageWebp: oleksandrPhotoWebp,
    side: 'left',
  },
];

interface TeamSectionProps {
  onNavigate: (path: SitePath) => void;
}

export function TeamSection({ onNavigate }: TeamSectionProps) {
  return (
    <section className="relative w-full bg-[#F2F2F2] px-6 sm:px-10 lg:px-14 pt-12 pb-16 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 sm:space-y-10">
        
        {/* SECTION HEADER: OUR TEAM [03] - EDITORIAL TIMELINE WITH CINEMATIC MOTION - UPDATED SPACING */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-black/10">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase text-black">
            OUR TEAM
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase text-black">
            [03]
          </span>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative w-full min-h-[800px] flex flex-col justify-between py-10">
          
          {/* CENTRAL VERTICAL TIMELINE LINE (DESKTOP CENTERED, MOBILE LEFT) */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 w-[1px] bg-[#D8D8D8] pointer-events-none">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full bg-black/60 origin-top"
            />
          </div>

          {/* TEAM MEMBERS LIST */}
          <div className="flex flex-col space-y-16 md:space-y-32 relative z-10">
            {TEAM_MEMBERS.map((member, index) => {
              const isLeft = member.side === 'left';

              return (
                <div 
                  key={member.id} 
                  className="relative w-full flex flex-col md:flex-row items-start md:items-center justify-between"
                >
                  
                  {/* CENTRAL TIMELINE NODE DOT */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 top-5 md:top-1/2 md:-translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-[1.5px] border-black/70 shadow-sm z-20 group"
                  >
                    <div className="w-full h-full rounded-full transition-transform duration-300 hover:scale-150 hover:bg-black" />
                  </motion.div>

                  {/* MOBILE: PORTRAIT + IDENTITY (aligned to the left timeline) */}
                  <div className="md:hidden w-full pl-14 pr-1">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative overflow-hidden rounded-[14px] border border-black/10 shadow-sm shrink-0">
                        <OptimizedImage
                          src={member.image}
                          webp={member.imageWebp}
                          alt={member.name}
                          className="h-[76px] w-[76px] object-cover grayscale contrast-110"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sans text-[15px] sm:text-base font-semibold text-[#111111] leading-snug">
                          {member.name}
                        </h4>
                        <p className="mt-1.5 font-mono text-[11px] font-normal text-[#6A6A6A] leading-snug">
                          {member.role}
                        </p>
                        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
                          {member.company}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* MOBILE: QUOTE BELOW IDENTITY */}
                  <div className="md:hidden w-full pl-14 pr-1 mt-5">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.55, delay: index * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="font-sans text-[15px] leading-[1.7] text-[#1A1A1A]">
                        {member.quote}
                      </p>
                      <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                        — VIEW PROFILE
                      </p>
                    </motion.div>
                  </div>

                  {/* DESKTOP: LEFT COLUMN CONTENT (FOR LEFT SIDE: TESTIMONIAL, FOR RIGHT SIDE: PORTRAIT OR SPACER) */}
                  <div className="hidden md:flex w-full md:w-[45%] pl-14 md:pl-0 pr-0 md:pr-12 text-left md:text-right flex-col md:flex-row items-start md:items-center justify-start md:justify-end gap-6">
                    {isLeft ? (
                      /* LEFT SIDE: TESTIMONIAL & DETAILS */
                      <motion.div
                        initial={{ opacity: 0, x: -35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ 
                          duration: 0.7, 
                          delay: index * 0.1 + 0.1, 
                          ease: [0.215, 0.61, 0.355, 1.0] 
                        }}
                        className="flex flex-col items-start md:items-end space-y-3 group cursor-pointer"
                        onClick={() => onNavigate('/team')}
                      >
                        <p className="font-sans text-lg sm:text-xl lg:text-[24px] font-normal leading-[1.65] text-[#1A1A1A] max-w-lg transition-colors duration-300 group-hover:text-black">
                          {member.quote}
                        </p>
                        <div className="flex flex-col items-start md:items-end pt-1">
                          <h4 className="font-sans text-base sm:text-lg font-semibold text-[#111111] transition-colors duration-300 group-hover:text-black">
                            {member.name}
                          </h4>
                          <span className="font-mono text-xs sm:text-sm font-normal text-[#6A6A6A]">
                            {member.role} • {member.company}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* RIGHT SIDE: PORTRAIT CONNECTED TO TIMELINE */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.1 + 0.1, 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="flex items-center justify-end"
                      >
                        <div className="relative group overflow-hidden rounded-[14px] border border-black/10 shadow-sm transition-transform duration-500 ease-out hover:scale-105">
                          <OptimizedImage
                            src={member.image}
                            webp={member.imageWebp}
                            alt={member.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* DESKTOP: RIGHT COLUMN CONTENT (FOR LEFT SIDE: PORTRAIT, FOR RIGHT SIDE: TESTIMONIAL) */}
                  <div className="hidden md:flex w-full md:w-[45%] pl-14 md:pl-12 pr-0 text-left flex-col md:flex-row items-start md:items-center justify-start gap-6">
                    {isLeft ? (
                      /* LEFT SIDE: PORTRAIT CONNECTED TO TIMELINE */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.1 + 0.1, 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="flex items-center justify-start"
                      >
                        <div className="relative group overflow-hidden rounded-[14px] border border-black/10 shadow-sm transition-transform duration-500 ease-out hover:scale-105">
                          <OptimizedImage
                            src={member.image}
                            webp={member.imageWebp}
                            alt={member.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      /* RIGHT SIDE: TESTIMONIAL & DETAILS */
                      <motion.div
                        initial={{ opacity: 0, x: 35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ 
                          duration: 0.7, 
                          delay: index * 0.1 + 0.1, 
                          ease: [0.215, 0.61, 0.355, 1.0] 
                        }}
                        className="flex flex-col items-start space-y-3 group cursor-pointer"
                        onClick={() => onNavigate('/team')}
                      >
                        <p className="font-sans text-lg sm:text-xl lg:text-[24px] font-normal leading-[1.65] text-[#1A1A1A] max-w-lg transition-colors duration-300 group-hover:text-black">
                          {member.quote}
                        </p>
                        <div className="flex flex-col items-start pt-1">
                          <h4 className="font-sans text-base sm:text-lg font-semibold text-[#111111] transition-colors duration-300 group-hover:text-black">
                            {member.name}
                          </h4>
                          <span className="font-mono text-xs sm:text-sm font-normal text-[#6A6A6A]">
                            {member.role} • {member.company}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
