import { useEffect, useRef, useState } from "react";

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
  // Side ke sajaawati patte (optional)
  leafLeftSrc?: string;
  leafRightSrc?: string;
}

// Section screen mein hai ya nahi (entered = pehli baar aaya, inView = abhi dikh raha hai)
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

function StarSvg({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`h-5 w-5 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// fill: 0 se 1 (0.5 = aadha star)
function Star({ fill, animate, delay }: { fill: number; animate: boolean; delay: number }) {
  return (
    <span
      className="relative inline-block h-5 w-5"
      style={{
        animation: animate ? `tm-star 0.5s ease-out ${delay}s both` : "none",
      }}
    >
      <StarSvg className="text-slate-200" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
      >
        <StarSvg className="text-amber-400" />
      </span>
    </span>
  );
}

const KEYFRAMES = `
@keyframes tm-star {
  0%   { transform: scale(0) rotate(-40deg); opacity: 0; }
  70%  { transform: scale(1.3) rotate(8deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); }
}
@keyframes tm-in {
  0%   { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes tm-bar {
  0%   { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
@media (max-width: 767px) {
  .tm-active { animation: tm-in 0.6s ease-out; }
}
@media (prefers-reduced-motion: reduce) {
  .tm-active, .tm-bar { animation: none !important; }
}
`;

export default function Testimonials({ leafLeftSrc, leafRightSrc }: TestimonialsProps) {
  const { ref, inView, entered } = useInView<HTMLElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Har 5 second mein agla review. Manual click par timer dobara 5s se shuru hota hai.
  useEffect(() => {
    if (!inView || paused) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % REVIEWS.length),
      REPEAT_MS
    );
    return () => clearTimeout(id);
  }, [inView, paused, active]);

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-pink-50 px-5 py-12 sm:px-8 md:py-20"
    >
      <style>{KEYFRAMES}</style>

      {/* Side ke patte (sirf bade screen par) */}
      {leafLeftSrc && (
        <img
          src={leafLeftSrc}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 left-0 hidden w-20 transition-opacity duration-1000 lg:block ${
            entered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {leafRightSrc && (
        <img
          src={leafRightSrc}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 right-0 hidden w-20 transition-opacity duration-1000 lg:block ${
            entered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div
          className={`text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
            entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-indigo-950 sm:text-4xl md:text-5xl">
            What Parents <span className="text-rose-500">Say</span>
          </h2>
          <span
            className={`mx-auto mt-2 block h-1 w-28 origin-center rounded-full bg-rose-500 transition-transform duration-700 ease-out motion-reduce:transition-none ${
              entered ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          />
        </div>

        {/* Cards: mobile par sirf active wala, md se upar teeno */}
        <div
          className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {REVIEWS.map((r, i) => {
            const isActive = i === active;
            return (
              // OUTER: sirf entrance animation (delay yahin)
              <div
                key={r.name}
                className={`transition-all duration-[900ms] motion-reduce:transition-none ${
                  isActive ? "block" : "hidden"
                } md:block ${
                  entered
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-14 scale-95 opacity-0"
                }`}
                style={{
                  transitionDelay: `${250 + i * 180}ms`,
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* INNER: hover + active spotlight (koi delay nahi) */}
                <article
                  className={`${
                    isActive ? "tm-active" : ""
                  } group relative h-full rounded-3xl bg-white p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-200/60 motion-reduce:transition-none ${
                    isActive
                      ? "shadow-xl shadow-rose-200/60 ring-2 ring-rose-300 md:-translate-y-2"
                      : "shadow-md"
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="select-none font-serif text-6xl font-black leading-[0.8] text-rose-500 transition-transform duration-300 group-hover:scale-110"
                    >
                      “
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-slate-800 sm:text-base">
                      {r.text}
                    </p>
                  </div>

                  {/* Stars: active hone par ek ke baad ek pop karte hain */}
                  <div className="mt-4 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        fill={r.rating - s}
                        animate={isActive && inView}
                        delay={s * 0.1}
                      />
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      loading="lazy"
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-100"
                    />
                    <div>
                      <p className="text-sm font-bold text-indigo-950">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Dots (click karke bhi review badal sakte ho) */}
        <div className="mt-8 flex justify-center gap-2">
          {REVIEWS.map((r, i) => (
            <button
              key={r.name}
              onClick={() => setActive(i)}
              aria-label={`Show review ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-rose-500" : "w-2.5 bg-rose-200 hover:bg-rose-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}