// src/Components/Testimonials.tsx
// React + Vite + Tailwind CSS (TypeScript)
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------
// Har review ka data. Avatar images outside link se — apne links daalo.
// rating mein 4.5 jaisa half star bhi chalega.
// ---------------------------------------------------------------
interface Review {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

const REVIEWS: Review[] = [
  {
    name: "Priya Sharma",
    role: "Parent",
    text: "A wonderful place for children to learn and grow. My daughter loves the dance classes!",
    rating: 4.5,
    avatar: "https://res.cloudinary.com/dquki4xol/image/upload/v1790593429/images_2_yah3zy.jpg",
  },
  {
    name: "Rahul Mehta",
    role: "Parent",
    text: "The drawing classes have brought out so much creativity in my son. Highly recommended!",
    rating: 4.5,
    avatar: "https://res.cloudinary.com/dquki4xol/image/upload/v1790593221/istockphoto-2186383983-612x612_glgyg5.jpg",
  },
  {
    name: "Sneha Verma",
    role: "Parent",
    text: "Yoga classes have improved my child's focus and confidence. Great environment!",
    rating: 5,
    avatar: "https://res.cloudinary.com/dquki4xol/image/upload/v1790593430/images_1_xljcy9.jpg",
  },
];

const REPEAT_MS = 5000; // har 5 second mein agla review highlight hoga

interface TestimonialsProps {
  viewAllTo?: string; // "View All Testimonials" button kahan le jaaye
  // Side ke sajaawati patte (optional) — na do to default SVG patte dikhenge
  leafLeftSrc?: string;
  leafRightSrc?: string;
}

/* ---------- section screen mein hai ya nahi ---------- */
// entered = pehli baar aaya, inView = abhi dikh raha hai
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      setEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView, entered };
}

/* ---------- stars ---------- */

function StarSvg({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`h-5 w-5 shrink-0 ${className}`} aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// fill: 0 se 1 (0.5 = aadha star)
function Star({ fill, animate, delay }: { fill: number; animate: boolean; delay: number }) {
  return (
    <span
      className={`relative inline-block h-5 w-5 ${animate ? "tm-star-pop" : ""}`}
      style={animate ? { animationDelay: `${delay}s` } : undefined}
    >
      <StarSvg className="text-[#E8DCC8]" />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}>
        <StarSvg className="text-[#E8590C]" />
      </span>
    </span>
  );
}

/* ---------- default side leaves ---------- */

function Leaf({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={`tm-sway pointer-events-none ${className}`}
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

/* ---------- styles ---------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap');

.tm-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
.tm-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

@keyframes tm-star {
  0%   { transform: scale(0) rotate(-40deg); opacity: 0; }
  70%  { transform: scale(1.3) rotate(8deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes tm-drop {
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tm-sway {
  0%, 100% { transform: rotate(-3deg); }
  50%      { transform: rotate(3deg); }
}

.tm-star-pop { animation: tm-star .5s ease-out both; }
.tm-sway     { transform-origin: 50% 100%; animation: tm-sway 5s ease-in-out infinite; }

/* mobile par naya active card upar se utarta hai */
@media (max-width: 767px) {
  .tm-active { animation: tm-drop .6s cubic-bezier(.2,.8,.2,1); }
}
@media (prefers-reduced-motion: reduce) {
  .tm-active, .tm-star-pop, .tm-sway { animation: none !important; }
}
`;

/* ---------- main ---------- */

export default function Testimonials({ viewAllTo = "/testimonial", leafLeftSrc, leafRightSrc }: TestimonialsProps) {
  const { ref, inView, entered } = useInView<HTMLElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = (n: number) => setActive((n + REVIEWS.length) % REVIEWS.length);

  // Har 5 second mein agla review. Manual click/swipe par timer dobara 5s se shuru hota hai.
  useEffect(() => {
    if (!inView || paused) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % REVIEWS.length), REPEAT_MS);
    return () => window.clearTimeout(id);
  }, [inView, paused, active]);

  // Mobile swipe: left = next, right = previous
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="tm-sans relative overflow-hidden bg-[#F6EBDC] px-5 py-12 sm:px-8 md:py-20"
    >
      <style>{CSS}</style>

      {/* Side ke patte (sirf bade screen par) */}
      <div
        className={`pointer-events-none absolute bottom-0 left-2 hidden transition-opacity duration-1000 lg:block ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        {leafLeftSrc ? <img src={leafLeftSrc} alt="" aria-hidden="true" className="w-20" /> : <Leaf className="h-40 w-16" />}
      </div>
      <div
        className={`pointer-events-none absolute bottom-0 right-2 hidden transition-opacity duration-1000 lg:block ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        {leafRightSrc ? <img src={leafRightSrc} alt="" aria-hidden="true" className="w-20" /> : <Leaf className="h-40 w-16" flip />}
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div
          className={`text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
            entered ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}
        >
          <h2 className="tm-serif text-3xl font-bold uppercase tracking-wide text-slate-800 sm:text-4xl md:text-5xl">
            What Parents <span className="text-[#C2571A]">Say</span>
          </h2>
          <span
            className={`mx-auto mt-3 block h-0.5 origin-center rounded-full bg-[#C2571A] transition-all duration-700 ease-out motion-reduce:transition-none ${
              entered ? "w-16" : "w-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          />
        </div>

        {/* Cards: mobile par sirf active wala, md se upar teeno */}
        <div
          className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {REVIEWS.map((r, i) => {
            const isActive = i === active;
            return (
              // OUTER: sirf entrance animation (upar se neeche, delay yahin)
              <div
                key={r.name}
                className={`transition-all duration-[900ms] motion-reduce:transition-none ${
                  isActive ? "block" : "hidden"
                } md:block ${entered ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
                style={{
                  transitionDelay: entered ? `${250 + i * 180}ms` : "0ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* INNER: hover + active spotlight (koi delay nahi) */}
                <article
                  className={`${
                    isActive ? "tm-active" : ""
                  } group relative h-full rounded-2xl border bg-[#FFFBF4] p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#C2571A]/15 motion-reduce:transition-none ${
                    isActive
                      ? "border-[#E8590C]/50 shadow-lg shadow-[#C2571A]/15 md:-translate-y-1.5"
                      : "border-[#EBDCC6] shadow-sm"
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="tm-serif select-none text-6xl font-bold leading-[0.8] text-[#E8590C] transition-transform duration-300 group-hover:scale-110"
                    >
                      &ldquo;
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{r.text}</p>
                  </div>

                  {/* Stars: active hone par ek ke baad ek pop karte hain */}
                  <div className="mt-4 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} fill={r.rating - s} animate={isActive && inView} delay={s * 0.1} />
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      loading="lazy"
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-[#EBDCC6]"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Dots (click karke bhi review badal sakte ho) */}
        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Choose review">
          {REVIEWS.map((r, i) => (
            <button
              key={r.name}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              aria-label={`Show review ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[#C2571A]" : "w-2.5 bg-[#E2D3BC] hover:bg-[#C2571A]/50"
              }`}
            />
          ))}
        </div>

        {/* View all → Testimonial page */}
        <div
          className={`mt-8 flex justify-center transition-all duration-700 ease-out motion-reduce:transition-none ${
            entered ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: entered ? "900ms" : "0ms" }}
        >
          <Link
            to={viewAllTo}
            className="group inline-flex items-center gap-2 rounded-xl bg-[#D70810] px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A84812] hover:shadow-lg active:translate-y-0"
          >
            View All Testimonials
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}