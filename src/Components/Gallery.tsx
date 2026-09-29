import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------
// Gallery images outside link se. Jitni chaho utni daal sakte ho,
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
  // Ek image kitni der mein screen paar kare (seconds). Kam = tez slider.
  speedSeconds?: number;
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

const KEYFRAMES = `
@keyframes gallery-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.gallery-track {
  animation: gallery-marquee var(--gallery-speed, 30s) linear infinite;
}
.gallery-track:hover {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .gallery-track {
    animation: none;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
`;

export default function Gallery({ buttonTo = "/gallery", speedSeconds = 30 }: GalleryProps) {
  const { ref, visible } = useInView<HTMLElement>();

  // Seamless loop ke liye list ko do baar render karte hain
  const looped = [...GALLERY, ...GALLERY];

  return (
    <section
      id="gallery"
      ref={ref}
      className="scroll-mt-24 overflow-hidden bg-white px-5 py-12 sm:px-8 md:py-20"
    >
      <style>{KEYFRAMES}</style>

      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div
          className={`text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-indigo-950 sm:text-4xl md:text-5xl">
            Our <span className="text-rose-500">Gallery</span>
          </h2>
          <span
            className={`mx-auto mt-2 block h-1 rounded-full bg-rose-500 transition-all duration-700 ease-out motion-reduce:transition-none ${
              visible ? "w-24" : "w-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Slider: full width, dono taraf halka fade taaki cut-off na dikhe */}
      <div
        className={`relative mt-10 transition-all duration-700 ease-out motion-reduce:transition-none md:mt-14 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <div
          className="gallery-track flex w-max gap-4 sm:gap-5"
          style={{ ["--gallery-speed" as string]: `${speedSeconds}s` }}
        >
          {looped.map((item, i) => (
            <div
              key={i}
              className="group h-44 w-56 shrink-0 overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl sm:h-56 sm:w-72 md:h-64 md:w-80"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div
        className={`mt-10 text-center transition-all duration-700 ease-out motion-reduce:transition-none md:mt-14 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "500ms" }}
      >
        <Link
          to={buttonTo}
          className="inline-flex items-center rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-lg active:translate-y-0"
        >
          View More Photos
        </Link>
      </div>
    </section>
  );
}