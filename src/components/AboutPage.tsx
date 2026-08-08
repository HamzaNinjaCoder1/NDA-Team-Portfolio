import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import aboutImage from '../assets/images/about_architecture_1785673852783.jpg';

const fade = { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const };
const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => <motion.div className={className} initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '0px 0px -60px 0px', amount: .1 }} transition={{ ...fade, delay }}>{children}</motion.div>;

export function AboutPage() {
  return <>
    <section className="bg-[#F2F2F2] px-6 pb-14 pt-14 sm:px-10 sm:pb-20 sm:pt-20 lg:px-14">
      <div className="mx-auto max-w-7xl border-t border-black/15 pt-5">
        <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[.16em] text-black/50"><span>01</span><span>ABOUT NDA</span></div>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.25fr_.75fr] md:items-end md:gap-16">
          <Reveal><h1 className="max-w-5xl text-[clamp(3.2rem,7vw,7rem)] font-medium leading-[.86] tracking-[-.075em]">A senior team for work that needs to hold up.</h1></Reveal>
          <Reveal delay={.1}><p className="max-w-sm text-base leading-7 text-black/65">NDA brings engineering, immersive technology, and steady delivery management together. We work closely, communicate plainly, and own the details that matter.</p></Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-5 border-t border-black/15 pt-5 sm:grid-cols-4 sm:gap-8">
          {[['03', 'senior team members'], ['10', 'selected projects'], ['04', 'countries & regions served'], ['01', 'direct delivery team']].map(([number, label], i) => <Reveal key={label} delay={i * .05}><p className="text-3xl tracking-[-.05em] sm:text-4xl">{number}</p><p className="mt-2 max-w-[11rem] font-mono text-[10px] uppercase leading-4 tracking-[.1em] text-black/45">{label}</p></Reveal>)}
        </div>
      </div>
    </section>

    <section className="bg-black px-6 py-14 text-white sm:px-10 sm:py-20 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16">
        <Reveal><div className="aspect-[4/3] overflow-hidden"><img src={aboutImage} alt="NDA approach to considered digital work" className="h-full w-full object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0" loading="lazy" decoding="async" /></div></Reveal>
        <Reveal delay={.08}><div className="flex h-full flex-col justify-between"><div><p className="font-mono text-[10px] font-bold tracking-[.16em] text-white/45">WHAT GUIDES US</p><h2 className="mt-6 max-w-2xl text-4xl leading-[.95] tracking-[-.05em] sm:text-6xl">Quietly rigorous. Genuinely collaborative.</h2><p className="mt-7 max-w-xl text-base leading-7 text-white/60">The people shaping the work are the people accountable for delivering it. That keeps conversations direct, decisions visible, and quality close to the surface.</p></div><a href="/team" className="mt-12 inline-flex w-fit items-center gap-3 border-b border-white/40 pb-2 font-mono text-xs font-bold tracking-wide transition-colors hover:border-white">MEET THE TEAM <ArrowUpRight size={15} /></a></div></Reveal>
      </div>
    </section>

    <section className="bg-[#F2F2F2] px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[.7fr_1.3fr] md:gap-16 md:items-start"><Reveal><div className="flex items-center gap-3"><span className="h-px w-8 bg-black/35" /><p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/50">HOW WE WORK</p></div><p className="mt-5 max-w-[13rem] text-sm leading-6 text-black/55">A simple rhythm keeps good work moving.</p></Reveal><Reveal delay={.08}><div className="max-w-4xl"><p className="text-[clamp(2.25rem,4.8vw,4.7rem)] leading-[.94] tracking-[-.065em]">A small team should feel <span className="text-black/45">clear, capable,</span> and close to the work.</p></div></Reveal></div>
        <div className="mt-12 grid border-t border-black/15 sm:mt-16 sm:grid-cols-3">{[['01', 'Set direction', 'Align on context, goals, audience, and the constraints that make the work real.'], ['02', 'Build the route', 'Shape a practical plan and keep priorities visible through focused delivery cycles.'], ['03', 'Stay accountable', 'Test, communicate, release, and remain useful when the product is in the world.']].map(([number, title, body], i) => <Reveal key={title} delay={i * .06} className="group border-b border-black/15 py-6 sm:border-b-0 sm:border-r sm:px-7 sm:py-7 sm:first:pl-0 sm:last:border-r-0"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-black/45">{number}</span><ArrowUpRight size={15} className="text-black/30 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black" /></div><h3 className="mt-10 text-2xl tracking-[-.04em]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-black/60">{body}</p></Reveal>)}</div>
      </div>
    </section>

    <section className="bg-[#F2F2F2] px-6 pb-14 sm:px-10 sm:pb-20 lg:px-14"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-black/15 pt-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/50">WORK WITH NDA</p><h2 className="mt-5 max-w-xl text-4xl leading-[.95] tracking-[-.05em] sm:text-5xl">Bring us the part that needs more experienced hands.</h2></div><a href="mailto:saasbusiness2026@gmail.com" className="group inline-flex w-fit items-center gap-3 bg-black px-5 py-4 font-mono text-xs font-bold tracking-wide text-white transition-transform hover:-translate-y-1">EMAIL NDA <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div></section>
  </>;
}
