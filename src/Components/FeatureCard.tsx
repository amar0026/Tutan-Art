import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------- Teeno images ke alag links yahan paste karo ---------- */
const DRAWING_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790851795/Graphite_Portrait_on_a_Cosy_Sketchbook_ztvcna.png";
const DANCE_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790851808/Bharatanatyam_Radiance_Under_Stage_Lights_dvzu1o.png";
const YOGA_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790851806/Golden_Sunrise_Lakeside_Yoga_Stretch_p5g5ze.png";

/* ---------- Theme (Hero + Navbar jaisa) ---------- */
const CREAM = "#FBF6EE";
const BROWN = "#3B1F14";
const PEACH = "#F3D9BC";
const PEACH_DARK = "#EBC9A0";

/* Slider ki speed (seconds mein, zyada = slow) */
const SLIDE_DURATION = 36;

interface AboutProps {
  drawingImg?: string;
  danceImg?: string;
  yogaImg?: string;
}

/* ---------- Icons (inline SVG) ---------- */
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill={BROWN} stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DanceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke={BROWN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="4.5" r="1.8" fill={BROWN} />
      <path d="M14 7.5 11.5 13l4.5 3.5V21" />
      <path d="M11.5 13 8 21" />
      <path d="M13 9 6 6.5" />
      <path d="M13.5 9.5 19 6" />
    </svg>
  );
}

function LotusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke={BROWN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5c1.8 2 2.6 4.2 2.6 6.4S13.8 15 12 16.5c-1.8-1.5-2.6-3.1-2.6-5.1S10.2 7 12 5Z" />
      <path d="M12 16.5c-3.2.4-6.2-1.2-7.5-4.3 2.3-.3 4.2.2 5.6 1.3" />
      <path d="M12 16.5c3.2.4 6.2-1.2 7.5-4.3-2.3-.3-4.2.2-5.6 1.3" />
      <path d="M5 18.5c2.3 1.6 4.5 2.2 7 2.2s4.7-.6 7-2.2" />
    </svg>
  );
}

/* ---------- Section screen mein aate hi ek baar animation ---------- */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

interface CardData {
  label: string;
  img: string;
  icon: ReactNode;
}

/* ---------- Ek card ---------- */
function ClassCard({ card, hidden }: { card: CardData; hidden?: boolean }) {
  return (
    <article
      aria-hidden={hidden || undefined}
      className="about-card group mr-6 w-[17rem] shrink-0 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2 sm:mr-8 sm:w-80 lg:mr-10 lg:w-[26rem]"
    >
      {/* Image */}
      <div
        className="relative aspect-[16/11] overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 group-hover:shadow-xl"
        style={{ backgroundColor: PEACH }}
      >
        {card.img && (
          <img
            src={card.img}
            alt={hidden ? "" : `${card.label} class`}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
        <span className="about-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/30 opacity-0 group-hover:opacity-100" />
      </div>

      {/* Label bar (image ke bottom par overlap) */}
      <div
        className="relative -mt-7 flex h-[4.5rem] items-center rounded-2xl pl-[6rem] pr-5 shadow-sm sm:h-20 sm:pl-[6.5rem] lg:h-24 lg:pl-[7.5rem]"
        style={{ backgroundColor: PEACH }}
      >
        {/* Round icon badge */}
        <span
          className="absolute -top-7 left-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full shadow-md transition-transform duration-500 group-hover:rotate-[360deg] sm:h-20 sm:w-20 lg:-top-8 lg:h-24 lg:w-24"
          style={{ backgroundColor: PEACH_DARK }}
        >
          {card.icon}
        </span>

        <h3
          className="text-base font-extrabold uppercase tracking-wide sm:text-lg lg:text-xl"
          style={{ color: BROWN }}
        >
          {card.label}
        </h3>
      </div>
    </article>
  );
}

export default function About({
  drawingImg = DRAWING_IMG,
  danceImg = DANCE_IMG,
  yogaImg = YOGA_IMG,
}: AboutProps) {
  const { ref, visible } = useInView<HTMLElement>(0.15);

  const cards: CardData[] = [
    { label: "Drawing", img: drawingImg, icon: <PencilIcon /> },
    { label: "Dance", img: danceImg, icon: <DanceIcon /> },
    { label: "Yoga", img: yogaImg, icon: <LotusIcon /> },
  ];

  // Ek "set" = 3 cards 2 baar (badi screen par bhi khali jagah na dikhe)
  const oneSet = [...cards, ...cards];

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: CREAM }}
    >
      <style>{`
        @keyframes about-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes about-shine {
          from { transform: translateX(-120%) skewX(-20deg); }
          to   { transform: translateX(380%) skewX(-20deg); }
        }
        .about-track {
          display: flex;
          width: max-content;
          animation: about-slide ${SLIDE_DURATION}s linear infinite;
          will-change: transform;
        }
        /* Hover ya touch par slider ruk jaata hai */
        .about-marquee:hover .about-track,
        .about-marquee:active .about-track { animation-play-state: paused; }
        .about-card:hover .about-shine { animation: about-shine 0.9s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .about-track { animation: none; }
          .about-marquee { overflow-x: auto; }
          .about-card:hover .about-shine { animation: none; }
        }
      `}</style>

      {/* Slider: dono kinaaron par soft fade */}
      <div
        className={`about-marquee overflow-x-hidden py-10 transition-all duration-1000 ease-out motion-reduce:transition-none ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        {/* Track: do identical sets, taaki -50% par seamless loop ho */}
        <div className="about-track">
          {oneSet.map((c, i) => (
            <ClassCard key={`a-${i}`} card={c} />
          ))}
          {oneSet.map((c, i) => (
            <ClassCard key={`b-${i}`} card={c} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}