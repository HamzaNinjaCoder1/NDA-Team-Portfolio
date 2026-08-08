import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    rating: 5.0,
    testimonial: "They rebuilt our website from scratch and the 3D product visuals stopped everyone mid-scroll. Our bounce rate dropped by half and bookings doubled within two months.",
    name: 'Maya Chen',
    role: 'Founder, Lumen Studio',
    imgSrc: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 1,
    rating: 5.0,
    testimonial: "The team turned our messy brand into something we're genuinely proud of. Every page feels intentional, and conversions are up 34% since launch.",
    name: 'Daniel Reyes',
    role: 'CMO, Verde Commerce',
    imgSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 2,
    rating: 5.0,
    testimonial: "Working with them felt like having an in-house creative team. Fast, precise, and shockingly good at translating our vision into design.",
    name: 'Sophie Laurent',
    role: 'Head of Digital, Atelier Nord',
    imgSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 3,
    rating: 5.0,
    testimonial: "We've shipped with many agencies. This was the smoothest launch we've had — clean code, honest timelines, and a handoff our engineers loved.",
    name: 'Marcus Okafor',
    role: 'Product Lead, Pulse',
    imgSrc: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 4,
    rating: 5.0,
    testimonial: "Our new identity and website finally match the quality of our work. The motion design they added is the first thing clients mention in meetings.",
    name: 'Elena Petrova',
    role: 'Brand Director, Nova',
    imgSrc: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 5,
    rating: 5.0,
    testimonial: "I didn't expect a studio to care this much about our metrics. They obsessed over every detail and the results speak for themselves.",
    name: 'Tom Whitfield',
    role: 'Founder, Fieldnotes',
    imgSrc: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 6,
    rating: 5.0,
    testimonial: "They made our platform feel approachable and premium at the same time. Patient sign-ups are up and our team genuinely enjoys the new interface.",
    name: 'Aisha Rahman',
    role: 'COO, Brightside Health',
    imgSrc: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 7,
    rating: 5.0,
    testimonial: "From strategy to launch in nine weeks. The 3D work on our product pages generated the best engagement we've ever measured.",
    name: 'Lucas Meyer',
    role: 'CEO, Crafted',
    imgSrc: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 8,
    rating: 5.0,
    testimonial: "The website they built is fast, beautiful, and impossible to ignore. It's the best investment we've made in our brand this year.",
    name: 'Grace Kim',
    role: 'Marketing Director, SOMA',
    imgSrc: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 9,
    rating: 5.0,
    testimonial: "Rare to find a team that gets both design and engineering. They delivered everything on time without a single compromise on quality.",
    name: 'Omar Haddad',
    role: 'Founder, Mosaic',
    imgSrc: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 10,
    rating: 5.0,
    testimonial: "Our portfolio finally does our work justice. The team's taste, patience, and attention to detail are second to none.",
    name: 'Isabella Rossi',
    role: 'Creative Director, Luna',
    imgSrc: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=70',
  },
  {
    tempId: 11,
    rating: 5.0,
    testimonial: "The handoff was flawless — documentation, performance budgets, everything. It's the closest thing to a plug-and-play agency I've ever seen.",
    name: 'Noah Bergstrom',
    role: 'VP Product, Klar',
    imgSrc: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200&q=70',
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
  cardHeight: number;
}

const Stars: React.FC<{ rating: number; dark?: boolean }> = ({ rating, dark }) => {
  return (
    <div className="flex items-center gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-flex h-4 w-4">
            <Star
              className={cn(
                'h-4 w-4',
                dark ? 'text-white/70' : 'text-white stroke-[#c9c9c9]'
              )}
              strokeWidth={dark ? 0 : 1.5}
              fill="currentColor"
            />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden text-amber-400"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="h-4 w-4" strokeWidth={0} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
  cardHeight,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        'absolute left-1/2 top-1/2 flex cursor-pointer flex-col border-2 p-5 will-change-transform transition-all duration-500 ease-in-out sm:p-6',
        isCenter
          ? 'z-10 border-black bg-[#1c1c1c] text-white'
          : 'z-0 border-black/10 bg-white text-black hover:border-black/30'
      )}
      style={{
        width: cardSize,
        height: cardHeight,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -cardSize * 0.18 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? '0px 8px 0px 4px hsl(var(--border))' : '0px 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <img
          src={testimonial.imgSrc}
          alt={testimonial.name}
          className="mb-3 h-14 w-12 bg-muted object-cover object-top sm:mb-4"
          style={{ boxShadow: '3px 3px 0px hsl(var(--background))' }}
          loading="lazy"
          decoding="async"
        />
        <div className="text-right">
          <Stars rating={testimonial.rating} dark={isCenter} />
          <p
            className={cn(
              'mt-1 font-mono text-[11px] font-bold tracking-widest',
              isCenter ? 'text-white/70' : 'text-neutral-500'
            )}
          >
            {testimonial.rating.toFixed(1)}
          </p>
        </div>
      </div>
      <p
        className={cn(
          'mt-3 flex-1 text-[13px] leading-relaxed sm:mt-5 sm:text-sm',
          isCenter ? 'text-white/90' : 'text-neutral-700'
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </p>
      <div className="mt-3 sm:mt-5">
        <p className={cn('text-sm font-semibold tracking-tight', isCenter ? 'text-white' : 'text-black')}>
          {testimonial.name}
        </p>
        <p className={cn('mt-0.5 text-xs', isCenter ? 'text-white/60' : 'text-neutral-500')}>
          {testimonial.role}
        </p>
      </div>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(320);
  const [cardHeight, setCardHeight] = useState(330);
  const [containerHeight, setContainerHeight] = useState(530);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const mobile = window.matchMedia('(max-width: 639px)').matches;
      const tablet = window.matchMedia('(min-width: 640px) and (max-width: 1023px)').matches;
      if (mobile) {
        setCardSize(245);
        setCardHeight(300);
        setContainerHeight(490);
      } else if (tablet) {
        setCardSize(270);
        setCardHeight(300);
        setContainerHeight(530);
      } else {
        setCardSize(320);
        setCardHeight(330);
        setContainerHeight(560);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: containerHeight }}>
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            cardHeight={cardHeight}
          />
        );
      })}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            'flex h-12 w-12 items-center justify-center transition-colors',
            'bg-background border-2 border-black/15 hover:border-black hover:bg-black hover:text-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            'flex h-12 w-12 items-center justify-center transition-colors',
            'bg-background border-2 border-black/15 hover:border-black hover:bg-black hover:text-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
