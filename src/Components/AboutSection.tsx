import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- Image ka link yahan paste karo ---------- */
const ABOUT_IMG = "https://res.cloudinary.com/dquki4xol/image/upload/v1790852521/Sunlit_Artist_s_Desk_with_Portrait_Sketch_agclf4.png"; // <-- About image ka link

/* ---------- Theme (Navbar + Hero jaisa) ---------- */
const CREAM = "#FBF6EE";
const TERRA = "#C2571A";
const BROWN = "#3B1F14";
const PEACH = "#F3D9BC";

interface AboutProps {
  imageSrc?: string;
  imageAlt?: string;
  buttonTo?: string;
}

/* ---------- Section screen mein aate hi ek baar animation ---------- */
function useInView<T extends HTMLElement>(threshold = 0.25) {
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

export default function About({
  imageSrc = ABOUT_IMG,
  imageAlt = "Art supplies and a sketch at Tutan's Creation",
  buttonTo = "/#classes",
}: AboutProps) {
  const { ref, visible } = useInView<HTMLElement>(0.25);

  // Staggered reveal helper
  const reveal = (delay = 0, from: "left" | "right" | "up" = "up") => {
    const hidden =
      from === "left" ? "-translate-x-10" : from === "right" ? "translate-x-10" : "translate-y-6";
    return {
      className: `transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : `${hidden} opacity-0`
      }`,
      style: { transitionDelay: `${delay}ms` },
    };
  };

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 px-5 py-12 sm:px-8 md:py-16"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
        {/* ---------- Left: image ---------- */}
        <div {...reveal(0, "left")} className={`group ${reveal(0, "left").className}`}>
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-lg transition-shadow duration-500 group-hover:shadow-2xl"
            style={{ backgroundColor: PEACH }}
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 ${
                  visible ? "scale-100" : "scale-110"
                }`}
              />
            )}
          </div>
        </div>

        {/* ---------- Right: text ---------- */}
        <div>
          <h2
            {...reveal(150, "right")}
            className={`text-2xl font-extrabold uppercase tracking-wide sm:text-3xl ${
              reveal(150, "right").className
            }`}
            style={{ ...reveal(150, "right").style, color: BROWN }}
          >
            About Us
          </h2>

          <p
            {...reveal(300, "right")}
            className={`mt-3 max-w-md text-sm leading-relaxed text-[#4A3A31] sm:text-base ${
              reveal(300, "right").className
            }`}
            style={reveal(300, "right").style}
          >
            Tutan&rsquo;s Creation is a creative academy where art, rhythm and wellness come
            together. We provide a nurturing space for all age groups to explore their talents in
            Drawing, Dance and Yoga.
          </p>

          <div {...reveal(450)}>
            <Link
              to={buttonTo}
              className="group/link relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold sm:text-base"
              style={{ color: TERRA }}
            >
              Learn More
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              {/* Hover par underline grow karti hai */}
              <span
                className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full transition-all duration-300 ease-out group-hover/link:w-full"
                style={{ backgroundColor: TERRA }}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}