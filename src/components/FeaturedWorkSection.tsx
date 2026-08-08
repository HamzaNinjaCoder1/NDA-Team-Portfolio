import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SitePath } from '../site';
import { OptimizedImage } from './OptimizedImage';

// Import project images
import musicRacingImage from '../../project images/Music Racing.jpg';
import musicRacingImageWebp from '../../project images/Music Racing.webp';
import rajampoImage from '../../project images/rajampo.jpg';
import rajampoImageWebp from '../../project images/rajampo.webp';
import evermergeImage from '../../project images/EverMerge.jpg';
import evermergeImageWebp from '../../project images/EverMerge.webp';
import doctoreImage from '../../project images/Lotus car.jpg';
import doctoreImageWebp from '../../project images/Lotus car.webp';

interface ProjectCardData {
  id: string;
  title: string;
  image: string;
  webp: string;
  tags: string[];
  imageHeightClass: string;
}

const CENTER_COLUMN_PROJECTS: ProjectCardData[] = [
  {
    id: 'music-racing',
    title: 'MUSIC RACING GT',
    image: musicRacingImage,
    webp: musicRacingImageWebp,
    tags: ['RACING GAME', 'UNITY', 'C#'],
    imageHeightClass: 'h-[170px] sm:h-[200px] lg:h-[230px]',
  },
  {
    id: 'rajampo',
    title: 'RAJAMPO',
    image: rajampoImage,
    webp: rajampoImageWebp,
    tags: ['DIGITAL PRODUCT', 'REACT', 'NODE.JS'],
    imageHeightClass: 'h-[200px] sm:h-[250px] lg:h-[280px]',
  },
];

const RIGHT_COLUMN_PROJECTS: ProjectCardData[] = [
  {
    id: 'evermerge',
    title: 'EVERMERGE',
    image: evermergeImage,
    webp: evermergeImageWebp,
    tags: ['MOBILE GAME', 'UNITY', 'C#'],
    imageHeightClass: 'h-[200px] sm:h-[250px] lg:h-[280px]',
  },
  {
    id: 'doctore',
    title: 'DOCTORE',
    image: doctoreImage,
    webp: doctoreImageWebp,
    tags: ['HEALTH PLATFORM', 'REACT', 'CLOUD'],
    imageHeightClass: 'h-[170px] sm:h-[200px] lg:h-[230px]',
  },
];

const STATS = [
  { value: '+34%', label: 'CONVERSIONS', detail: 'Up 3.4x after redesign across the first 100 days.' },
  { value: '+41%', label: 'RETENTION RATE', detail: 'Increased user engagement during key onboarding flow.' },
  { value: '3.8×', label: 'ROAS GROWTH', detail: 'Return on ad spend for launched campaign.' },
];

interface FeaturedWorkSectionProps {
  onNavigate: (path: SitePath) => void;
}

