// src/Components/AboutSection.tsx
// React + Vite + Tailwind CSS (TypeScript)
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// 👉 Story wali image ka outside link yahan paste karo (khali ho to gradient placeholder dikhega)
const STORY_IMG: string = "https://res.cloudinary.com/dquki4xol/image/upload/v1791292901/Sunlit_Art_Dance_and_Yoga_Studio_rmg0h2.png";

interface AboutSectionProps {
  learnMoreTo?: string; // "Learn More" kahan le jaaye
}

/* ---------- scroll reveal (upar se neeche, ek baar) ---------- */

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        seen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
      } ${className}`}
      style={{ transitionDelay: seen ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ---------- decorations ---------- */

function Leaf({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={`ab-sway pointer-events-none ${className}`}
      style={flip ? { scale: "-1 1" } : undefined}
      viewBox="0 0 60 120"
      fill="none"
      stroke="#4d6a3a"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M30 118 C 30 80, 30 40, 30 6" />
      <path d="M30 30 C 18 26, 14 14, 18 6 C 28 8, 32 20, 30 30 Z" fill="#a9c28a" fillOpacity="0.6" />
      <path d="M30 56 C 44 52, 52 42, 50 32 C 38 34, 30 44, 30 56 Z" fill="#a9c28a" fillOpacity="0.6" />
      <path d="M30 78 C 16 74, 8 64, 10 54 C 22 56, 30 66, 30 78 Z" fill="#a9c28a" fillOpacity="0.6" />
      <path d="M30 100 C 42 96, 50 88, 48 78 C 38 80, 30 88, 30 100 Z" fill="#a9c28a" fillOpacity="0.6" />
    </svg>
  );
}

function Brush({ className = "", color = "#F0C986" }: { className?: string; color?: string }) {
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 400 160" fill="none" aria-hidden="true">
      <path
        d="M0 40 C 60 6, 170 10, 260 24 C 330 34, 385 50, 398 86 C 340 120, 250 146, 160 144 C 90 142, 30 124, 0 90 Z"
        fill={color}
        fillOpacity="0.5"
      />
    </svg>
  );
}

/* ---------- icons ---------- */

const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const TargetIcon = () => (
  <svg width="30" height="30" {...ic}>
    <circle cx="11" cy="13" r="8" />
    <circle cx="11" cy="13" r="4.5" />
    <circle cx="11" cy="13" r="1" fill="currentColor" />
    <path d="M13 11l7-7M17 3v4h4" />
  </svg>
);
const UsersIcon = () => (
  <svg width="28" height="28" {...ic}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M16 14.2c3 0 5 2.2 5 5.3" />
  </svg>
);
const HeartIcon = () => (
  <svg width="28" height="28" {...ic}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10z" />
  </svg>
);
const LeafIcon = () => (
  <svg width="28" height="28" {...ic}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
    <path d="M5 19c3-4 6-7 10-9" />
  </svg>
);
const BoardIcon = () => (
  <svg width="28" height="28" {...ic}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M12 20v-4M8 20h8" />
    <path d="M12 12.500s-3-1.800-3-3.700a1.700 1.700 0 0 1 3-.9 1.700 1.700 0 0 1 3 .9c0 1.900-3 3.700-3 3.700z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="32" height="32" {...ic}>
    <path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.500v1.500M5 4.500l1 1.100M19 4.500l-1 1.100" />
  </svg>
);

/* ---------- data ---------- */

const UNIQUE = [
  { label: "Experienced Instructors", icon: <UsersIcon />, bg: "bg-[#E8590C]" },
  { label: "Creative & Calm Environment", icon: <HeartIcon />, bg: "bg-[#2F6B4F]" },
  { label: "All Age Groups Welcome", icon: <LeafIcon />, bg: "bg-[#F2B84B]" },
  { label: "Focus on Overall Well-being", icon: <BoardIcon />, bg: "bg-[#E0603E]" },
];

/* ---------- main ---------- */

export default function AboutSection({ learnMoreTo = "/classes" }: AboutSectionProps) {
  const row =
    "relative overflow-hidden rounded-2xl border border-[#EBDCC6] bg-[#FBF3E6] p-5 shadow-sm sm:p-8";
  const heading = "ab-serif text-xl font-bold uppercase tracking-wide text-slate-800 sm:text-2xl";

  return (
    <section id="about-section" className="bg-[#F6EBDC] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Caveat:wght@600;700&display=swap');

        .ab-serif  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .ab-sans   { font-family: 'DM Sans', system-ui, sans-serif; }
        .ab-script { font-family: 'Caveat', cursive; }

        @keyframes ab-sway  { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes ab-float { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-6px) rotate(-4deg); } }
        @keyframes ab-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }

        .ab-sway  { transform-origin: 50% 100%; animation: ab-sway 5s ease-in-out infinite; }
        .ab-float { transform: rotate(-6deg); animation: ab-float 5s ease-in-out infinite; }
        .ab-pulse { animation: ab-pulse 2.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ab-sway, .ab-float, .ab-pulse { animation: none !important; }
        }
      `}</style>

      <div className="ab-sans mx-auto max-w-5xl space-y-4 sm:space-y-5">
        {/* ---------- OUR STORY ---------- */}
        <Reveal>
          <div className={row}>
            <Leaf className="absolute -left-1 top-6 hidden h-24 w-10 opacity-80 sm:block" />
            <div className="relative grid items-center gap-6 sm:pl-8 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className={heading}>Our Story</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  Tutan&rsquo;s Creation was born from a deep passion for creativity, movement and well-being. Our aim
                  is to create a supportive environment where people of all ages can discover their talents, build
                  confidence and live a more balanced life.
                </p>
                <Link
                  to={learnMoreTo}
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C2571A] transition-colors hover:text-[#A84812]"
                >
                  Learn More
                  <svg width="18" height="18" {...ic} className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              <div className="group overflow-hidden rounded-xl border border-[#EBDCC6] shadow-md">
                {STORY_IMG ? (
                  <img
                    src={STORY_IMG}
                    alt="Tutan's Creation studio"
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="ab-serif flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] text-2xl font-bold text-white/90">
                    Art &bull; Dance &bull; Yoga
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------- OUR MISSION ---------- */}
        <Reveal delay={80}>
          <div className={row}>
            <Brush className="absolute -right-6 top-0 w-72 sm:w-96" />
            <div className="relative grid items-center gap-5 md:grid-cols-[1.3fr_0.7fr]">
              <div className="flex items-start gap-4">
                <span className="ab-pulse flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#E8590C] shadow-md ring-2 ring-[#E8590C]/20">
                  <TargetIcon />
                </span>
                <div>
                  <h2 className={heading}>Our Mission</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                    To inspire creativity, build confidence and promote holistic well-being through art, movement and
                    mindfulness.
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-center gap-2 md:justify-end">
                <p className="ab-script ab-float text-center text-3xl font-bold leading-[1.05] text-slate-800 sm:text-4xl">
                  Create
                  <br />
                  Move
                  <br />
                  Be Well
                </p>
                <Leaf className="h-24 w-10 sm:h-28 sm:w-12" flip />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------- WHAT MAKES US UNIQUE ---------- */}
        <Reveal delay={80}>
          <div className={`${row} text-center`}>
            <Leaf className="absolute -left-1 top-4 hidden h-28 w-12 opacity-80 sm:block" />
            <h2 className={`${heading} relative`}>What Makes Us Unique</h2>

            <div role="list" className="relative mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              {UNIQUE.map((u, i) => (
                <Reveal key={u.label} delay={150 + i * 120}>
                  <div role="listitem" className="group flex flex-col items-center gap-3">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${u.bg}`}
                    >
                      {u.icon}
                    </span>
                    <span className="max-w-[8rem] text-xs font-medium leading-snug text-slate-700 sm:text-sm">
                      {u.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------- OUR VISION ---------- */}
        <Reveal delay={80}>
          <div className={row}>
            <Brush className="absolute -bottom-10 -left-10 w-72 rotate-180 sm:w-96" color="#9db88a" />
            <Brush className="absolute -bottom-12 left-24 hidden w-64 rotate-180 sm:block" color="#E9A98A" />
            <div className="relative flex items-start gap-4 sm:pl-6">
              <span className="ab-pulse flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#E8590C] shadow-md ring-2 ring-[#E8590C]/20">
                <EyeIcon />
              </span>
              <div>
                <h2 className={heading}>Our Vision</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  To become a trusted creative academy that inspires, empowers and nurtures individuals through art,
                  dance and yoga for a healthier, happier and more creative society.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
