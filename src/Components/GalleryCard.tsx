export type GalleryCategory = "Drawing" | "Dance" | "Yoga" | "Events";

export interface GalleryItem {
  src: string; // 👉 outside image link (khali ho to gradient placeholder dikhega)
  alt: string; // caption + alt text
  category: GalleryCategory;
}

interface GalleryCardProps {
  item: GalleryItem;
  index: number; // stagger animation ke liye
  onOpen: (index: number) => void; // click par kya ho (lightbox kholna / gallery page par jaana)
  size?: "grid" | "slide"; // grid = poori width wala card, slide = home slider ka fixed size card
  animated?: boolean; // false = entrance (drop) animation nahi (slider mein band rakho)
  focusable?: boolean; // false = keyboard Tab se skip (slider ki duplicate copy ke liye)
}

/* Is CSS ko parent ek baar <style> mein render karta hai,
   taaki har card ke saath dobara na likhna pade. */
export const GALLERY_CARD_CSS = `
@keyframes gc-drop {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gc-shine {
  0%   { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(360%) skewX(-20deg); }
}
.gc-card { animation: gc-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
.gc-card:hover .gc-shine,
.gc-card:focus-visible .gc-shine { animation: gc-shine .9s ease-out; }

@media (prefers-reduced-motion: reduce) {
  .gc-card, .gc-card .gc-shine { animation: none !important; }
}
`;

function ZoomIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export default function GalleryCard({
  item,
  index,
  onOpen,
  size = "grid",
  animated = true,
  focusable = true,
}: GalleryCardProps) {
  const slide = size === "slide";

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      tabIndex={focusable ? undefined : -1}
      aria-label={`Open photo: ${item.alt}`}
      className={`${animated ? "gc-card" : ""} group relative block overflow-hidden rounded-2xl bg-[#F1E4D3] text-left shadow-[0_6px_18px_-8px_rgba(59,42,32,0.45)] outline-none transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_14px_28px_-10px_rgba(59,42,32,0.55)] focus-visible:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-[#C2571A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EBDC] motion-reduce:transition-none ${
        slide ? "h-32 w-44 shrink-0 sm:h-40 sm:w-56 md:h-48 md:w-64" : "aspect-[4/3] w-full"
      }`}
      style={animated ? { animationDelay: `${Math.min(index, 11) * 70}ms` } : undefined}
    >
      {/* Image ya placeholder */}
      {item.src ? (
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] font-serif text-3xl font-bold text-white/90">
          {item.category}
        </span>
      )}

      {/* Category badge + zoom icon (sirf grid card mein) */}
      {!slide && (
        <>
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#C2571A] shadow-sm backdrop-blur-sm">
            {item.category}
          </span>
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full bg-white/90 text-[#C2571A] opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <ZoomIcon />
          </span>
        </>
      )}

      {/* Brown overlay + caption */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#3B2A20]/85 via-[#3B2A20]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span
        className={`absolute inset-x-0 bottom-0 translate-y-3 font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
          slide ? "px-3 pb-2.5 text-xs sm:text-sm" : "px-4 pb-3 text-sm"
        }`}
      >
        {item.alt}
      </span>

      {/* Shine sweep */}
      <span
        aria-hidden="true"
        className="gc-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-[120%] bg-white/25"
      />
    </button>
  );
}