const ProjectCard: React.FC<{ project: ProjectCardData; onNavigate: (path: SitePath) => void }> = ({
  project,
  onNavigate,
}) => (
  <div
    onClick={() => onNavigate('/projects')}
    className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-black/8 shadow-sm hover:shadow-lg transition-all duration-400 cursor-pointer"
  >
    {/* Image Wrapper */}
    <div className={`w-full ${project.imageHeightClass} relative overflow-hidden bg-neutral-200`}>
      <OptimizedImage
        src={project.image}
        webp={project.webp}
        alt={project.title}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black shadow-md scale-90 group-hover:scale-100 transition-transform duration-300">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </div>

    {/* Card Info Box */}
    <div className="p-3.5 sm:p-4 flex flex-col space-y-2 bg-white">
      <h3 className="font-mono text-sm sm:text-base font-bold tracking-wider uppercase text-black group-hover:text-neutral-700 transition-colors">
        {project.title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag, tIdx) => (
          <span
            key={tIdx}
            className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider px-2 py-0.5 bg-neutral-100 border border-black/5 rounded text-neutral-600 uppercase"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full bg-[#F2F2F2] text-black px-6 sm:px-10 lg:px-14 pt-12 pb-16 select-none overflow-hidden">
      <div className="max-w-[1320px] mx-auto flex flex-col space-y-6 sm:space-y-8">

        {/* 1. EDITORIAL TOP HEADER ROW - SECTION [05] */}
        <div className="w-full flex items-center justify-between pb-3.5 border-b border-black/15 relative">
          {/* Top Left Number Label */}
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-black">
              [05]
            </span>
          </div>

          {/* Top Center Title */}
          <h2 className="font-sans text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-black text-center">
            FEATURED WORKS
          </h2>

          {/* Top Right Monospace Badge */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold tracking-widest uppercase text-neutral-500">
              [ SELECTED PROJECTS ]
            </span>
          </div>
        </div>

        {/* 2. MOBILE-ONLY INTRO (hidden on lg+) */}
        <p className="lg:hidden font-sans text-neutral-600 text-xs sm:text-sm leading-relaxed tracking-normal max-w-lg">
          Every project represents a custom solution tailored to the user, the business, and the impact — each case shows problem → approach → result.
        </p>

        {/* 3. RESPONSIVE EDITORIAL GRID LAYOUT —
            Mobile / tablet: cards first (center → right), compact stats strip last.
            Desktop (lg+): stats left, cards center, big 12 + cards right — original design. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-stretch">

          {/* ================= COLUMN A (CENTER CARDS) — first on mobile ================= */}
          <div className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-8 lg:order-2 lg:pb-3">
            {CENTER_COLUMN_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onNavigate={onNavigate} />
            ))}
          </div>

          {/* ================= COLUMN B (BIG 12 + RIGHT CARDS) — second on mobile ================= */}
          <div className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-8 lg:order-3 lg:pb-3">
            {/* Top Right Counter Number (desktop only) */}
            <div className="hidden lg:flex w-full justify-end pb-1">
              <span className="font-sans text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-black leading-none">
                12
              </span>
            </div>

            {RIGHT_COLUMN_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onNavigate={onNavigate} />
            ))}
          </div>

          {/* ================= COLUMN C (STATS) — last on mobile as strip, editorial left column on lg+ ================= */}
          <div className="lg:col-span-4 lg:order-1">
            {/* Desktop editorial stats column (original, unchanged) */}
            <div className="hidden lg:flex flex-col justify-between h-full space-y-8 pr-0 lg:pr-2 lg:pb-3">
              {/* Introductory Text Paragraph */}
              <p className="font-sans text-neutral-600 text-xs sm:text-sm leading-relaxed tracking-normal max-w-xs">
                Every project represents a custom solution tailored to the user, the business, and the impact — each case shows problem → approach → result. Every case has key performance metrics and KPI movement.
              </p>

              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col space-y-1.5 ${idx === 0 ? 'pt-4' : 'pt-5'} border-t border-black/10`}
                >
                  <span className="font-sans text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-black leading-none">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-black pt-1">
                    {stat.label}
                  </span>
                  <p className="font-sans text-neutral-500 text-xs leading-relaxed max-w-[260px]">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile / tablet compact stat strip (numbers + labels only) */}
            <div className="lg:hidden flex flex-col space-y-3">
              <div className="w-full flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
                  KEY METRICS
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                  100 DAYS
                </span>
              </div>
              <div className="w-full bg-white rounded-xl border border-black/8 shadow-sm overflow-hidden">
                <div className="grid grid-cols-3 divide-x divide-black/10">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center justify-center py-5 px-1">
                      <span className="font-sans text-3xl sm:text-4xl font-medium tracking-tight text-black leading-none">
                        {stat.value}
                      </span>
                      <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.14em] uppercase text-neutral-500 mt-2 text-center">
                        {stat.label === 'RETENTION RATE' ? 'RETENTION' : stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
