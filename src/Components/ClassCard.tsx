import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/* 👉 Apni images ke outside links yahan paste karo (khali ho to gradient placeholder dikhega) */
const ONLINE_IMG: string = "https://res.cloudinary.com/dquki4xol/image/upload/v1791438321/Focused_Girl_Studying_on_Laptop_vhite8.png"; // "Live Online Classes" banner (ladki laptop ke saath)
const OFFLINE_IMG: string = "https://res.cloudinary.com/dquki4xol/image/upload/v1791438323/Rolled_Teal_and_Pink_Yoga_Mat_with_Plant_adzybo.png"; // "Offline Classes" banner (yoga mat + plant)

type Filter = "All" | "Drawing" | "Dance" | "Yoga" | "Online Classes" | "Offline Classes";
type Mode = "online" | "offline";

interface ClassItem {
  id: string;
  title: string;
  category: "Drawing" | "Dance" | "Yoga";
  desc: string;
  who: string; // pehla chip
  level: string; // doosra chip
  price: number;
  modes: Mode[];
  img: string; // 👉 card image ka outside link
  to: string; // "View Details" kahan jaaye
}

const CLASSES: ClassItem[] = [
  {
    id: "drawing",
    title: "Drawing Classes",
    category: "Drawing",
    desc: "Learn different drawing techniques and bring your imagination to life.",
    who: "Kids (5+ Years)",
    level: "Beginner to Advanced",
    price: 1000,
    modes: ["online", "offline"],
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666099/images_7_sjtlaz.jpg",
    to: "/ClassDetailspage",
  },
  {
    id: "dance",
    title: "Dance Classes",
    category: "Dance",
    desc: "Discover the beauty of movement, rhythm and expression.",
    who: "Kids (5+ Years)",
    level: "Beginner to Advanced",
    price: 1500,
    modes: ["online", "offline"],
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_5_fppmqi.jpg",
    to: "/ClassDetailspage",
  },
  {
    id: "yoga",
    title: "Yoga Classes",
    category: "Yoga",
    desc: "Find balance, strength and inner peace through guided yoga.",
    who: "All Age Groups",
    level: "Beginner to Advanced",
    price: 1200,
    modes: ["online", "offline"],
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666099/images_4_aehklx.jpg",
    to: "/ClassDetailspage",
  },
];

const ONLINE_LINK = "/signup"; // "Join Online Classes"
const OFFLINE_LINK = "/contact"; // "Explore Offline Classes"

/* ---------- icons ---------- */

const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const BrushIcon = () => (
  <svg width="16" height="16" {...ic}>
    <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" />
    <path d="M14 7l3 3" />
  </svg>
);
const DanceIcon = () => (
  <svg width="16" height="16" {...ic}>
    <circle cx="12" cy="4.500" r="1.800" />
    <path d="M12 7v6l-3 7M12 13l4 7M7 10l5-2 6 3" />
  </svg>
);
const LotusIcon = () => (
  <svg width="16" height="16" {...ic}>
    <path d="M12 4c2 2.500 2 6 0 9-2-3-2-6.500 0-9z" />
    <path d="M4 10c3 0 6 2 8 5-3 1-7 0-8-5zM20 10c-3 0-6 2-8 5 3 1 7 0 8-5z" />
    <path d="M6 19h12" />
  </svg>
);
const MonitorIcon = () => (
  <svg width="16" height="16" {...ic}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="16" height="16" {...ic}>
    <path d="M4 21V8l8-5 8 5v13" />
    <path d="M9 21v-6h6v6M4 21h16" />
  </svg>
);
const KidsIcon = () => (
  <svg width="14" height="14" {...ic}>
    <circle cx="12" cy="8" r="3.500" />
    <path d="M5 20c0-3.500 3-6 7-6s7 2.500 7 6" />
  </svg>
);
const CapIcon = () => (
  <svg width="14" height="14" {...ic}>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11v5c3 2.500 9 2.500 12 0v-5" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" {...ic} className="transition-transform duration-300 group-hover:translate-x-1">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FILTERS: { label: Filter; icon?: ReactNode }[] = [
  { label: "All" },
  { label: "Drawing", icon: <BrushIcon /> },
  { label: "Dance", icon: <DanceIcon /> },
  { label: "Yoga", icon: <LotusIcon /> },
  { label: "Online Classes", icon: <MonitorIcon /> },
  { label: "Offline Classes", icon: <BuildingIcon /> },
];

const rupee = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;

/* ---------- small pieces ---------- */

function Img({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <span
      className={`cl-serif flex items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] text-xl font-bold text-white/90 ${className}`}
    >
      {label}
    </span>
  );
}

function Chip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] leading-tight text-slate-600 sm:text-xs">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FBE4D2] text-[#E8590C]">
        {icon}
      </span>
      {text}
    </span>
  );
}

