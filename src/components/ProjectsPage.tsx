import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import evermergeImage from '../../project images/EverMerge.jpg';
import musicRacingImage from '../../project images/Music Racing.png';
import dragaliaImage from '../../project images/Dragalia Lost.png';
import rollbitImage from '../../project images/rollbit.png';
import rajampoImage from '../../project images/rajampo.png';
import sodashiImage from '../../project images/SODASHI.png';
import dividendImage from '../../project images/DIVIDEND.png';
import needsBankImage from '../../project images/NeedsBank.png';
import doctoreImage from '../../project images/Lotus car.png';
import chatImage from '../../project images/chatswap.png';

const projects = [
  { title: 'EverMerge', category: 'Mobile game', stack: 'Unity · C#', image: evermergeImage, description: 'A polished puzzle-world experience made for long sessions and playful discovery.' },
  { title: 'Music Racing GT', category: 'Racing game', stack: 'Unity · C#', image: musicRacingImage, description: 'Rhythm-led racing with a high-energy visual identity and responsive play.' },
  { title: 'Dragalia Lost', category: 'Mobile game', stack: 'Unity · C#', image: dragaliaImage, description: 'Character-driven action for a vibrant, expansive fantasy world.' },
  { title: 'RollBit', category: 'Web3 platform', stack: 'React · Web3', image: rollbitImage, description: 'A sharp, fast digital product experience for a high-traffic platform.' },
  { title: 'Rajampo', category: 'Digital product', stack: 'React · Node.js', image: rajampoImage, description: 'A focused product interface with a distinct visual point of view.' },
  { title: 'Sodashi', category: 'Commerce', stack: 'React · Next.js', image: sodashiImage, description: 'A refined commerce presentation with an editorial sense of pace.' },
  { title: 'Dividend Finance', category: 'Fintech', stack: 'React · AWS', image: dividendImage, description: 'Clear digital infrastructure for a finance-led customer journey.' },
  { title: 'Needs Bank', category: 'Fintech', stack: 'React · Node.js', image: needsBankImage, description: 'An approachable banking interface designed around clarity and trust.' },
  { title: 'Doctore', category: 'Health platform', stack: 'React · Cloud', image: doctoreImage, description: 'A considered service experience for people navigating care.' },
  { title: 'Chat / Live Streaming Platform', category: 'Social platform', stack: 'React · WebRTC', image: chatImage, description: 'Real-time conversation and live connection in one fluid platform.' },
];

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => <motion.div className={className} initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '0px 0px -60px 0px', amount: .1 }} transition={{ duration: .8, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;

export function ProjectsPage({ onNavigate }: { onNavigate: () => void }) {
  return <>
    <section className="bg-[#F2F2F2] px-6 pb-12 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-14"><div className="mx-auto max-w-7xl border-t border-black/15 pt-5"><div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[.16em] text-black/50"><span>06</span><span>SELECTED WORK</span></div><div className="mt-10 grid gap-8 md:grid-cols-[1.25fr_.75fr] md:items-end md:gap-16"><Reveal><h1 className="max-w-5xl text-[clamp(3rem,6.7vw,6.7rem)] font-medium leading-[.86] tracking-[-.075em]">Work made to be used, remembered, and built on.</h1></Reveal><Reveal delay={.1}><p className="max-w-sm text-base leading-7 text-black/65">A selection of products and experiences across play, finance, commerce, health, and connection.</p></Reveal></div><div className="mt-12 flex items-center gap-4 border-t border-black/15 pt-4 font-mono text-[10px] font-bold tracking-[.14em] text-black/45"><span>10 PROJECTS</span><span className="h-px w-8 bg-black/25" /><span>SELECTED BETWEEN 2020—2026</span></div></div></section>

    <section className="bg-black px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14"><div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[.7fr_1.3fr] md:gap-16"><p className="font-mono text-[10px] font-bold tracking-[.16em] text-white/45">THE WORKING STANDARD</p><p className="max-w-4xl text-[clamp(2rem,4vw,4rem)] leading-[.96] tracking-[-.06em]">Every project gets the same attention to the <span className="text-white/45">details that last.</span></p></div></section>

    <section className="bg-[#F2F2F2] px-6 py-4 sm:px-10 sm:py-8 lg:px-14"><div className="mx-auto max-w-7xl">{projects.map((project, i) => <Reveal key={project.title} delay={i % 2 ? .04 : 0}><article className={`grid gap-7 border-t border-black/15 py-10 sm:py-14 md:grid-cols-[1.45fr_.85fr] md:items-center md:gap-12 lg:gap-20 ${i % 2 ? 'md:grid-cols-[.85fr_1.45fr]' : ''}`}><div className={`group relative aspect-[16/9] overflow-hidden bg-[#F2F2F2] ${i % 2 ? 'md:order-2' : ''}`}><img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]" loading="lazy" decoding="async" /><span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center bg-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={17} /></span></div><div className={`${i % 2 ? 'md:order-1' : ''}`}><div className="flex items-center justify-between border-b border-black/15 pb-4"><p className="font-mono text-[10px] font-bold tracking-[.14em] text-black/45">{project.category.toUpperCase()}</p><span className="font-mono text-[10px] text-black/40">{String(i + 1).padStart(2, '0')}</span></div><h2 className="mt-6 max-w-md text-4xl leading-[.9] tracking-[-.06em] sm:text-5xl">{project.title}</h2><p className="mt-5 max-w-sm text-sm leading-6 text-black/60">{project.description}</p><p className="mt-7 font-mono text-[10px] font-bold tracking-[.12em] text-black/45">{project.stack}</p></div></article></Reveal>)}</div></section>

    <section className="bg-[#F2F2F2] px-6 pb-14 pt-2 sm:px-10 sm:pb-20 lg:px-14"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 border-t border-black/15 pt-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/50">HAVE A PROJECT IN MIND?</p><h2 className="mt-4 max-w-xl text-4xl leading-[.95] tracking-[-.05em] sm:text-5xl">Let’s make the next piece of work count.</h2></div><button onClick={onNavigate} className="group inline-flex w-fit items-center gap-3 bg-black px-5 py-4 font-mono text-xs font-bold tracking-wide text-white transition-transform hover:-translate-y-1">CONTACT NDA <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button></div></section>
  </>;
}
