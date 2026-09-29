import { useEffect, useState } from "react";

interface HeroProps {
  groupImg?: string;
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <circle cx="17" cy="9" r="2.8" />
      <path d="M15.5 13.2c2.9.4 5 2.9 5 6.3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DB2777" strokeWidth="2">
      <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#DB2777">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <UsersIcon />,
    bg: "bg-blue-100",
    title: "Expert Instructors",
    desc: "Learn from experienced and passionate teachers",
  },
  {
    icon: <ShieldIcon />,
    bg: "bg-rose-100",
    title: "Safe & Friendly Environment",
    desc: "A positive space to grow and explore",
  },
  {
    icon: <ClockIcon />,
    bg: "bg-amber-100",
    title: "Flexible Batches",
    desc: "Convenient timings for all age groups",
  },
];

// ---------------------------------------------------------------
// Typewriter: text type hota hai, thodi der rukta hai, fir erase
// hokar dobara type hota hai — poora cycle ~5 second ka hai.
// ---------------------------------------------------------------
const TYPE_WORDS = ["Creativity", "Confidence", "Wellness"];
const TYPE_SPEED = 90; // ek letter type hone mein (ms)
const ERASE_SPEED = 45; // ek letter erase hone mein (ms)
const HOLD_MS = 1800; // pura word type hone ke baad kitni der rukega

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(words[0]);
      return;
    }

    const current = words[wordIndex];
    let timeout: number;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          TYPE_SPEED
        );
      } else {
        timeout = window.setTimeout(() => setPhase("holding"), HOLD_MS);
      }
    } else if (phase === "holding") {
      timeout = window.setTimeout(() => setPhase("erasing"), 0);
    } else {
      if (text.length > 0) {
        timeout = window.setTimeout(
          () => setText(text.slice(0, -1)),
          ERASE_SPEED
        );
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => window.clearTimeout(timeout);
  }, [text, phase, wordIndex, words]);

  return text;
}

export default function Hero({
  groupImg = "https://res.cloudinary.com/dquki4xol/image/upload/v1790337365/ChatGPT_Image_Sep_25_2026_05_20_01_PM_km1c0t.png",
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const typed = useTypewriter(TYPE_WORDS);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Decorative soft glows */}
      <div className="pointer-events-none absolute -top-10 left-0 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] bg-[size:28px_28px] opacity-40" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-14 sm:px-10 sm:pt-16 lg:grid-cols-2">
        {/* Left column */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {/* Trust badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-600">
            <SparkleIcon />
            Trusted by 200+ families
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            <span className="text-blue-950">BREATHE.</span>{" "}
            <span className="text-rose-600">GROW.</span>
          </h1>

          {/* Typewriter line */}
          <p className="mt-4 min-h-[2.25rem] text-lg font-semibold text-blue-950 sm:text-xl">
            Nurturing{" "}
            <span className="relative text-rose-600">
              {typed}
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block w-[2px] translate-y-0.5 animate-[hero-caret_0.8s_steps(1)_infinite] bg-rose-600 align-middle motion-reduce:hidden"
                style={{ height: "1.1em" }}
              />
            </span>{" "}
            for a Brighter Tomorrow
          </p>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Art builds imagination, Dance builds confidence. Yoga builds a
            healthier, happier you.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center rounded-full bg-rose-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-lg active:translate-y-0 sm:text-base">
              Join Our Classes
            </button>
            <a
              href="/#about"
              className="text-sm font-semibold text-blue-950 underline decoration-rose-300 decoration-2 underline-offset-4 transition-colors hover:text-rose-600 sm:text-base"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* Right column - combined class group image */}
        <div
          className={`relative transition-all duration-700 ease-out delay-150 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="absolute inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-rose-100 via-amber-50 to-blue-100 blur-2xl" />
          <img
            src={groupImg}
            alt="Drawing, Dance and Yoga classes"
            className="h-auto w-full object-contain drop-shadow-xl transition-transform duration-300 ease-out hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Feature strip */}
      <div className="relative border-t border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3 sm:gap-8 sm:px-10">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-sm"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${f.bg}`}
              >
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-blue-950 sm:text-base">
                  {f.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hero-caret {
          0%, 49%  { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}