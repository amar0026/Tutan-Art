// src/Pages/ClassDetails.tsx
// React + Vite + Tailwind CSS (TypeScript)
// Route: <Route path="/classes/:slug" element={<ClassDetails />} />   (slug: dance | drawing | yoga)
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/* ---------- types ---------- */

type Mode = "Online" | "Offline";
type TabKey = "Overview" | "What You Will Learn" | "Class Timings" | "Instructor" | "Reviews";

interface Batch {
  id: string;
  label: string;
  mode: Mode;
}

interface ClassData {
  title: string;
  tagline: string;
  price: number;
  about: string[];
  info: { icon: "kids" | "level" | "mode" | "time"; text: string }[];
  learn: string[];
  batches: Batch[];
  instructor: { name: string; role: string; bio: string };
  reviews: { name: string; role: string; text: string }[];
  /* 👉 Images ke outside links yahan paste karo (khali ho to gradient placeholder dikhega) */
  heroImg: string; // bada image (right side)
  gallery: [string, string, string]; // [video thumbnail, image 2, image 3]
  videoUrl?: string; // 👉 .mp4 link — play dabane par modal mein chalega
}

/* ---------- data (sample content — apna content yahan badlo) ---------- */

const CLASS_DATA: Record<string, ClassData> = {
  dance: {
    title: "Dance Classes",
    tagline: "Discover the beauty of movement, rhythm and expression.",
    price: 1500,
    about: [
      "Our dance classes are designed for all age groups, from beginners to advanced learners. Learn classical and contemporary dance forms in a fun and supportive environment.",
      "Each session blends warm-up, technique, choreography and expression, so students build strength, grace and confidence step by step.",
    ],
    info: [
      { icon: "kids", text: "Kids (5+ Years)" },
      { icon: "level", text: "Beginner to Advanced" },
      { icon: "mode", text: "Online & Offline" },
      { icon: "time", text: "Flexible Timing" },
    ],
    learn: [
      "Classical and contemporary dance basics",
      "Rhythm, posture and body awareness",
      "Expressions (abhinaya) and storytelling",
      "Choreography and stage confidence",
      "Flexibility, stamina and balance",
    ],
    batches: [
      { id: "d1", label: "Mon, Wed, Fri \u2022 5:00 PM - 6:00 PM", mode: "Offline" },
      { id: "d2", label: "Tue, Thu \u2022 6:00 PM - 7:00 PM", mode: "Offline" },
      { id: "d3", label: "Weekend Batch \u2022 10:00 AM - 11:00 AM", mode: "Offline" },
    ],
    instructor: {
      name: "Lead Dance Instructor",
      role: "Classical & Contemporary",
      bio: "Years of stage and teaching experience, with a patient, encouraging style for every age and level.",
    },
    reviews: [
      { name: "Ananya Sharma", role: "Student", text: "I feel so much more confident on stage now. The classes are well-structured and fun." },
      { name: "Neha Kapoor", role: "Parent", text: "My daughter looks forward to every class. The teachers are patient and caring." },
    ],
    heroImg: "",
    gallery: ["", "", ""],
  },
  drawing: {
    title: "Drawing Classes",
    tagline: "Learn different drawing techniques and bring your imagination to life.",
    price: 1000,
    about: [
      "Our drawing classes help students explore sketching, shading, colour and composition in a relaxed, creative studio.",
      "From first lines to finished artwork, every learner gets personal guidance at their own pace.",
    ],
    info: [
      { icon: "kids", text: "Kids (5+ Years)" },
      { icon: "level", text: "Beginner to Advanced" },
      { icon: "mode", text: "Online & Offline" },
      { icon: "time", text: "Flexible Timing" },
    ],
    learn: [
      "Sketching, lines and shapes",
      "Shading and light techniques",
      "Colour mixing with pencil, pastel and paint",
      "Composition and perspective",
      "Creating a personal art portfolio",
    ],
    batches: [
      { id: "r1", label: "Mon, Wed \u2022 4:00 PM - 5:00 PM", mode: "Offline" },
      { id: "r2", label: "Tue, Thu \u2022 5:00 PM - 6:00 PM", mode: "Online" },
      { id: "r3", label: "Weekend Batch \u2022 11:00 AM - 12:00 PM", mode: "Offline" },
    ],
    instructor: {
      name: "Lead Art Instructor",
      role: "Drawing & Painting",
      bio: "A supportive mentor who helps every student find their own style and build confidence in their art.",
    },
    reviews: [
      { name: "Aarohi Mehta", role: "Student", text: "The teachers make learning so much fun and easy to understand." },
      { name: "Riya Patel", role: "Student", text: "I learned so many new techniques and feel more confident about my art." },
    ],
    heroImg: "",
    gallery: ["", "", ""],
  },
  yoga: {
    title: "Yoga Classes",
    tagline: "Find balance, strength and inner peace through guided yoga.",
    price: 1200,
    about: [
      "Our yoga classes bring together breath, movement and mindfulness for people of all age groups and fitness levels.",
      "Classes are calm and guided, helping you build flexibility, strength and a steady mind.",
    ],
    info: [
      { icon: "kids", text: "All Age Groups" },
      { icon: "level", text: "Beginner to Advanced" },
      { icon: "mode", text: "Online & Offline" },
      { icon: "time", text: "Flexible Timing" },
    ],
    learn: [
      "Foundational asanas and alignment",
      "Breathing techniques (pranayama)",
      "Relaxation and meditation",
      "Flexibility, strength and posture",
      "Daily habits for a calmer mind",
    ],
    batches: [
      { id: "y1", label: "Mon, Wed, Fri \u2022 6:30 AM - 7:30 AM", mode: "Offline" },
      { id: "y2", label: "Tue, Thu \u2022 7:00 PM - 8:00 PM", mode: "Online" },
      { id: "y3", label: "Weekend Batch \u2022 8:00 AM - 9:00 AM", mode: "Offline" },
    ],
    instructor: {
      name: "Lead Yoga Instructor",
      role: "Hatha & Mindfulness",
      bio: "Guides every session with calm focus, adapting poses to each person's pace and comfort.",
    },
    reviews: [
      { name: "Isha Verma", role: "Adult Learner", text: "The yoga classes help me stay calm, focused and positive." },
      { name: "Meera Iyer", role: "Adult Learner", text: "A perfect blend of creativity and mindfulness. Refreshing and well planned." },
    ],
    heroImg: "",
    gallery: ["", "", ""],
  },
};

