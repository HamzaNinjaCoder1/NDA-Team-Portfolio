import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, ChevronDown, Mail, MessageCircle, Send } from 'lucide-react';

const EMAIL = 'saasbusiness2026@gmail.com';
const WHATSAPP = '+380 93 771 3309';
const WHATSAPP_URL = 'https://wa.me/380937713309';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const syne: React.CSSProperties = { fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" };
const serif: React.CSSProperties = { fontFamily: "'Cormorant Garamond', 'Instrument Serif', serif" };

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 26, filter: 'blur(5px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '0px 0px -60px 0px', amount: 0.1 }}
    transition={{ duration: 0.8, delay, ease }}
  >
    {children}
  </motion.div>
);

const contactQuestions = [
  ['What should I include in my first message?', 'A short overview of the product, what needs to change, and the timing you have in mind.'],
  ['Do you work with existing teams?', 'Yes. We can lead a focused delivery, join an in-house team, or support a specialist gap.'],
  ['How quickly do you respond?', 'We usually reply within one working day with a useful next step or a few focused questions.'],
  ['Where do you work?', 'We work remotely across Colombia, Japan, Ukraine, and with teams worldwide.'],
];

interface FormState {
  name: string;
  email: string;
  budget: string;
  timeline: string;
  message: string;
}

const initialForm: FormState = { name: '', email: '', budget: '', timeline: '', message: '' };

const inputClass =
  'w-full border-b border-black/25 bg-transparent pb-3 pt-1 text-base tracking-[-0.02em] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black';
const errorClass = 'border-red-600/70 focus:border-red-600';
const labelClass = 'font-mono text-[10px] font-bold tracking-[.16em] text-black/50';

