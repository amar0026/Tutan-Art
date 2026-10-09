import { useEffect, useMemo, useState } from "react";
import { GALLERY } from "./GalleryData";
import GalleryCard, { GALLERY_CARD_CSS, type GalleryCategory } from "./GalleryCard";

type Filter = "All" | GalleryCategory;
const ORDER: Filter[] = ["All", "Drawing", "Dance", "Yoga", "Events"];

/* ---------- icons ---------- */

const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ChevronLeft = () => (
  <svg width="22" height="22" {...ic}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="22" height="22" {...ic}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ---------- main ---------- */

export default function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<number | null>(null); // filtered list ka index

  // Sirf wahi filters dikhao jinme kam se kam ek photo ho
  const filters = useMemo(
    () => ORDER.filter((f) => f === "All" || GALLERY.some((g) => g.category === f)),
    []
  );

  const list = filter === "All" ? GALLERY : GALLERY.filter((g) => g.category === filter);
  const current = open !== null ? list[open] : null;

  const step = (dir: 1 | -1) =>
    setOpen((i) => (i === null ? i : (i + dir + list.length) % list.length));

  // Lightbox: Esc / arrow keys + background scroll lock
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, list.length]);

  return (
    <section id="gallery-grid" className="bg-[#F6EBDC] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .gg-sans { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes gg-drop  { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gg-modal { from { opacity: 0; transform: translateY(-14px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .gg-pills { animation: gg-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
        .gg-modal { animation: gg-modal .35s cubic-bezier(.2,.8,.2,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .gg-pills, .gg-modal { animation: none !important; }
        }
        ${GALLERY_CARD_CSS}
      `}</style>

      <div className="gg-sans mx-auto max-w-6xl">
        {/* Filter pills (mobile par horizontal scroll) */}
        <div
          className="gg-pills -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter gallery"
        >
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => {
                setFilter(f);
                setOpen(null);
              }}
              className={`shrink-0 rounded-full border px-5 py-1.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
                filter === f
                  ? "border-[#C2571A] bg-[#C2571A] text-white shadow-md"
                  : "border-[#E2D3BC] bg-white text-slate-700 hover:border-[#C2571A] hover:text-[#C2571A]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid — filter badalte hi cards dobara animate hote hain */}
        <div key={filter} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {list.map((item, i) => (
            <GalleryCard key={`${item.alt}-${i}`} item={item} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      {/* ---------- Lightbox ---------- */}
      {current && open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
        >
          <div className="gg-modal relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(null)}
              aria-label="Close photo"
              className="absolute -top-3 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md transition hover:bg-[#C2571A] hover:text-white sm:-right-3"
            >
              {"\u2715"}
            </button>

            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
              {current.src ? (
                <img src={current.src} alt={current.alt} className="max-h-[75vh] w-full object-contain" />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] font-serif text-4xl font-bold text-white/90">
                  {current.category}
                </div>
              )}
              <div className="flex items-center justify-between gap-3 bg-[#FFFBF4] px-4 py-3">
                <p className="text-sm font-medium text-slate-800 sm:text-base">{current.alt}</p>
                <p className="shrink-0 text-xs text-slate-500">
                  {open + 1} / {list.length}
                </p>
              </div>
            </div>

            {list.length > 1 && (
              <>
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-[#C2571A] hover:text-white sm:-left-5"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-[#C2571A] hover:text-white sm:-right-5"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Use in Gallerypage.tsx ----------
import GalleryHero from "../Components/GalleryHero";
import GalleryGrid from "../Components/GalleryGrid";

export default function Gallerypage() {
  return (
    <>
      <GalleryHero />
      <GalleryGrid />
    </>
  );
}
-------------------------------------- */