const TABS: TabKey[] = ["Overview", "What You Will Learn", "Class Timings", "Instructor", "Reviews"];

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

const BackIcon = () => (
  <svg width="16" height="16" {...ic} className="transition-transform duration-300 group-hover:-translate-x-1">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" {...ic} className="transition-transform duration-300 group-hover:translate-x-1">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.140v13.720a1 1 0 0 0 1.520.850l11.100-6.860a1 1 0 0 0 0-1.700L9.520 4.290A1 1 0 0 0 8 5.140z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" {...ic} strokeWidth={2.4}>
    <polyline points="5 12 10 17 19 7" />
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#E8590C" aria-hidden="true">
    <path d="M12 2l3.090 6.260L22 9.270l-5 4.870 1.180 6.880L12 17.770l-6.180 3.250L7 14.140 2 9.270l6.910-1.010L12 2z" />
  </svg>
);

const infoIcon: Record<string, ReactNode> = {
  kids: (
    <svg width="16" height="16" {...ic}>
      <circle cx="12" cy="8" r="3.500" />
      <path d="M5 20c0-3.500 3-6 7-6s7 2.500 7 6" />
    </svg>
  ),
  level: (
    <svg width="16" height="16" {...ic}>
      <path d="M2 9l10-5 10 5-10 5L2 9z" />
      <path d="M6 11v5c3 2.500 9 2.500 12 0v-5" />
    </svg>
  ),
  mode: (
    <svg width="16" height="16" {...ic}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  time: (
    <svg width="16" height="16" {...ic}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.500 14" />
    </svg>
  ),
};

/* ---------- small pieces ---------- */

function Img({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <span
      className={`cd-serif flex items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] text-lg font-bold text-white/90 ${className}`}
    >
      {label}
    </span>
  );
}

const rupee = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;

/* ---------- details (slug badalte hi state reset ho, isliye alag component) ---------- */

function Details({ slug, data }: { slug: string; data: ClassData }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("Overview");
  const [batchId, setBatchId] = useState(data.batches[1]?.id ?? data.batches[0].id);
  const [activeImg, setActiveImg] = useState<string>(data.heroImg);
  const [video, setVideo] = useState(false);
  const [added, setAdded] = useState(false);

  const batch = data.batches.find((b) => b.id === batchId) ?? data.batches[0];

  // Video modal: Esc se band + scroll lock
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [video]);

  // "Added to cart" message 2.5s baad hat jaye
  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 2500);
    return () => window.clearTimeout(t);
  }, [added]);

  const enroll = () => navigate("/payment", { state: { classId: slug, batch: batch.label, price: data.price } });

  const panel = "rounded-2xl border border-[#EBDCC6] bg-[#FFFBF4] p-5 shadow-sm sm:p-6";

  return (
    <div className="cd-sans bg-[#F6EBDC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap');

        .cd-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .cd-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes cd-drop      { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cd-line-down { from { opacity: 0; transform: translateY(-110%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cd-reveal    { from { clip-path: inset(0 0 100% 0); opacity: 0; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
        @keyframes cd-modal     { from { opacity: 0; transform: translateY(-12px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cd-pop       { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

        .cd-drop   { animation: cd-drop .7s cubic-bezier(.2,.8,.2,1) backwards; }
        .cd-line   { display: block; overflow: hidden; }
        .cd-line > span { display: block; animation: cd-line-down .9s cubic-bezier(.2,.8,.2,1) backwards; }
        .cd-reveal { animation: cd-reveal 1.3s cubic-bezier(.6,0,.2,1) backwards; }
        .cd-modal  { animation: cd-modal .35s cubic-bezier(.2,.8,.2,1) both; }
        .cd-pop    { animation: cd-pop .3s ease-out both; }

        /* Hero image: mobile par normal, desktop par right side + left fade */
        .cd-fade { background: linear-gradient(to bottom, rgba(246,235,220,0) 55%, #F6EBDC 100%); }
        @media (min-width: 1024px) {
          .cd-fade { background: linear-gradient(to right, #F6EBDC 0%, rgba(246,235,220,.35) 30%, rgba(246,235,220,0) 55%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cd-drop, .cd-line > span, .cd-reveal, .cd-modal, .cd-pop { animation: none !important; }
        }
      `}</style>

      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-hidden">
        {/* Hero image */}
        <div
          className="cd-reveal relative order-1 aspect-[4/3] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:aspect-auto lg:w-[58%]"
          style={{ animationDelay: "0.3s" }}
        >
          <Img src={activeImg} alt={data.title} label={data.title} className="h-full w-full lg:object-[70%_center]" />
          <div className="cd-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col px-5 pb-8 pt-6 sm:px-8 lg:min-h-[420px] lg:px-12 lg:pt-8">
          <Link
            to="/classes"
            className="cd-drop group inline-flex w-fit items-center gap-2 text-sm font-medium text-[#C2571A] transition-colors hover:text-[#A84812]"
            style={{ animationDelay: "0.4s" }}
          >
            <BackIcon /> Back to Classes
          </Link>

          <h1 className="cd-serif mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-wide text-slate-800 sm:text-5xl lg:text-6xl">
            <span className="cd-line">
              <span style={{ animationDelay: "0.5s" }}>{data.title}</span>
            </span>
          </h1>
          <p className="cd-drop mt-2 max-w-sm text-sm leading-relaxed text-slate-700 sm:text-base" style={{ animationDelay: "0.8s" }}>
            {data.tagline}
          </p>

          {/* Gallery + info card */}
          <div className="cd-drop mt-5 flex flex-wrap items-stretch gap-3 sm:gap-4" style={{ animationDelay: "1s" }}>
            <div className="grid h-32 w-full max-w-[17rem] grid-cols-[1.25fr_1fr] gap-2 sm:h-36">
              {/* Video tile */}
              <button
                type="button"
                onClick={() => setVideo(true)}
                aria-label="Play class video"
                className="group relative row-span-2 overflow-hidden rounded-xl border border-white/80 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
              >
                <Img src={data.gallery[0]} alt="Class video" label="Video" className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 pl-0.5 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E8590C]">
                    <PlayIcon />
                  </span>
                </span>
              </button>

              {/* Two thumbnails — click par bada image badal jaata hai */}
              {[data.gallery[1], data.gallery[2]].map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => g && setActiveImg(g)}
                  aria-label={`Show photo ${i + 1}`}
                  className="group overflow-hidden rounded-xl border border-white/80 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                >
                  <Img src={g} alt={`${data.title} photo ${i + 1}`} label={`${i + 1}`} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
                </button>
              ))}
            </div>

            <ul className="flex flex-col justify-center gap-2.5 rounded-xl border border-[#EBDCC6] bg-white/90 px-4 py-3 shadow-md backdrop-blur-sm">
              {data.info.map((it) => (
                <li key={it.text} className="flex items-center gap-2.5 text-xs text-slate-700 sm:text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FBE4D2] text-[#E8590C]">
                    {infoIcon[it.icon]}
                  </span>
                  {it.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- TABS + CONTENT ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8 lg:px-12">
        <div
          className="-mx-4 flex overflow-x-auto border-b border-[#E2D3BC] px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-200 sm:px-6 ${
                tab === t ? "text-[#E8590C]" : "text-slate-600 hover:text-[#E8590C]"
              }`}
            >
              {t}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#E8590C] transition-transform duration-300 ${
                  tab === t ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: tab content (key badalte hi dobara animate) */}
          <div key={tab} className="cd-pop">
            {tab === "Overview" && (
              <div className={panel}>
                <h2 className="cd-serif text-2xl font-bold text-slate-800">About This Class</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  {data.about.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {tab === "What You Will Learn" && (
              <div className={panel}>
                <h2 className="cd-serif text-2xl font-bold text-slate-800">What You Will Learn</h2>
                <ul className="mt-3 space-y-2.5">
                  {data.learn.map((l) => (
                    <li key={l} className="flex items-start gap-3 text-sm text-slate-700 sm:text-[15px]">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8590C] text-white">
                        <CheckIcon />
                      </span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "Class Timings" && (
              <div className={panel}>
                <h2 className="cd-serif text-2xl font-bold text-slate-800">Class Timings</h2>
                <ul className="mt-3 divide-y divide-[#EBDCC6]">
                  {data.batches.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3 py-3 text-sm text-slate-700">
                      <span>{b.label}</span>
                      <span className="shrink-0 rounded-full bg-[#FBE4D2] px-3 py-0.5 text-xs font-medium text-[#C2571A]">{b.mode}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "Instructor" && (
              <div className={`${panel} flex items-start gap-4`}>
                <span className="cd-serif flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F0C986] to-[#E9A98A] text-2xl font-bold text-white">
                  {data.instructor.name[0]}
                </span>
                <div>
                  <h2 className="cd-serif text-2xl font-bold text-slate-800">{data.instructor.name}</h2>
                  <p className="text-sm font-medium text-[#C2571A]">{data.instructor.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">{data.instructor.bio}</p>
                </div>
              </div>
            )}

            {tab === "Reviews" && (
              <div className="space-y-3">
                {data.reviews.map((r) => (
                  <div key={r.name} className={panel}>
                    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">&ldquo;{r.text}&rdquo;</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {r.name} <span className="font-normal text-slate-500">&bull; {r.role}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: batches + price + CTAs (hamesha dikhta hai) */}
          <aside className={`${panel} cd-drop h-fit`} style={{ animationDelay: "1.2s" }}>
            <h2 className="cd-serif text-2xl font-bold text-slate-800">Available Batches</h2>

            <div role="radiogroup" aria-label="Available batches" className="mt-3 space-y-2">
              {data.batches.map((b) => {
                const on = b.id === batchId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setBatchId(b.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-all duration-300 sm:text-sm ${
                      on
                        ? "border-[#E8590C] bg-[#FFF3EA] shadow-sm"
                        : "border-transparent bg-white/60 hover:border-[#E8590C]/40 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        on ? "border-[#E8590C]" : "border-slate-300"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full bg-[#E8590C] transition-transform duration-300 ${on ? "scale-100" : "scale-0"}`} />
                    </span>
                    <span className="text-slate-700">
                      {b.label} <span className="font-medium text-[#E8590C]">({b.mode})</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-3xl font-bold text-[#E8590C]">
              {rupee(data.price)} <span className="text-base font-medium text-slate-500">/ month</span>
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_1fr]">
              <button
                type="button"
                onClick={enroll}
                className="group flex items-center justify-center gap-2 rounded-xl bg-[#E8590C] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] hover:shadow-lg active:translate-y-0"
              >
                Enroll Now <ArrowIcon />
              </button>
              <button
                type="button"
                onClick={() => setAdded(true)}
                className="rounded-xl border-2 border-[#E8590C] bg-white px-5 py-3 text-sm font-semibold text-[#E8590C] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF3EA] active:translate-y-0"
              >
                Add to Cart
              </button>
            </div>

            <p role="status" className="mt-2 h-5 text-xs font-medium text-[#2F6B4F]">
              {added && <span className="cd-pop inline-block">{"\u2713"} Added to cart &mdash; {batch.label}</span>}
            </p>
          </aside>
        </div>
      </section>

      {/* ---------- VIDEO MODAL ---------- */}
      {video && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setVideo(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${data.title} video`}
        >
          <div className="cd-modal relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideo(false)}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 transition hover:bg-[#E8590C] hover:text-white"
            >
              {"\u2715"}
            </button>
            {data.videoUrl ? (
              <video src={data.videoUrl} controls autoPlay className="aspect-video w-full" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center p-6 text-center text-sm text-white/80">
                Is class ka video abhi add nahi hua. Data mein <code className="mx-1 rounded bg-white/10 px-1">videoUrl</code> daalo.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- route wrapper ---------- */

export default function ClassDetails() {
  const { slug = "" } = useParams();
  const data = CLASS_DATA[slug.toLowerCase()];

  if (!data) {
    return (
      <section className="bg-[#F6EBDC] px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Class not found</h1>
        <Link to="/classes" className="mt-4 inline-block font-medium text-[#C2571A] hover:underline">
          &larr; Back to Classes
        </Link>
      </section>
    );
  }

  return <Details key={slug} slug={slug.toLowerCase()} data={data} />;
}