export function ContactPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [sent, setSent] = useState(false);

  const setField = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => ({ ...previous, [key]: false }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, boolean>> = {};
    if (!form.name.trim()) next.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = true;
    if (!form.message.trim()) next.message = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) setSent(true);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSent(false);
  };

  const mailtoHref = sent
    ? `mailto:${EMAIL}?subject=${encodeURIComponent(`Project inquiry — ${form.name}`)}&body=${encodeURIComponent(
        `${form.message}\n\n— ${form.name}\n${form.email}\nBudget: ${form.budget || 'TBD'}\nTimeline: ${form.timeline || 'TBD'}`,
      )}`
    : `mailto:${EMAIL}`;

  const jumpToForm = () => {
    document.getElementById('nda-brief-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* 01 — LEAD */}
      <section className="bg-[#F2F2F2] px-6 pb-14 pt-14 sm:px-10 sm:pb-20 sm:pt-20 lg:px-14">
        <div className="mx-auto max-w-7xl border-t border-black/15 pt-5">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[.16em] text-black/55">
            <span>08</span>
            <span>CONTACT</span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:gap-20">
            <Reveal>
              <h1>
                <span className="block font-black uppercase leading-[.84] tracking-[-.05em] text-black" style={{ ...syne, fontSize: 'clamp(4rem, 10vw, 9.5rem)' }}>
                  Bring the
                </span>
                <span className="block font-light italic leading-[.95] tracking-[-.02em] text-black" style={{ ...serif, fontSize: 'clamp(3.2rem, 7.6vw, 7rem)' }}>
                  brief.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={.12}>
              <div className="max-w-sm lg:pb-2">
                <p className="text-lg leading-7 text-black/65">
                  Tell us what you are building, where it is stuck, or what needs a more experienced set of hands. We reply within one working day.
                </p>
                <p className="mt-8 border-l-2 border-black pl-4 font-mono text-[10px] font-bold leading-5 tracking-[.14em] text-black/50">
                  RESPONSE / WITHIN 24H
                  <br />
                  DIRECT / INTERNATIONAL / HUMAN
                </p>
                <button type="button" onClick={jumpToForm} className="group mt-8 inline-flex items-center gap-3 font-mono text-[10px] font-bold tracking-[.14em]">
                  JUMP TO THE BRIEF
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={.18}>
            <a href={`mailto:${EMAIL}`} className="group mt-14 block border-t border-black/15 pt-6 sm:mt-20">
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/50">EMAIL</p>
                  <p className="mt-3 break-all font-semibold tracking-[-.045em] text-black transition-colors duration-300 group-hover:text-black/55" style={{ ...syne, fontSize: 'clamp(1.5rem, 3.8vw, 3.1rem)', lineHeight: 1 }}>
                    {EMAIL}
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/20 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white sm:h-14 sm:w-14">
                  <ArrowUpRight size={22} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* 02 — MARQUEE */}
      <div className="overflow-hidden bg-black py-3.5 sm:py-4">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-6 pr-6 text-lg font-black uppercase tracking-tight text-white/90 sm:text-xl" style={syne}>
                  Let&apos;s talk
                  <span className="text-white/40">✦</span>
                  Send a note
                  <span className="text-white/40">✦</span>
                  Start a chat
                  <span className="text-white/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* 03 — BRIEF FORM */}
      <section id="nda-brief-form" className="bg-black px-6 py-16 text-white sm:px-10 sm:py-24 lg:px-14">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="font-mono text-[10px] font-bold tracking-[.16em] text-white/45">START A PROJECT</p>
              <h2 className="mt-6 font-black uppercase leading-[.88] tracking-[-.045em]" style={{ ...syne, fontSize: 'clamp(2.6rem, 4.6vw, 4.4rem)' }}>
                Tell us where
                <br />
                you want to go.
              </h2>
              <p className="mt-7 max-w-sm text-base leading-7 text-white/60">
                A good conversation starts with the right question. Fill in the brief and we will come back with a useful next step — not a generic reply.
              </p>
              <div className="mt-10 space-y-3">
                <a href={`mailto:${EMAIL}`} className="group flex items-center justify-between gap-6 border-t border-white/15 pt-4">
                  <span className="font-mono text-[10px] font-bold tracking-[.16em] text-white/45">EMAIL</span>
                  <span className="text-sm text-white/80 transition-colors group-hover:text-white">{EMAIL}</span>
                  <ArrowUpRight size={15} className="text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 border-t border-white/15 pt-4">
                  <span className="font-mono text-[10px] font-bold tracking-[.16em] text-white/45">WHATSAPP</span>
                  <span className="text-sm text-white/80 transition-colors group-hover:text-white">{WHATSAPP}</span>
                  <ArrowUpRight size={15} className="text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={.1}>
            <div className="bg-white p-6 text-black ring-1 ring-white/15 sm:p-9 lg:p-11">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .5, ease }}
                  className="flex min-h-[420px] flex-col justify-between"
                >
                  <div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: .45, delay: .12, ease }}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white"
                    >
                      <Check size={24} strokeWidth={2.4} />
                    </motion.span>
                    <p className="mt-9 font-mono text-[10px] font-bold tracking-[.16em] text-black/50">NOTE READY</p>
                    <h3 className="mt-4 font-black uppercase leading-[.9] tracking-[-.04em]" style={{ ...syne, fontSize: 'clamp(1.9rem, 3.4vw, 3rem)' }}>
                      We will reply within one working day.
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-6 text-black/60">
                      Thanks, {form.name.split(' ')[0] || 'friend'} — your brief is ready to send. Pick the channel that suits you best.
                    </p>
                  </div>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <a href={mailtoHref} className="group inline-flex flex-1 items-center justify-between gap-6 bg-black px-5 py-4 font-mono text-[10px] font-bold tracking-[.14em] text-white transition-transform duration-300 hover:-translate-y-0.5">
                      <span className="flex items-center gap-2"><Mail size={14} /> OPEN EMAIL APP</span>
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-6 border border-black/20 bg-white px-5 py-4 font-mono text-[10px] font-bold tracking-[.14em] transition-colors hover:border-black">
                      <span className="flex items-center gap-2"><MessageCircle size={14} /> WHATSAPP</span>
                    </a>
                  </div>
                  <button type="button" onClick={handleReset} className="mt-4 w-fit font-mono text-[10px] font-bold tracking-[.14em] text-black/45 underline underline-offset-4 transition-colors hover:text-black">
                    SEND ANOTHER NOTE
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/50">THE BRIEF</p>
                      <h3 className="mt-4 font-black uppercase leading-[.92] tracking-[-.04em]" style={{ ...syne, fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)' }}>
                        Tell us everything.
                      </h3>
                    </div>
                    <Send size={22} strokeWidth={1.5} className="shrink-0 text-black/40" />
                  </div>

                  <div className="mt-10 grid gap-7 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                      <label htmlFor="nda-name" className={labelClass}>YOUR NAME</label>
                      <input id="nda-name" type="text" required value={form.name} onChange={setField('name')} placeholder="Jane Doe" className={`mt-1 ${inputClass} ${errors.name ? errorClass : ''}`} />
                      {errors.name && <p className="mt-2 font-mono text-[9px] font-bold tracking-[.12em] text-red-600">PLEASE TELL US YOUR NAME</p>}
                    </div>
                    <div>
                      <label htmlFor="nda-email" className={labelClass}>EMAIL</label>
                      <input id="nda-email" type="email" required value={form.email} onChange={setField('email')} placeholder="you@company.com" className={`mt-1 ${inputClass} ${errors.email ? errorClass : ''}`} />
                      {errors.email && <p className="mt-2 font-mono text-[9px] font-bold tracking-[.12em] text-red-600">PLEASE ADD A VALID EMAIL</p>}
                    </div>
                    <div className="relative">
                      <label htmlFor="nda-budget" className={labelClass}>BUDGET</label>
                      <select id="nda-budget" value={form.budget} onChange={setField('budget')} className={`mt-1 w-full appearance-none border-b border-black/25 bg-transparent pb-3 pt-1 text-base tracking-[-.02em] outline-none transition-colors focus:border-black ${form.budget ? 'text-black' : 'text-black/30'}`}>
                        <option value="">Select a range</option>
                        <option value="Under $10k">Under $10k</option>
                        <option value="$10k – $25k">$10k – $25k</option>
                        <option value="$25k – $50k">$25k – $50k</option>
                        <option value="$50k+">$50k+</option>
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute bottom-3 right-0 text-black/40" />
                    </div>
                    <div className="relative">
                      <label htmlFor="nda-timeline" className={labelClass}>TIMELINE</label>
                      <select id="nda-timeline" value={form.timeline} onChange={setField('timeline')} className={`mt-1 w-full appearance-none border-b border-black/25 bg-transparent pb-3 pt-1 text-base tracking-[-.02em] outline-none transition-colors focus:border-black ${form.timeline ? 'text-black' : 'text-black/30'}`}>
                        <option value="">Select a window</option>
                        <option value="ASAP">ASAP</option>
                        <option value="1 – 3 months">1 – 3 months</option>
                        <option value="3 – 6 months">3 – 6 months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute bottom-3 right-0 text-black/40" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="nda-message" className={labelClass}>THE PROJECT</label>
                      <textarea id="nda-message" required rows={5} value={form.message} onChange={setField('message')} placeholder="What are you building? What needs to change? What timing do you have in mind?" className={`mt-1 w-full resize-none border-b border-black/25 bg-transparent pb-3 pt-1 text-base leading-6 tracking-[-.02em] outline-none transition-colors placeholder:text-black/30 focus:border-black ${errors.message ? errorClass : ''}`} />
                      {errors.message && <p className="mt-2 font-mono text-[9px] font-bold tracking-[.12em] text-red-600">PLEASE DESCRIBE THE PROJECT</p>}
                    </div>
                  </div>

                  <button type="submit" className="group mt-10 inline-flex w-full items-center justify-between gap-6 bg-black px-5 py-4 font-mono text-[10px] font-bold tracking-[.14em] text-white transition-transform duration-300 hover:-translate-y-0.5">
                    <span>SEND THE BRIEF</span>
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                  <p className="mt-4 text-center font-mono text-[9px] font-bold tracking-[.12em] text-black/35">
                    NO SPAM · NO NEWSLETTERS · JUST A DIRECT REPLY
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 — DIRECT CHANNELS */}
      <section className="bg-[#F2F2F2] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="mx-auto max-w-7xl border-t border-black/15 pt-5">
          <div className="flex items-end justify-between">
            <Reveal><p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/55">DIRECT CHANNELS</p></Reveal>
            <Reveal delay={.06}><span className="font-mono text-[10px] text-black/45">03 ROUTES</span></Reveal>
          </div>

          <Reveal delay={.08}>
            <a href={`mailto:${EMAIL}`} className="group grid gap-2 border-b border-black/15 py-7 md:grid-cols-[150px_1fr_auto] md:items-center md:gap-10">
              <span className="font-mono text-[10px] font-bold tracking-[.16em] text-black/45">EMAIL</span>
              <span className="break-all font-semibold tracking-[-.04em] text-black transition-colors duration-300 group-hover:text-black/55" style={{ ...syne, fontSize: 'clamp(1.5rem, 3.4vw, 2.8rem)', lineHeight: 1.05 }}>{EMAIL}</span>
              <ArrowUpRight size={20} className="hidden text-black/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:block" />
            </a>
          </Reveal>

          <Reveal delay={.12}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group grid gap-2 border-b border-black/15 py-7 md:grid-cols-[150px_1fr_auto] md:items-center md:gap-10">
              <span className="font-mono text-[10px] font-bold tracking-[.16em] text-black/45">WHATSAPP</span>
              <span className="font-semibold tracking-[-.04em] text-black transition-colors duration-300 group-hover:text-black/55" style={{ ...syne, fontSize: 'clamp(1.5rem, 3.4vw, 2.8rem)', lineHeight: 1.05 }}>{WHATSAPP}</span>
              <ArrowUpRight size={20} className="hidden text-black/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:block" />
            </a>
          </Reveal>

          <Reveal delay={.16}>
            <div className="grid gap-2 border-b border-black/15 py-7 md:grid-cols-[150px_1fr_auto] md:items-center md:gap-10">
              <span className="font-mono text-[10px] font-bold tracking-[.16em] text-black/45">RESPONSE</span>
              <span className="font-semibold tracking-[-.04em] text-black" style={{ ...syne, fontSize: 'clamp(1.5rem, 3.4vw, 2.8rem)', lineHeight: 1.05 }}>Within one working day</span>
              <span className="hidden h-2 w-2 rounded-full bg-black/80 md:block" />
            </div>
          </Reveal>

          <Reveal delay={.2}>
            <div className="grid gap-2 border-b border-black/15 py-7 md:grid-cols-[150px_1fr_auto] md:items-center md:gap-10">
              <span className="font-mono text-[10px] font-bold tracking-[.16em] text-black/45">BASED IN</span>
              <span className="font-semibold tracking-[-.04em] text-black" style={{ ...syne, fontSize: 'clamp(1.5rem, 3.4vw, 2.8rem)', lineHeight: 1.05 }}>Colombia · Japan · Ukraine — worldwide</span>
              <span className="hidden font-mono text-[10px] font-bold tracking-[.16em] text-black/40 md:block">UTC -5 / +9 / +2</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 — FAQ */}
      <section className="bg-[#F2F2F2] px-6 pb-16 sm:px-10 sm:pb-24 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-end justify-between border-b border-black/15 pb-4">
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[.16em] text-black/55">COMMON QUESTIONS</p>
                <h2 className="mt-3 font-black uppercase tracking-[-.045em] text-black" style={{ ...syne, fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}>Before you ask.</h2>
              </div>
              <span className="hidden font-mono text-[10px] text-black/45 sm:block">04 ANSWERS</span>
            </div>
          </Reveal>

          <Reveal delay={.08}>
            <div>
              {contactQuestions.map(([question, answer], i) => (
                <div key={question} className="border-b border-black/15">
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                    aria-expanded={openQuestion === i}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] text-black/40">0{i + 1}</span>
                      <span className="font-semibold tracking-[-.02em] text-black" style={{ ...syne, fontSize: 'clamp(1.15rem, 2.2vw, 1.7rem)' }}>{question}</span>
                    </span>
                    <ArrowUpRight size={17} className={`shrink-0 transition-all duration-300 ${openQuestion === i ? 'rotate-90 text-black' : 'text-black/40 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'}`} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openQuestion === i ? 'auto' : 0, opacity: openQuestion === i ? 1 : 0 }}
                    transition={{ duration: .4, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 pl-10 text-sm leading-6 text-black/60">{answer}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
