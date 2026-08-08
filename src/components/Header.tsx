import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';
import { NAV_ITEMS, SitePath } from '../site';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: SitePath) => void;
  onToggleControls: () => void;
}

const panelTransition: Transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 14, transition: { duration: 0.18, ease: 'easeOut' } },
};

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onToggleControls }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Measure the real header height so the menu always sits flush below it,
  // no matter the breakpoint or font scale.
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close the menu with the Escape key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (path: SitePath) => {
    onNavigate(path);
    setMenuOpen(false);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-black/15 bg-[#F2F2F2]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-10 lg:px-14">
        <button
          onClick={() => go('/')}
          className="group cursor-pointer font-serif text-3xl font-extrabold leading-none tracking-tighter transition-transform duration-300 hover:-rotate-3 hover:scale-105"
          aria-label="NDA home"
        >
          NDA
          <span className="inline-block text-black/40 transition-colors duration-300 group-hover:text-black">.</span>
        </button>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.slice(0, 4).map(([label, path]) => {
            const active = currentPath === path;
            return (
              <button
                key={path}
                onClick={() => go(path)}
                aria-current={active ? 'page' : undefined}
                className={`group relative cursor-pointer font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                  active ? 'text-black' : 'text-black/50 hover:text-black'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-black transition-transform duration-300 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <motion.button
          onClick={() => setMenuOpen(v => !v)}
          whileTap={{ scale: 0.88 }}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className={`group flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border shadow-sm transition-colors duration-300 ${
            menuOpen
              ? 'border-black bg-black text-white'
              : 'border-black/15 bg-white text-black hover:border-black hover:bg-black hover:text-white'
          }`}
        >
          <span className="relative block h-5 w-5">
            <Menu
              size={20}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ${
                menuOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              size={20}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
              }`}
            />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -14, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, y: -12, clipPath: 'inset(0 0 100% 0)' }}
            transition={panelTransition}
            className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-[#F2F2F2] lg:overflow-hidden"
            style={{ top: headerHeight }}
          >
            <motion.nav
              aria-label="Mobile navigation"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mx-auto flex max-w-7xl flex-col pt-3 sm:pt-5 lg:pt-2"
            >
              {NAV_ITEMS.map(([label, path], i) => {
                const active = currentPath === path;
                return (
                  <motion.button
                    key={path}
                    variants={itemVariants}
                    onClick={() => go(path)}
                    aria-current={active ? 'page' : undefined}
                    className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden border-b border-black/10 px-5 py-6 text-left transition-colors duration-300 hover:bg-black hover:text-white sm:px-10 sm:py-7 lg:py-2.5"
                  >
                    <span className="relative z-10 flex items-baseline gap-5">
                      <span
                        className={`font-mono text-xs transition-colors duration-300 ${
                          active ? 'text-black group-hover:text-white/70' : 'text-black/40 group-hover:text-white/70'
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span className="text-3xl font-medium tracking-tight text-black transition-transform duration-300 group-hover:translate-x-2 group-hover:text-white sm:text-5xl lg:text-2xl">
                        {label}
                      </span>
                    </span>

                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center">
                      {active ? (
                        <span className="h-2 w-2 rounded-full bg-black transition-colors duration-300 group-hover:bg-white" />
                      ) : (
                        <ArrowUpRight
                          size={22}
                          strokeWidth={1.5}
                          className="-rotate-45 text-black/25 transition-all duration-300 group-hover:rotate-0 group-hover:text-white"
                        />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
