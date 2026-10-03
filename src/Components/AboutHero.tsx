
const BG_IMG =
  "https://res.cloudinary.com/dquki4xol/image/upload/v1791009195/Creative_Art_Studio_Banner_with_Botanical_Accents_h3sn9s.png";

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      className="relative isolate overflow-hidden bg-[#f6ecda] min-h-105 sm:min-h-115 lg:min-h-130 flex items-center"
    >
      {/* Local styles: fonts + keyframes (no tailwind.config change needed) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .ah-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .ah-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes ah-line-up {
          from { opacity: 0; transform: translateY(110%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ah-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ah-bg-zoom {
          from { transform: scale(1.12); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes ah-brush {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes ah-sway {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }

        .ah-line  { display: block; overflow: hidden; }
        .ah-line > span { display: block; animation: ah-line-up .9s cubic-bezier(.2,.8,.2,1) both; }
        .ah-fade  { animation: ah-fade .8s ease-out both; }
        .ah-bg    { animation: ah-bg-zoom 1.6s ease-out both; }
        .ah-brush { animation: ah-brush 1.4s cubic-bezier(.6,0,.2,1) .2s both; }
        .ah-sway  { transform-origin: 50% 100%; animation: ah-sway 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ah-line > span, .ah-fade, .ah-bg, .ah-brush, .ah-sway { animation: none !important; }
        }
      `}</style>

      {/* Background image (outside link) */}
      <div
        className="ah-bg absolute inset-0 -z-20 bg-cover bg-position-[70%_center] sm:bg-right"
        style={{ backgroundImage: `url(${BG_IMG})` }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-14 sm:px-8 lg:px-12">
        {/* Leaf sprig */}
        <svg
          className="ah-sway hidden sm:block h-24 w-12 shrink-0 lg:h-32 lg:w-16"
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

        <div className="max-w-xl">
          <h1 className="ah-serif text-4xl font-bold leading-[1.05] tracking-wide text-[#2b2118] sm:text-5xl lg:text-6xl">
            <span className="ah-line">
              <span style={{ animationDelay: "0.15s" }}>ABOUT</span>
            </span>
            <span className="ah-line">
              <span style={{ animationDelay: "0.3s" }}>TUTAN&rsquo;S CREATION</span>
            </span>
          </h1>

          <p
            className="ah-sans ah-fade mt-5 max-w-md text-base leading-relaxed text-[#3b2f25] sm:text-lg"
            style={{ animationDelay: "0.8s" }}
          >
            A creative space where art, movement and mindfulness come together.
          </p>
        </div>
      </div>
    </section>
  );
}