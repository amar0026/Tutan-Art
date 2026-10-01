import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------- Teeno images ke alag links yahan paste karo ---------- */
const DRAWING_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790851795/Graphite_Portrait_on_a_Cosy_Sketchbook_ztvcna.png"; // <-- Drawing image ka link
const DANCE_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790851808/Bharatanatyam_Radiance_Under_Stage_Lights_dvzu1o.png"; // <-- Dance image ka link
const YOGA_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790851806/Golden_Sunrise_Lakeside_Yoga_Stretch_p5g5ze.png"; // <-- Yoga image ka link

/* ---------- Theme (Hero + Navbar jaisa) ---------- */
const CREAM = "#FBF6EE";
const BROWN = "#3B1F14";
const PEACH = "#F3D9BC";
const PEACH_DARK = "#EBC9A0";

interface AboutProps {
  drawingImg?: string;
  danceImg?: string;
  yogaImg?: string;
}

/* ---------- Icons (inline SVG) ---------- */
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill={BROWN} stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DanceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={BROWN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={BROWN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5c1.8 2 2.6 4.2 2.6 6.4S13.8 15 12 16.5c-1.8-1.5-2.6-3.1-2.6-5.1S10.2 7 12 5Z" />
      <path d="M12 16.5c-3.2.4-6.2-1.2-7.5-4.3 2.3-.3 4.2.2 5.6 1.3" />
      <path d="M12 16.5c3.2.4 6.2-1.2 7.5-4.3-2.3-.3-4.2.2-5.6 1.3" />
      <path d="M5 18.5c2.3 1.6 4.5 2.2 7 2.2s4.7-.6 7-2.2" />
    </svg>
  );
}

/* ---------- Section screen mein aate hi ek baar animation ---------- */
function useInView<T extends HTMLElement>(threshold = 0.2) {
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

export default function About({
  drawingImg = DRAWING_IMG,
  danceImg = DANCE_IMG,
  yogaImg = YOGA_IMG,
}: AboutProps) {
  const { ref, visible } = useInView<HTMLElement>(0.2);

  const cards: { label: string; img: string; icon: ReactNode }[] = [
    { label: "Drawing", img: drawingImg, icon: <PencilIcon /> },
    { label: "Dance", img: danceImg, icon: <DanceIcon /> },
    { label: "Yoga", img: yogaImg, icon: <LotusIcon /> },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 px-5 py-12 sm:px-8 md:py-16"
      style={{ backgroundColor: CREAM }}
    >
      <style>{`
        @keyframes about-pop {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes about-shine {
          from { transform: translateX(-120%) skewX(-20deg); }
          to   { transform: translateX(380%) skewX(-20deg); }
        }
        .about-badge { opacity: 0; }
        .about-badge.on { animation: about-pop 0.6s cubic-bezier(.34,1.56,.64,1) both; }
        .about-card:hover .about-shine { animation: about-shine 0.9s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .about-badge { opacity: 1; }
          .about-badge.on, .about-card:hover .about-shine { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 md:gap-8">
        {cards.map((c, i) => (
          <article
            key={c.label}
            className={`about-card group cursor-pointer transition-all duration-700 ease-out hover:-translate-y-2 motion-reduce:transition-none ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: visible ? `${i * 150}ms` : "0ms" }}
          >
            {/* Image (link khali ho to peach block dikhega) */}
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-md transition-shadow duration-500 group-hover:shadow-xl"
              style={{ backgroundColor: PEACH }}
            >
              {c.img && (
                <img
                  src={c.img}
                  alt={`${c.label} class`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              )}
              <span className="about-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/30 opacity-0 group-hover:opacity-100" />
            </div>

            {/* Label bar (image ke bottom par halka overlap) */}
            <div
              className="relative -mt-5 flex h-14 items-center rounded-xl pl-[4.5rem] pr-4 shadow-sm"
              style={{ backgroundColor: PEACH }}
            >
              {/* Round icon badge */}
              <span
                className={`about-badge ${visible ? "on" : ""} absolute -top-5 left-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-transform duration-500 group-hover:rotate-[360deg]`}
                style={{
                  backgroundColor: PEACH_DARK,
                  animationDelay: `${500 + i * 150}ms`,
                }}
              >
                {c.icon}
              </span>

              <h3
                className="text-sm font-extrabold uppercase tracking-wide sm:text-[15px]"
                style={{ color: BROWN }}
              >
                {c.label}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}