import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------
// Har class ka data (images outside link se)
// ---------------------------------------------------------------
interface ClassItem {
  title: string;
  description: string;
  image: string; // card ke upar wali badi photo
  icon: string; // gol icon (photo ke neeche overlap hota hai)
  iconBg: string; // icon ke gol ka background + border
  to: string; // "Learn More" kahan le jaayega
}

const CLASSES: ClassItem[] = [
  {
    title: "Drawing Class",
    description: "Encourage imagination and creative thinking through art.",
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790581017/ChatGPT_Image_Sep_28_2026_01_06_38_PM_lvqhge.png",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790579971/ChatGPT_Image_Sep_28__2026__12_46_50_PM-removebg-preview_hqicpz.png",
    iconBg: "bg-amber-50 border-amber-200",
    to: "/#contact",
  },
  {
    title: "Dance Class",
    description: "Build confidence, discipline and grace through dance.",
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790581290/ChatGPT_Image_Sep_28_2026_01_10_19_PM_zjz6lz.png",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790580168/ChatGPT_Image_Sep_28__2026__12_50_55_PM-removebg-preview_nf3sn7.png",
    iconBg: "bg-rose-50 border-rose-200",
    to: "/#contact",
  },
  {
    title: "Yoga Class",
    description: "Improve focus, flexibility and overall well-being with yoga.",
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790580684/ChatGPT_Image_Sep_28_2026_01_00_21_PM_x80zy6.png",
    icon: "https://res.cloudinary.com/dquki4xol/image/upload/v1790580272/ChatGPT_Image_Sep_28__2026__12_53_25_PM-removebg-preview_hmzrlw.png",
    iconBg: "bg-emerald-50 border-emerald-200",
    to: "/#contact",
  },
];

interface ClassesProps {
  // Side ke sajaawati patte (optional)
  leafLeftSrc?: string;
  leafRightSrc?: string;
}

// Section screen mein aate hi ek baar animation chalane ke liye
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

// Sirf is component ke keyframes (tailwind config badalne ki zaroorat nahi)
const KEYFRAMES = `
@keyframes classes-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@keyframes classes-shine {
  0%   { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(260%) skewX(-20deg); }
}
@media (prefers-reduced-motion: reduce) {
  .classes-float, .classes-shine { animation: none !important; }
}
`;

export default function Classes({ leafLeftSrc, leafRightSrc }: ClassesProps) {
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section
      id="classes"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-[#FFF8F3] px-5 py-12 sm:px-8 md:py-20"
    >
      <style>{KEYFRAMES}</style>

      {/* Side ke patte (sirf bade screen par) */}
      {leafLeftSrc && (
        <img
          src={leafLeftSrc}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-4 left-0 hidden w-24 transition-opacity duration-1000 lg:block ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {leafRightSrc && (
        <img
          src={leafRightSrc}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-4 hidden w-24 transition-opacity duration-1000 lg:block ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div
          className={`text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-indigo-950 sm:text-4xl md:text-5xl">
            Our <span className="text-rose-500">Classes</span>
          </h2>
          <span
            className={`mx-auto mt-2 block h-1 rounded-full bg-rose-500 transition-all duration-700 ease-out motion-reduce:transition-none ${
              visible ? "w-24" : "w-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          />
        </div>

        {/* Cards: mobile 1, tablet 2, desktop 3 */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {CLASSES.map((item, i) => (
            // OUTER wrapper: sirf entrance animation (delay yahin lagta hai)
            <div
              key={item.title}
              className={`transition-all duration-[900ms] motion-reduce:transition-none ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-14 scale-95 opacity-0"
              } ${
                i === 2
                  ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-auto"
                  : ""
              }`}
              style={{
                transitionDelay: `${250 + i * 180}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* INNER card: sirf hover (koi delay nahi, isliye turant respond karega) */}
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-200/60 motion-reduce:transition-none motion-reduce:hover:transform-none">
                {/* Photo: zoom + shine sweep */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 opacity-0 group-hover:opacity-100 group-hover:[animation:classes-shine_0.9s_ease-out] classes-shine" />
                </div>

                {/* Icon: halka float + hover par pop */}
                <div className="-mt-10 px-5">
                  <div
                    className="classes-float inline-block"
                    style={{
                      animation: `classes-float 3s ease-in-out ${i * 0.4}s infinite`,
                    }}
                  >
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-sm transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 motion-reduce:transition-none ${item.iconBg}`}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="h-11 w-11 object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Text + button */}
                <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-2 text-center">
                  <h3 className="text-lg font-bold text-indigo-950 transition-colors duration-300 group-hover:text-rose-600">
                    {item.title}
                  </h3>
                  <p className="mb-5 mt-1 max-w-xs text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                  <Link
                    to={item.to}
                    className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-600 hover:shadow-lg active:scale-95"
                  >
                    Learn More
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}