import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

/* ---------- Banner images ke links yahan paste karo (optional) ---------- */
const ONLINE_IMG = ""; // <-- laptop + yoga wali image
const OFFLINE_IMG = ""; // <-- yoga mats wali image

/* ---------- Theme (Navbar + Hero + About jaisa) ---------- */
const CREAM = "#FBF6EE";
const TERRA = "#C2571A";
const BROWN = "#3B1F14";
const PEACH = "#F3D9BC";
const PEACH_DARK = "#EBC9A0";
const GREEN = "#2F4A3E";

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

function LaptopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-10 sm:w-10" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-10 sm:w-10" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

/* ---------- Data ---------- */
interface ClassItem {
  title: string;
  image: string;
  icon: ReactNode;
  to: string;
}

const CLASSES: ClassItem[] = [
  {
    title: "Drawing",
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790581017/ChatGPT_Image_Sep_28_2026_01_06_38_PM_lvqhge.png",
    icon: <PencilIcon />,
    to: "/#contact",
  },
  {
    title: "Dance",
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790581290/ChatGPT_Image_Sep_28_2026_01_10_19_PM_zjz6lz.png",
    icon: <DanceIcon />,
    to: "/#contact",
  },
  {
    title: "Yoga",
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790580684/ChatGPT_Image_Sep_28_2026_01_00_21_PM_x80zy6.png",
    icon: <LotusIcon />,
    to: "/#contact",
  },
];

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

/* ---------- Online / Offline banner panel ---------- */
interface PanelProps {
  img: string;
  color: string;
  icon: ReactNode;
  line1: string;
  line2: string;
  to: string;
  visible: boolean;
  delay: number;
  from: "left" | "right";
}

function BannerPanel({ img, color, icon, line1, line2, to, visible, delay, from }: PanelProps) {
  const hidden = from === "left" ? "-translate-x-10" : "translate-x-10";
  return (
    <div
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-x-0 opacity-100" : `${hidden} opacity-0`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link
        to={to}
        className="group relative flex min-h-[130px] items-center justify-center overflow-hidden sm:min-h-[150px] md:justify-end md:pr-[8%]"
        style={{ backgroundColor: color }}
      >
        {/* Photo */}
        {img && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${img})` }}
          />
        )}
        {/* Colour overlay: mobile par poora, desktop par right se left fade */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ backgroundColor: color, opacity: img ? 0.8 : 1 }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color}99 30%, ${color} 55%)`,
          }}
        />

        {/* Content */}
        <div className="relative flex items-center gap-4 py-6 sm:gap-5">
          <span className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">
            {icon}
          </span>
          <span className="h-12 w-px bg-white/50" />
          <span className="text-base font-semibold uppercase leading-snug tracking-[0.18em] text-white sm:text-lg">
            {line1}
            <br />
            {line2}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 -translate-x-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

export default function Classes() {
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section
      id="classes"
      ref={ref}
      className="scroll-mt-24 px-5 py-12 sm:px-8 md:py-16"
      style={{ backgroundColor: CREAM }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');
        .cls-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        @keyframes cls-pop {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cls-shine {
          from { transform: translateX(-120%) skewX(-20deg); }
          to   { transform: translateX(380%) skewX(-20deg); }
        }
        .cls-badge { opacity: 0; }
        .cls-badge.on { animation: cls-pop 0.6s cubic-bezier(.34,1.56,.64,1) both; }
        .cls-card:hover .cls-shine { animation: cls-shine 0.9s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .cls-badge { opacity: 1; }
          .cls-badge.on, .cls-card:hover .cls-shine { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-4xl">
        {/* ---------- Heading ---------- */}
        <div
          className={`text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2
            className="cls-serif text-2xl font-bold uppercase tracking-wide sm:text-3xl"
            style={{ color: BROWN }}
          >
            Our Classes
          </h2>
          <span
            className={`mx-auto mt-2 block h-0.5 rounded-full transition-all duration-700 ease-out motion-reduce:transition-none ${
              visible ? "w-14" : "w-0"
            }`}
            style={{ backgroundColor: TERRA, transitionDelay: "400ms" }}
          />
        </div>

        {/* ---------- Class cards ---------- */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 md:mt-10 md:gap-8">
          {CLASSES.map((c, i) => (
            <Link
              key={c.title}
              to={c.to}
              className={`cls-card group block transition-all duration-700 ease-out hover:-translate-y-2 motion-reduce:transition-none ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: visible ? `${300 + i * 150}ms` : "0ms" }}
            >
              {/* Photo */}
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-md transition-shadow duration-500 group-hover:shadow-xl"
                style={{ backgroundColor: PEACH }}
              >
                <img
                  src={c.image}
                  alt={`${c.title} class`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span className="cls-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/30 opacity-0 group-hover:opacity-100" />
              </div>

              {/* Label bar */}
              <div
                className="relative -mt-5 flex h-14 items-center rounded-xl pl-[4.5rem] pr-4 shadow-sm"
                style={{ backgroundColor: PEACH }}
              >
                <span
                  className={`cls-badge ${visible ? "on" : ""} absolute -top-5 left-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-transform duration-500 group-hover:rotate-[360deg]`}
                  style={{
                    backgroundColor: PEACH_DARK,
                    animationDelay: `${700 + i * 150}ms`,
                  }}
                >
                  {c.icon}
                </span>

                <h3
                  className="text-sm font-extrabold uppercase tracking-wide sm:text-[15px]"
                  style={{ color: BROWN }}
                >
                  {c.title}
                </h3>

                <svg
                  viewBox="0 0 24 24"
                  className="ml-auto h-5 w-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  fill="none"
                  stroke={TERRA}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* ---------- Online / Offline banner ---------- */}
        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl shadow-lg md:mt-12 md:grid-cols-2">
          <BannerPanel
            img={ONLINE_IMG}
            color={GREEN}
            icon={<LaptopIcon />}
            line1="Online"
            line2="Classes"
            to="/#contact"
            visible={visible}
            delay={800}
            from="left"
          />
          <BannerPanel
            img={OFFLINE_IMG}
            color={TERRA}
            icon={<PinIcon />}
            line1="Offline"
            line2="Classes"
            to="/#contact"
            visible={visible}
            delay={950}
            from="right"
          />
        </div>
      </div>
    </section>
  );
}