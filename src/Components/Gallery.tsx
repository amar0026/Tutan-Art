import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------
// Image links same hain. Jitni chaho utni add kar sakte ho,
// slider apne aap continuously scroll karta rahega.
// ---------------------------------------------------------------
interface GalleryItem {
  src: string;
  alt: string;
}

const GALLERY: GalleryItem[] = [
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_3_zjktdd.jpg", alt: "Boy drawing at his desk" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_5_fppmqi.jpg", alt: "Girls performing classical dance" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666099/images_4_aehklx.jpg", alt: "Child doing a yoga pose" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666099/images_7_sjtlaz.jpg", alt: "Children painting together" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_6_pe9pde.jpg", alt: "Girl performing classical dance" },
];

interface GalleryProps {
  buttonTo?: string;
  // Poora loop kitne seconds mein ho. Kam = tez slider.
  speedSeconds?: number;
}

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

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.gal-sans { font-family: 'Inter', system-ui, sans-serif; }

@keyframes gal-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes gal-shine {
  0%   { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(260%) skewX(-20deg); }
}
.gal-track { animation: gal-marquee var(--gal-speed, 30s) linear infinite; }
.gal-viewport:hover .gal-track,
.gal-viewport:focus-within .gal-track { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .gal-track { animation: none; }
  .gal-viewport { overflow-x: auto; }
}
`;

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Gallery({ buttonTo = "/gallery", speedSeconds = 30 }: GalleryProps) {
  const { ref, visible } = useInView<HTMLElement>();

  // Seamless loop ke liye list do baar render hoti hai
  const looped = [...GALLERY, ...GALLERY];

  return (
    <section
      id="gallery"
      ref={ref}
      className="gal-sans scroll-mt-24 overflow-hidden bg-[#FCF7F0] px-4 py-12 sm:px-6 md:py-16"
    >
      <style>{STYLES}</style>

      {/* Heading */}
      <div className="text-center">
        <h2
          className={`text-2xl font-bold tracking-wide text-[#1A110C] transition-all duration-700 ease-out motion-reduce:transition-none sm:text-3xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          GALLERY
        </h2>
        <span
          aria-hidden="true"
          className={`mx-auto mt-1.5 block h-[3px] rounded-full bg-[#B85A26] transition-all duration-700 ease-out motion-reduce:transition-none ${
            visible ? "w-14" : "w-0"
          }`}
          style={{ transitionDelay: "250ms" }}
        />
      </div>

      {/* Slider */}
      <div
        className={`gal-viewport relative mt-8 transition-opacity duration-700 ease-out motion-reduce:transition-none md:mt-10 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "300ms" }}
      >
        {/* Edge fades – cream colour se match */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#FCF7F0] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#FCF7F0] to-transparent sm:w-20" />

        <div
          className="gal-track flex w-max gap-3 sm:gap-4"
          style={{ ["--gal-speed" as string]: `${speedSeconds}s` }}
        >
          {looped.map((item, i) => (
            <figure
              key={i}
              tabIndex={0}
              aria-hidden={i >= GALLERY.length ? true : undefined}
              className="group relative h-32 w-44 shrink-0 overflow-hidden rounded-2xl bg-[#F1E4D3] shadow-[0_6px_18px_-8px_rgba(59,42,32,0.45)] outline-none transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_14px_28px_-10px_rgba(59,42,32,0.55)] focus-visible:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-[#B85A26] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F0] motion-reduce:transition-none sm:h-40 sm:w-56 md:h-48 md:w-64"
            >
              <img
                src={item.src}
                alt={i >= GALLERY.length ? "" : item.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
              />

              {/* Brown overlay + caption */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#3B2A20]/85 via-[#3B2A20]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 px-3 pb-2.5 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:text-sm">
                {item.alt}
              </figcaption>

              {/* Shine sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25 group-hover:[animation:gal-shine_.9s_ease-out]"
              />
            </figure>
          ))}
        </div>
      </div>

      {/* Button */}
      <div
        className={`mt-9 text-center transition-all duration-700 ease-out motion-reduce:transition-none md:mt-12 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
        style={{ transitionDelay: "500ms" }}
      >
        <Link
          to={buttonTo}
          className="group inline-flex items-center gap-2 rounded-full bg-[#D70810] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#A24C1D] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85A26] active:translate-y-0 motion-reduce:transition-none"
        >
          View More Photos
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </section>
  );
}