function ClassCard({ c, index }: { c: ClassItem; index: number }) {
  return (
    <article
      className="cl-card group flex flex-col overflow-hidden rounded-2xl border border-[#EBDCC6] bg-[#FFFBF4] p-2.5 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="overflow-hidden rounded-xl">
        <Img
          src={c.img}
          alt={c.title}
          label={c.category}
          className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <h3 className="cl-serif text-xl font-bold text-slate-800">{c.title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-600 sm:text-sm">{c.desc}</p>

        <div className="mt-3 flex items-center gap-4">
          <Chip icon={<KidsIcon />} text={c.who} />
          <Chip icon={<CapIcon />} text={c.level} />
        </div>

        <p className="mt-4 text-2xl font-bold text-[#E8590C]">
          {rupee(c.price)} <span className="text-sm font-medium text-slate-500">/ month</span>
        </p>

        <Link
          to={c.to}
          className="group/btn mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#D70810] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#C2571A] hover:shadow-lg active:scale-[0.98]"
        >
          View Details
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </article>
  );
}

/* ---------- main ---------- */

export default function ClassesSection() {
  const [filter, setFilter] = useState<Filter>("All");

  const list = CLASSES.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Online Classes") return c.modes.includes("online");
    if (filter === "Offline Classes") return c.modes.includes("offline");
    return c.category === filter;
  });

  return (
    <section id="classes-section" className="bg-[#F6EBDC] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap');

        .cl-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .cl-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes cl-drop {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cl-card   { animation: cl-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
        .cl-pills  { animation: cl-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
        .cl-banner { animation: cl-drop .7s cubic-bezier(.2,.8,.2,1) .35s backwards; }

        @media (prefers-reduced-motion: reduce) {
          .cl-card, .cl-pills, .cl-banner { animation: none !important; }
        }
      `}</style>

      <div className="cl-sans mx-auto max-w-6xl">
        {/* Filter pills (mobile par horizontal scroll) */}
        <div
          className="cl-pills -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter classes"
        >
          {FILTERS.map((f) => (
            <button
              key={f.label}
              role="tab"
              aria-selected={filter === f.label}
              onClick={() => setFilter(f.label)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-1.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
                filter === f.label
                  ? "border-[#C2571A] bg-[#C2571A] text-white shadow-md"
                  : "border-[#E2D3BC] bg-white text-slate-700 hover:border-[#E8590C] hover:text-[#E8590C]"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Class cards — filter badalte hi dobara animate hote hain */}
        <div key={filter} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {list.map((c, i) => (
            <ClassCard key={c.id} c={c} index={i} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-600">No classes found for this filter yet.</p>
        )}

        {/* Online / Offline banners */}
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:gap-5">
          {/* Live online */}
          <div className="cl-banner group relative flex items-center overflow-hidden rounded-2xl border border-[#EBDCC6] bg-[#FBF3E6] shadow-sm transition-shadow duration-300 hover:shadow-lg">
            <div className="w-2/5 shrink-0 self-stretch overflow-hidden sm:w-1/3">
              <Img
                src={ONLINE_IMG}
                alt="Live online classes"
                label="Online"
                className="h-full min-h-[150px] w-full transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="cl-serif text-lg font-bold uppercase tracking-wide text-slate-800 sm:text-xl">
                Live Online Classes
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Learn from expert instructors from anywhere.
              </p>
              <Link
                to={ONLINE_LINK}
                className="group/btn mt-3 inline-flex items-center gap-2 rounded-lg bg-[#D70810] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#C2571A] hover:shadow-lg active:scale-[0.98] sm:text-sm"
              >
                Join Online Classes
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>

          {/* Offline */}
          <div
            className="cl-banner group relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#EBDCC6] bg-[#FBF3E6] shadow-sm transition-shadow duration-300 hover:shadow-lg"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="p-4 sm:p-6">
              <h3 className="cl-serif text-lg font-bold uppercase tracking-wide text-slate-800 sm:text-xl">
                Offline Classes
              </h3>
              <p className="mt-1 max-w-56 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Join our studio and experience in-person learning.
              </p>
              <Link
                to={OFFLINE_LINK}
                className="group/btn mt-3 inline-flex items-center gap-2 rounded-lg bg-[#D70810] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#C2571A] hover:shadow-lg active:scale-[0.98] sm:text-sm"
              >
                Explore Offline Classes
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
            <div className="w-2/5 shrink-0 self-stretch overflow-hidden sm:w-1/3">
              <Img
                src={OFFLINE_IMG}
                alt="Offline classes at the studio"
                label="Offline"
                className="h-full min-h-[150px] w-full transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
