import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HeroProps {
  bgImg?: string;
}

/* ---------- Theme colours (image se match) ---------- */
const CREAM = "#F6EBDC";
const TERRA = "#C2571A";
const BROWN = "#3B1F14";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 lg:h-[2cqw] lg:w-[2cqw]"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const TAGLINE = ["Draw", "Move", "Breathe", "Grow"];

export default function Hero({
  bgImg = "https://res.cloudinary.com/dquki4xol/image/upload/v1790749431/ChatGPT_Image_Sep_30_2026_11_50_32_AM_rpuanc.png",
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // staggered entrance
  const enter = (delay: number) => ({
    className: `transition-all duration-700 ease-out ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  const titleEnter = enter(0);
  const taglineEnter = enter(150);
  const buttonEnter = enter(300);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: CREAM }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,500&display=swap');
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        @keyframes hero-slow-zoom {
          from { transform: scale(1); }
          to   { transform: scale(1.04); }
        }
        .hero-bg-zoom { animation: hero-slow-zoom 14s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .hero-bg-zoom { animation: none !important; }
        }
      `}</style>

      {/* Desktop: image ke exact ratio (837:283) mein, taaki text hamesha same jagah rahe */}
      <div className="relative lg:aspect-[837/283] lg:[container-type:inline-size]">
        {/* Desktop background image */}
        <div className="absolute inset-0 hidden overflow-hidden lg:block">
          <div
            className="hero-bg-zoom h-full w-full bg-cover bg-right bg-no-repeat"
            style={{ backgroundImage: `url(${bgImg})` }}
          />
        </div>

        {/* Image ke baked-in left text ko chhupane wala cream gradient */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background: `linear-gradient(90deg, ${CREAM} 0%, ${CREAM} 41%, rgba(246,235,220,0.7) 44%, rgba(246,235,220,0) 48%)`,
          }}
        />

        {/* ---------- Content ---------- */}
        <div className="relative px-6 pb-6 pt-10 sm:px-10 sm:pt-14 lg:absolute lg:inset-y-0 lg:left-[9%] lg:flex lg:flex-col lg:justify-center lg:p-0">
          {/* Title */}
          <h1
            className={`hero-serif text-5xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-[6.4cqw] ${titleEnter.className}`}
            style={{ ...titleEnter.style, color: BROWN }}
          >
            Tutan&rsquo;s
            <br />
            Creation
          </h1>

          {/* Tagline: Draw • Move • Breathe • Grow */}
          <div className={taglineEnter.className} style={taglineEnter.style}>
            <div
              className="hero-serif mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg italic sm:text-xl lg:mt-[1.4cqw] lg:gap-x-[1.2cqw] lg:text-[2.3cqw]"
              style={{ color: BROWN }}
            >
              {TAGLINE.map((w, i) => (
                <span key={w} className="flex items-center gap-3 lg:gap-[1.2cqw]">
                  <span>{w}</span>
                  {i < TAGLINE.length - 1 && <span>&bull;</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Button */}
          <div className={buttonEnter.className} style={buttonEnter.style}>
            <Link
              to="/#contact"
              className="group mt-6 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:text-base lg:mt-[2.2cqw] lg:gap-[1.2cqw] lg:px-[3cqw] lg:py-[1.2cqw] lg:text-[1.7cqw]"
              style={{ backgroundColor: TERRA }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A84812")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TERRA)}
            >
              Join a Class
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* ---------- Mobile / tablet: image text ke neeche ---------- */}
        <div
          className={`relative h-64 w-full bg-cover bg-no-repeat transition-opacity delay-300 duration-700 ease-out sm:h-80 lg:hidden ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${bgImg})`, backgroundPosition: "88% center" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-16"
            style={{ background: `linear-gradient(180deg, ${CREAM} 0%, rgba(246,235,220,0) 100%)` }}
          />
        </div>
      </div>
    </section>
  );
}