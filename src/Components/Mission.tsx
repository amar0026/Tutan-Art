import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ---------- Theme (Navbar + Hero + About jaisa) ---------- */
const BG = "#FBEEDD";
const TERRA = "#C2571A";
const BROWN = "#3B1F14";
const BRUSH = "#FAD9A4";
const SCRIPT_RED = "#A63D12";

// CSS variable (--d) ko type-safe tarike se set karne ke liye
const cssVar = (ms: number) => ({ "--d": `${ms}ms` } as CSSProperties);

/* ---------- Section screen mein aate hi ek baar animation ---------- */
function useInView<T extends HTMLElement>(threshold = 0.3) {
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

/* ---------- Target icon (rings aur arrow draw hote hain) ---------- */
function TargetIcon() {
  const d = cssVar;
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-full w-full"
      fill="none"
      stroke={TERRA}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle className="m-draw" pathLength={1} style={d(100)} cx="30" cy="34" r="25" />
      <circle className="m-draw" pathLength={1} style={d(300)} cx="30" cy="34" r="16" />
      <circle className="m-draw" pathLength={1} style={d(500)} cx="30" cy="34" r="7" />
      {/* Arrow */}
      <g className="m-arrow">
        <line className="m-draw" pathLength={1} style={d(800)} x1="30" y1="34" x2="55" y2="9" />
        <path
          className="m-draw"
          pathLength={1}
          style={d(1000)}
          d="M46 8l1-6 6 6 6 1-6 5-5-1z"
          fill={TERRA}
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

/* ---------- Leaf branch (stem aur leaves draw hote hain) ---------- */
function LeafBranch() {
  const d = cssVar;
  return (
    <svg
      viewBox="0 0 60 130"
      className="h-full w-full"
      fill="none"
      stroke={BROWN}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="m-draw" pathLength={1} style={d(1300)} d="M20 126C22 90 30 52 46 6" />
      <path className="m-draw" pathLength={1} style={d(1550)} d="M24 100C12 96 7 86 9 76c11 2 17 12 15 24Z" />
      <path className="m-draw" pathLength={1} style={d(1650)} d="M26 84c10-2 18-10 20-20-11 1-19 9-20 20Z" />
      <path className="m-draw" pathLength={1} style={d(1750)} d="M30 66C20 62 15 52 17 43c10 2 16 12 13 23Z" />
      <path className="m-draw" pathLength={1} style={d(1850)} d="M35 50c9-2 16-9 18-18-10 1-17 8-18 18Z" />
      <path className="m-draw" pathLength={1} style={d(1950)} d="M40 30C32 26 28 18 30 10c8 2 13 10 10 20Z" />
    </svg>
  );
}

export default function Mission() {
  const { ref, visible } = useInView<HTMLElement>(0.3);

  // Staggered reveal helper
  const reveal = (delay = 0, from: "left" | "right" | "up" = "up") => {
    const hidden =
      from === "left" ? "-translate-x-8" : from === "right" ? "translate-x-8" : "translate-y-6";
    return {
      className: `transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : `${hidden} opacity-0`
      }`,
      style: { transitionDelay: `${delay}ms` } as CSSProperties,
    };
  };

  const iconReveal = reveal(0, "left");
  const titleReveal = reveal(150, "up");
  const textReveal = reveal(400, "up");
  const rightReveal = reveal(300, "right");

  return (
    <section
      id="mission"
      ref={ref}
      className={`relative scroll-mt-24 overflow-hidden px-5 py-16 sm:px-8 md:py-24 lg:py-28 ${
        visible ? "on" : ""
      }`}
      style={{ backgroundColor: BG }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Kaushan+Script&display=swap');
        .m-serif  { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .m-script { font-family: 'Kaushan Script', 'Brush Script MT', cursive; }

        .m-draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .on .m-draw { animation: m-draw 1s ease-out forwards; animation-delay: var(--d, 0ms); }
        @keyframes m-draw { to { stroke-dashoffset: 0; } }

        .on .m-arrow { animation: m-nudge 3.5s ease-in-out 2.4s infinite; transform-origin: 30px 34px; }
        @keyframes m-nudge { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-6deg); } }

        .m-line { opacity: 0; transform: translateY(14px); }
        .on .m-line { animation: m-line-in 0.7s cubic-bezier(.22,1,.36,1) forwards; animation-delay: var(--d, 0ms); }
        @keyframes m-line-in { to { opacity: 1; transform: translateY(0); } }

        .on .m-float { animation: m-float 5s ease-in-out 2s infinite; }
        @keyframes m-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .on .m-sway { animation: m-sway 5s ease-in-out 2.4s infinite; transform-origin: bottom center; }
        @keyframes m-sway { 0%,100% { transform: rotate(0); } 50% { transform: rotate(2.5deg); } }

        @media (prefers-reduced-motion: reduce) {
          .m-draw { stroke-dashoffset: 0; animation: none !important; }
          .m-line { opacity: 1; transform: none; animation: none !important; }
          .m-arrow, .m-float, .m-sway { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14 lg:gap-20">
        {/* ---------- Left: icon + text ---------- */}
        <div className="flex items-start gap-5 sm:gap-8">
          <div
            className={`h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-28 lg:w-28 ${iconReveal.className}`}
            style={iconReveal.style}
          >
            <TargetIcon />
          </div>

          <div>
            <h2
              className={`m-serif text-3xl font-bold uppercase tracking-wide sm:text-4xl lg:text-5xl ${titleReveal.className}`}
              style={{ ...titleReveal.style, color: BROWN }}
            >
              Our Mission
            </h2>

            {/* Underline jo width mein grow karti hai */}
            <span
              className={`mt-3 block h-[3px] rounded-full transition-all duration-700 ease-out motion-reduce:transition-none ${
                visible ? "w-16 lg:w-20" : "w-0"
              }`}
              style={{ backgroundColor: TERRA, transitionDelay: "450ms" }}
            />

            <p
              className={`mt-5 max-w-lg text-base leading-relaxed text-[#4A3A31] sm:text-lg lg:mt-6 lg:text-xl lg:leading-relaxed ${textReveal.className}`}
              style={textReveal.style}
            >
              To inspire creativity, build confidence and promote holistic well-being through art,
              movement and mindfulness.
            </p>
          </div>
        </div>

        {/* ---------- Right: brush stroke + script text ---------- */}
        <div
          className={`relative mx-auto aspect-[400/230] w-full max-w-md md:max-w-none ${rightReveal.className}`}
          style={rightReveal.style}
        >
          {/* Brush stroke (left se right wipe hota hai) */}
          <svg
            viewBox="0 0 400 230"
            className="absolute inset-0 h-full w-full transition-[clip-path] duration-[1300ms] ease-out motion-reduce:transition-none"
            style={{
              clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transitionDelay: "500ms",
            }}
            aria-hidden="true"
          >
            <defs>
              <filter id="brush-rough" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.015 0.22"
                  numOctaves="2"
                  seed="4"
                  result="n"
                />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="16" />
              </filter>
            </defs>
            <g filter="url(#brush-rough)" fill={BRUSH}>
              <path d="M26 78C70 48 130 58 190 42c70-18 150-8 190 22 12 36 2 84-14 112-42 22-118 14-178 24-60 10-120-8-156-40-12-30-14-52-6-82Z" />
              <path
                opacity="0.55"
                d="M40 60c50-22 120-14 190-26 50-8 110-4 140 10-40 4-90 18-150 22-60 4-130 4-180-6Z"
              />
            </g>
          </svg>

          {/* Script text */}
          <div className="absolute inset-0 flex items-center justify-center pr-6 sm:pr-10">
            <div className="m-float">
              <div className="text-center" style={{ transform: "rotate(-8deg)" }}>
                {["Create", "Move", "Be Well"].map((line, i) => (
                  <span
                    key={line}
                    className="m-script m-line block text-[2.6rem] leading-[1.05] sm:text-[3.4rem] md:text-[3rem] lg:text-[4rem]"
                    style={{ color: SCRIPT_RED, ...cssVar(1000 + i * 250) }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Leaf branch */}
          <div className="m-sway absolute -right-1 bottom-[8%] h-[58%] w-[14%] sm:right-1 md:right-0">
            <LeafBranch />
          </div>
        </div>
      </div>
    </section>
  );
}