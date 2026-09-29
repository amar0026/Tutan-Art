import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------
// Har stat ka data. Icons outside link se — apne links yahan daalo.
// ---------------------------------------------------------------
interface StatItem {
  value: number; // count-up kahan tak jaayega
  suffix: string; // "+" ya "%"
  label: string;
  icon: string;
}

const STATS: StatItem[] = [
  {
    value: 200,
    suffix: "+",
    label: "Happy Students",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790591174/ChatGPT_Image_Sep_28__2026__03_40_08_PM-removebg-preview_ptxvgb.png",
  },
  {
    value: 5,
    suffix: "+",
    label: "Years of Experience",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790591176/ChatGPT_Image_Sep_28__2026__03_51_13_PM-removebg-preview_z2hh4d.png",
  },
  {
    value: 10,
    suffix: "+",
    label: "Expert Instructors",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790591179/ChatGPT_Image_Sep_28_2026_03_52_26_PM_muagbw.png",
  },
  {
    value: 100,
    suffix: "%",
    label: "Positive Learning Environment",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790591176/ChatGPT_Image_Sep_28__2026__03_53_22_PM-removebg-preview_sw28pj.png",
  },
];

const REPEAT_MS = 5000; // har 5 second mein animation dobara chalegi
const COUNT_MS = 2000; // ginti 0 se target tak kitni der mein pahunchegi

// Section screen mein hai ya nahi (entered = pehli baar aaya, inView = abhi dikh raha hai)
function useInView<T extends HTMLElement>(threshold = 0.3) {
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

// 0 se target tak ginti. `cycle` badalte hi phir se 0 se shuru hoti hai.
function CountUp({
  end,
  suffix,
  cycle,
  active,
}: {
  end: number;
  suffix: string;
  cycle: number;
  active: boolean;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(end);
      return;
    }

    let raf = 0;
    const start = performance.now();
    setN(0);

    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setN(Math.round(end * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [cycle, active, end]);

  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

const KEYFRAMES = `
@keyframes stats-pop {
  0%   { transform: scale(0.6) rotate(-8deg); opacity: 0.4; }
  60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); }
}
@media (prefers-reduced-motion: reduce) {
  .stats-pop { animation: none !important; }
}
`;

export default function Stats() {
  const { ref, inView, entered } = useInView<HTMLElement>();
  const [cycle, setCycle] = useState(0);

  // Jab tak section dikh raha hai, har 5 second mein cycle badlo
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCycle((c) => c + 1), REPEAT_MS);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section
      id="stats"
      ref={ref}
      className="bg-[#FFF8F3] px-5 py-8 sm:px-8 md:py-12"
    >
      <style>{KEYFRAMES}</style>

      {/* Bahar ka light blue bar */}
      <div
        className={`mx-auto max-w-6xl rounded-3xl bg-[#E3F4FF] px-4 py-6 shadow-sm transition-all duration-700 ease-out motion-reduce:transition-none sm:px-8 md:py-8 ${
          entered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Mobile 2x2, desktop 4 ek line mein */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-0">
          {STATS.map((item, i) => (
            <div
              key={item.label}
              className={`group flex items-center justify-center gap-3 md:px-4 ${
                i > 0 ? "md:border-l md:border-sky-200" : ""
              } transition-all duration-700 ease-out motion-reduce:transition-none ${
                entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              {/* key={cycle} se icon har cycle par dobara "pop" karta hai */}
              <div
                key={cycle}
                className="stats-pop shrink-0"
                style={{
                  animation: inView
                    ? `stats-pop 0.7s ease-out ${i * 0.12}s both`
                    : "none",
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 md:h-14 md:w-14"
                />
              </div>

              <div className="min-w-0 text-left">
                <p className="text-2xl font-bold leading-none text-indigo-950 sm:text-3xl">
                  <CountUp
                    end={item.value}
                    suffix={item.suffix}
                    cycle={cycle}
                    active={entered}
                  />
                </p>
                <p className="mt-1 max-w-[9rem] text-xs font-medium leading-snug text-slate-700 sm:text-sm">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

