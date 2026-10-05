const BG_IMG: string =
  "https://res.cloudinary.com/dquki4xol/image/upload/v1791183181/Young_Artist_Sharing_Her_Floral_Portrait_weuwzh.png";

export default function StudentsHero() {
  return (
    <section
      id="students-hero"
      className="relative isolate flex flex-col overflow-hidden bg-[#F6EBDC] md:min-h-[320px] md:flex-row md:items-center lg:min-h-[380px]"
    >
      {/* Local styles: fonts + keyframes (no tailwind.config change needed) — sab upar se neeche */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Caveat:wght@600&display=swap');

        .sh-serif  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sh-sans   { font-family: 'DM Sans', system-ui, sans-serif; }
        .sh-script { font-family: 'Caveat', cursive; }

        @keyframes sh-line-down {
          from { opacity: 0; transform: translateY(-110%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sh-drop {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sh-reveal {
          from { clip-path: inset(0 0 100% 0); opacity: 0; }
          to   { clip-path: inset(0 0 0 0);    opacity: 1; }
        }
        @keyframes sh-tag-in {
          from { opacity: 0; transform: translateY(-24px) rotate(-12deg); }
          to   { opacity: 1; transform: translateY(0) rotate(-6deg); }
        }
        @keyframes sh-float {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50%      { transform: translateY(-6px) rotate(-4deg); }
        }
        @keyframes sh-sway {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }

        .sh-line  { display: block; overflow: hidden; }
        .sh-line > span { display: block; animation: sh-line-down .9s cubic-bezier(.2,.8,.2,1) backwards; }
        .sh-drop  { animation: sh-drop .8s cubic-bezier(.2,.8,.2,1) backwards; }
        .sh-reveal{ animation: sh-reveal 1.3s cubic-bezier(.6,0,.2,1) backwards; }
        .sh-tag   { transform: rotate(-6deg);
                    animation: sh-tag-in .9s cubic-bezier(.2,.8,.2,1) 1.2s backwards,
                               sh-float 5s ease-in-out 2.1s infinite; }
        .sh-sway  { transform-origin: 50% 100%; animation: sh-sway 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .sh-line > span, .sh-drop, .sh-reveal, .sh-tag, .sh-sway { animation: none !important; }
        }
      `}</style>

      {/* Text (mobile par upar, desktop par image ke upar left mein) */}
      <div className="relative z-10 order-1 mx-auto flex w-full max-w-6xl items-start gap-3 px-5 py-8 sm:px-8 md:items-center md:py-10 lg:px-12">
        {/* Leaf sprig */}
        <svg
          className="sh-sway hidden h-24 w-10 shrink-0 sm:block lg:h-32 lg:w-14"
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

        <div className="max-w-lg md:max-w-[46%]">
          <h1 className="sh-serif text-4xl font-bold leading-[1.05] tracking-wide text-slate-800 sm:text-5xl lg:text-6xl">
            <span className="sh-line">
              <span style={{ animationDelay: "0.45s" }}>STUDENTS</span>
            </span>
            <span className="sh-line">
              <span style={{ animationDelay: "0.6s" }}>SPEAK</span>
            </span>
          </h1>

          <p
            className="sh-sans sh-drop mt-3 text-lg font-bold leading-snug text-slate-800 sm:text-xl lg:text-2xl"
            style={{ animationDelay: "0.9s" }}
          >
            Real experiences. Real creativity.
            <br />
            Real growth.
          </p>

          <p
            className="sh-sans sh-drop mt-2 max-w-md text-sm leading-relaxed text-slate-700 sm:text-base"
            style={{ animationDelay: "1.1s" }}
          >
            Watch how Tutan&rsquo;s Creation has inspired students of all ages to explore their creativity, build
            confidence and embrace a mindful, artistic life.
          </p>
        </div>
      </div>

      {/* Image: mobile par text ke neeche POORI dikhti hai; desktop par poore section ka background */}
      <div
        className="sh-reveal relative order-2 md:absolute md:inset-0 md:-z-20"
        style={{ animationDelay: "0.3s" }}
      >
        <img
          src={BG_IMG}
          alt="Student smiling with her floral drawing"
          className="block h-auto w-full md:h-full md:object-cover md:object-right"
        />
        {/* Desktop par left side cream wash taaki text padhne mein aaye */}
        <div
          className="absolute inset-0 hidden bg-gradient-to-r from-[#F6EBDC] via-[#F6EBDC]/70 to-transparent md:block md:via-[#F6EBDC]/60"
          style={{ backgroundSize: "55% 100%", backgroundRepeat: "no-repeat" }}
          aria-hidden="true"
        />
      </div>

      {/* Gold brush stroke behind heading */}
      <svg
        className="sh-reveal pointer-events-none absolute -top-4 left-0 -z-10 w-56 opacity-70 sm:w-80 lg:w-[26rem]"
        style={{ animationDelay: "0.5s" }}
        viewBox="0 0 400 140"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 20 C 60 0, 160 6, 250 18 C 320 28, 380 40, 396 70 C 340 96, 250 112, 160 110 C 90 108, 30 96, 0 70 Z"
          fill="#F0C986"
          fillOpacity="0.55"
        />
      </svg>

      {/* Peach watercolor – bottom left (desktop) */}
      <svg
        className="sh-reveal pointer-events-none absolute -bottom-3 left-0 -z-10 hidden w-64 opacity-70 md:block"
        style={{ animationDelay: "0.7s" }}
        viewBox="0 0 260 110"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 110 C 10 60, 70 26, 140 36 C 200 44, 246 74, 260 110 Z" fill="#E9A98A" fillOpacity="0.55" />
      </svg>

      {/* "Create · Move · Be Well" gold brush tag (desktop) */}
      <div className="sh-tag absolute right-6 top-6 z-10 hidden w-36 md:block lg:right-12 lg:w-48">
        <svg viewBox="0 0 200 110" className="w-full" fill="none" aria-hidden="true">
          <path
            d="M8 30 C 20 8, 80 2, 130 8 C 175 12, 198 24, 192 52 C 188 82, 150 102, 100 102 C 50 102, 6 90, 4 62 C 3 50, 4 40, 8 30 Z"
            fill="#F0C986"
            fillOpacity="0.9"
          />
        </svg>
        <p className="sh-script absolute inset-0 flex flex-col items-center justify-center text-center text-base leading-[1.05] text-slate-800 lg:text-xl">
          <span>Create</span>
          <span>Move</span>
          <span>Be Well</span>
        </p>
      </div>
    </section>
  );
}