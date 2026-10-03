
const BG_IMG: string = "https://res.cloudinary.com/dquki4xol/image/upload/v1791014436/Sunlit_Creative_Studio_Still_Life_xvlmch.png";

export default function GalleryHero() {
  return (
    <section
      id="gallery-hero"
      className="relative isolate flex min-h-[360px] items-center overflow-hidden bg-[#faf1e2] sm:min-h-[400px] lg:min-h-[460px]"
    >
      {/* Local styles: fonts + keyframes (no tailwind.config change needed) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .gh-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .gh-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes gh-line-up {
          from { opacity: 0; transform: translateY(110%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gh-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gh-bg-in {
          from { opacity: 0; transform: scale(1.1); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes gh-sweep {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes gh-sway {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        @keyframes gh-drift {
          0%, 100% { transform: scale(1) translateX(0); }
          50%      { transform: scale(1.04) translateX(-1%); }
        }

        .gh-line  { display: block; overflow: hidden; }
        .gh-line > span { display: block; animation: gh-line-up .9s cubic-bezier(.2,.8,.2,1) both; }
        .gh-fade  { animation: gh-fade .8s ease-out both; }
        .gh-bg    { animation: gh-bg-in 1.5s ease-out both, gh-drift 18s ease-in-out 1.5s infinite; }
        .gh-sweep { animation: gh-sweep 1.3s cubic-bezier(.6,0,.2,1) both; }
        .gh-sway  { transform-origin: 50% 100%; animation: gh-sway 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .gh-line > span, .gh-fade, .gh-bg, .gh-sweep, .gh-sway { animation: none !important; }
        }
      `}</style>

      {/* Background image (outside link) */}
      <div
        className="gh-bg absolute inset-0 -z-20 bg-cover bg-position-[70%_center] sm:bg-right"
        style={{ backgroundImage: `url(${BG_IMG})` }}
        aria-hidden="true"
      />

 

    

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-12 sm:px-8 lg:px-12">
        {/* Leaf sprig */}
        <svg
          className="gh-sway hidden h-24 w-12 shrink-0 self-end sm:block lg:h-32 lg:w-16"
          viewBox="0 0 60 120"
          fill="none"
          stroke="#4d6a3a"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M30 118 C 30 80, 30 40, 30 6" />
          <path d="M30 30 C 18 26, 14 14, 18 6 C 28 8, 32 20, 30 30 Z" fill="#a9c28a" fillOpacity="0.6" />
          <path d="M30 56 C 44 52, 52 42, 50 32 C 38 34, 30 44, 30 56 Z" fill="#a9c28a" fillOpacity="0.6" />
          <path d="M30 78 C 16 74, 8 64, 10 54 C 22 56, 30 66, 30 78 Z" fill="#a9c28a" fillOpacity="0.6" />
          <path d="M30 100 C 42 96, 50 88, 48 78 C 38 80, 30 88, 30 100 Z" fill="#a9c28a" fillOpacity="0.6" />
        </svg>

        <div className="max-w-md">
          <h1 className="gh-serif text-4xl font-bold leading-[1.05] tracking-wide text-[#2b2118] sm:text-5xl lg:text-6xl">
            <span className="gh-line">
              <span style={{ animationDelay: "0.2s" }}>GALLERY</span>
            </span>
          </h1>

          <p
            className="gh-sans gh-fade mt-4 max-w-sm text-base italic leading-relaxed text-[#3b2f25] sm:text-lg"
            style={{ animationDelay: "0.7s" }}
          >
            Moments of creativity, movement and mindfulness.
          </p>
        </div>
      </div>
    </section>
  );
}
