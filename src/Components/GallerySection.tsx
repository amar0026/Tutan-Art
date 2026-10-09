// src/Components/GallerySection.tsx
// Home page ka gallery slider — ab har photo GalleryCard component se banta hai.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GalleryCard, { GALLERY_CARD_CSS } from "./GalleryCard";
import { GALLERY } from "./GalleryData";

interface GallerySectionProps {
  buttonTo?: string; // "View More Photos" aur card click kahan le jaaye
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
.gal-track { animation: gal-marquee var(--gal-speed, 30s) linear infinite; }
.gal-viewport:hover .gal-track,
.gal-viewport:focus-within .gal-track { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .gal-track { animation: none; }
  .gal-viewport { overflow-x: auto; }
}

${GALLERY_CARD_CSS}
`;

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Slider mein sirf wahi photos jinke paas asli image link hai (placeholder nahi)
const SLIDES = GALLERY.filter((g) => g.src);

export default function GallerySection({ buttonTo = "/gallery", speedSeconds = 30 }: GallerySectionProps) {
  const { ref, visible } = useInView<HTMLElement>();
  const navigate = useNavigate();

  // Seamless loop ke liye list do baar render hoti hai
  const looped = [...SLIDES, ...SLIDES];

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

        <div className="gal-track flex w-max gap-3 py-2 sm:gap-4" style={{ ["--gal-speed" as string]: `${speedSeconds}s` }}>
          {looped.map((item, i) => {
            const isCopy = i >= SLIDES.length;
            return (
              // Duplicate copy screen-reader aur Tab se chhupi rehti hai
              <div key={i} aria-hidden={isCopy ? true : undefined}>
                <GalleryCard
                  item={item}
                  index={i}
                  size="slide"
                  animated={false}
                  focusable={!isCopy}
                  onOpen={() => navigate(buttonTo)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Button → Gallery page */}
      <div
        className={`mt-9 text-center transition-all duration-700 ease-out motion-reduce:transition-none md:mt-12 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
        style={{ transitionDelay: "500ms" }}
      >
        <Link
          to={buttonTo}
          className="group inline-flex items-center gap-2 rounded-xl bg-[#D70810] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#A24C1D] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85A26] active:translate-y-0 motion-reduce:transition-none"
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