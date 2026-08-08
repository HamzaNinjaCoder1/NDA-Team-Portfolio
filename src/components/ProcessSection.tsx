import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent, useSpring, useTransform } from 'motion/react';
import { Laptop3DCanvas } from './Laptop3DCanvas';

const STEPS = [
  { number: '[001]', title: 'DISCOVER', side: 'left', description: 'We go deep, listen, and observe. We uncover what matters most to your audience, your market, and your ambition.' },
  { number: '[002]', title: 'DEFINE', side: 'right', description: 'We turn the research into a precise point of view, a clear direction, and a roadmap made to move your project forward.' },
  { number: '[003]', title: 'DESIGN', side: 'left', description: 'We shape experiences that feel intuitive from the first interaction—built with character, clarity, and a lasting point of view.' },
  { number: '[004]', title: 'BUILD', side: 'right', description: 'We bring every detail to life with considered code, resilient systems, and the care required for a seamless digital experience.' },
  { number: '[005]', title: 'LAUNCH', side: 'left', description: 'We ship a finished digital experience with rigorous testing, refined performance, and every final edge considered.' },
  { number: '[006]', title: 'IMPROVE', side: 'right', description: 'We use real signals, shared learning, and ongoing refinement to make the work more useful, relevant, and effective.' },
] as const;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isLg, setIsLg] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => setIsLg(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextStep = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
    setActiveStep((current) => current === nextStep ? current : nextStep);
  });

  // Keep the laptop gently drifting (very subtle), biased upward so it sits in front of [001].
  const laptopY = useSpring(
    useTransform(scrollYProgress, [0, 1], ['-0.5vh', '0.5vh']),
    { stiffness: 120, damping: 30 }
  );

  return (
    <section ref={sectionRef} aria-label="Our process" className="relative bg-[#171717] px-5 py-16 text-white sm:px-10 lg:min-h-[280vh] lg:px-14 lg:py-20">
      <div className="relative mx-auto max-w-7xl">
{/* Desktop (lg+): sticky laptop pinned to the viewport, centred — layout unchanged. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[325vh] lg:block">
          <motion.div
            style={{ y: laptopY }}
            className="sticky top-[calc(64vh_-_280px)] mx-auto h-[560px] w-[min(40vw,540px)] pointer-events-auto"
          >
            {isLg && <Laptop3DCanvas activeStepIndex={activeStep} />}
          </motion.div>
        </div>

        {/* Smaller screens (iPad, phones): all text on the left, 3D laptop sticky on the right. */}
        <div className="grid grid-cols-[minmax(0,1fr)_40%] gap-4 sm:grid-cols-[minmax(0,1fr)_36%] sm:gap-6 lg:grid-cols-1 lg:gap-0">
          <div className="relative z-20 order-2 lg:hidden">
            <motion.div
              style={{ y: laptopY }}
              className="sticky top-20 h-[46vw] max-h-[360px] pointer-events-auto"
            >
              {!isLg && <Laptop3DCanvas activeStepIndex={activeStep} />}
            </motion.div>
          </div>

          <div className="relative z-10 order-1 space-y-[8vh] sm:space-y-[12vh] lg:space-y-0">
          {STEPS.map((step, index) => {
            const isLeft = step.side === 'left';
            const isActive = activeStep === index;
            return (
                <div key={step.number} className={`flex min-h-[30vh] items-center sm:min-h-[34vh] lg:min-h-[46vh] ${isLeft ? 'justify-start' : 'justify-start lg:justify-end'}`}>
                <motion.article
                  initial={reduceMotion ? false : { opacity: 0, x: isLeft ? -34 : 34, y: 10, filter: 'blur(7px)' }}
                  whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
                  viewport={{ amount: 0.58, once: true }}
                  transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-[min(100%,19rem)] sm:w-[21rem] lg:w-[19rem] xl:w-[21rem] ${isLeft ? 'text-left' : 'text-left lg:text-right'} transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`}
                >
                  <p className="mb-4 font-mono text-[11px] font-medium tracking-[0.16em] text-white">{step.number}</p>
                  <h2 className="font-mono text-[26px] font-medium leading-none tracking-[-0.04em] text-white sm:text-[32px] lg:text-[44px]">{step.title}</h2>
                  <p className="mt-6 font-mono text-[13px] leading-[1.65] tracking-[-0.01em] text-white sm:text-[14px]">{step.description}</p>
                </motion.article>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
