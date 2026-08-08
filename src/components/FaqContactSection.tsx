import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

import aboutArchitectureImg from '../assets/images/about_architecture_1785673852783.jpg';
import section6RightImage from '../assets/images/section6_right_image.png';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'timeline',
    question: "WHAT'S THE TYPICAL TIMELINE?",
    answer: "Most digital transformation and brand identity projects run between 6 to 12 weeks. We move swiftly from strategy to high-fidelity prototypes and final deployment.",
  },
  {
    id: 'pricing',
    question: 'HOW DO YOU PRICE?',
    answer: 'We operate on fixed-scope project agreements or dedicated monthly retainer partnerships. Every proposal includes a clear deliverable breakdown and zero hidden costs.',
  },
  {
    id: 'in-house',
    question: 'DO YOU DEVELOP IN-HOUSE?',
    answer: 'Yes, 100%. Our engineering and creative teams work side-by-side in-house to guarantee that complex WebGL visuals and interactions perform at 60 FPS across all devices.',
  },
  {
    id: 'brand-team',
    question: 'CAN YOU WORK WITH OUR BRAND TEAM?',
    answer: 'Absolutely. We seamlessly integrate with existing design systems and internal product leads, elevating your existing brand guidelines into digital experiences.',
  },
  {
    id: 'start-requirements',
    question: 'WHAT DO YOU NEED TO START?',
    answer: 'A brief conversation about your business goals, target timeline, and budget parameters. We will evaluate your current presence and deliver a custom roadmap.',
  },
  {
    id: 'after-launch',
    question: 'DO YOU SUPPORT AFTER LAUNCH?',
    answer: 'Yes, we provide ongoing quarterly optimization, continuous feature development, security patches, and performance monitoring tailored to your scaling needs.',
  },
  {
    id: 'success-metrics',
    question: 'HOW DO WE MEASURE SUCCESS?',
    answer: 'We define concrete KPIs prior to launch — including user conversion rates, page speed performance indices, dwell time, and overall brand perception lift.',
  },
];

export const FaqContactSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section className="relative w-full bg-[#F2F2F2] text-black px-6 sm:px-10 lg:px-14 pt-6 sm:pt-12 pb-16 select-none overflow-hidden">
      <div className="max-w-[1320px] mx-auto flex flex-col space-y-6 sm:space-y-8">
        
        {/* SECTION HEADER ROW - SECTION [07] - UPDATED SPACING */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-black/10">
          <h2 className="font-mono text-base sm:text-lg font-bold tracking-widest text-black uppercase">
            FAQ
          </h2>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-black">
            [07]
          </span>
        </div>

        {/* TWO-COLUMN EDITORIAL GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* ================= LEFT COLUMN: FAQ ACCORDION ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col space-y-0 h-full"
          >
            {FAQ_LIST.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="border-b border-black/15">
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full py-5 text-left flex items-center justify-between space-x-4 group cursor-pointer"
                  >
                    <span className="font-mono text-sm sm:text-base font-semibold uppercase tracking-[0.15em] text-black group-hover:text-neutral-600 transition-colors">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-neutral-500 group-hover:text-black transition-colors shrink-0"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="font-sans text-sm text-neutral-600 leading-relaxed pb-4 pr-6">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          {/* ================= RIGHT COLUMN: START A PROJECT & CONTACT CARD ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col space-y-6 relative h-full"
          >
            {/* UPPER AREA: HEAVY EDITORIAL TITLE & NEW IMAGE */}
            <div className="relative flex items-start justify-between min-h-[280px] pr-2">
              <div className="flex flex-col space-y-3 max-w-xs z-10 pt-1">
                <h3 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-black leading-[0.98]">
                  START <br /> A PROJECT
                </h3>
                <p className="font-sans text-xs text-neutral-600 leading-relaxed max-w-[260px]">
                  Tell to our manager about the goal. <br />
                  We'll reply with scope and timeline.
                </p>
              </div>

              {/* NEW SECTION 7 RIGHT IMAGE */}
              <div className="w-36 sm:w-44 h-36 sm:h-44 overflow-hidden shrink-0 pointer-events-none z-10 -mt-2">
                <img
                  src={section6RightImage}
                  alt="Section 6 Right Image"
                  className="w-full h-full object-cover object-center filter contrast-[1.05]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* LOWER AREA: COMPACT WHITE CONTACT CARD */}
            <div className="bg-white p-5 sm:p-7 border border-black/8 shadow-sm relative z-20 -mt-36 w-full">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={26} />
                  </div>
                  <h4 className="font-mono text-sm font-bold text-black uppercase tracking-wider">
                    MESSAGE SENT
                  </h4>
                  <p className="font-sans text-xs text-neutral-600 max-w-xs">
                    Thank you! Our manager has received your message and will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                  {/* TOP ROW: NAME & EMAIL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="font-mono text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Michael Johnson"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-black/20 pb-1.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors font-sans"
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="font-mono text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                        YOUR EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-black/20 pb-1.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* BOTTOM ROW: MESSAGE TEXTAREA */}
                  <div className="flex flex-col space-y-1.5 pt-1">
                    <label className="font-mono text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                      MESSAGE
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border-b border-black/20 pb-1.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors resize-none font-sans"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="w-full py-3 mt-1 bg-[#000000] hover:bg-neutral-800 text-white font-mono text-[11px] font-bold tracking-widest uppercase rounded-lg transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                  >
                    SEND MESSAGE
                  </button>

                  {/* PRIVACY TERMS */}
                  <p className="font-sans text-[10px] text-center text-neutral-500 pt-0.5">
                    Before submitting, you agree to our{' '}
                    <span className="font-semibold text-neutral-800 underline cursor-pointer">Terms</span> and{' '}
                    <span className="font-semibold text-neutral-800 underline cursor-pointer">Privacy Policy</span>.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
