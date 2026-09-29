import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface AboutProps {
  // Left side ki group image ka link yahan pass karo (ya neeche default badal do)
  imageSrc?: string;
  imageAlt?: string;
  brandName?: string;
  buttonTo?: string;
}

// Section screen mein aate hi ek baar animation chalane ke liye
function useInView<T extends HTMLElement>(threshold = 0.2) {
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
  imageSrc = "https://res.cloudinary.com/dquki4xol/image/upload/v1790578044/ChatGPT_Image_Sep_25_2026_05_13_34_PM_p1dzrl.png",
  imageAlt = "Children drawing, dancing and doing yoga",
  brandName = "our academy",
  buttonTo = "/#classes",
}: AboutProps) {
  const { ref, visible } = useInView<HTMLElement>(0.2);

  // Har element ke liye alag delay, taaki ek ke baad ek aaye
  const reveal = (from: "left" | "right" | "up", delay = 0) => {
    const hidden =
      from === "left"
        ? "-translate-x-10"
        : from === "right"
        ? "translate-x-10"
        : "translate-y-6";
    return {
      className: `transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hidden}`
      }`,
      style: { transitionDelay: `${delay}ms` },
    };
  };

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 bg-[#FFF8F3] px-5 py-12 sm:px-8 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Left: group image */}
        <div {...reveal("left")} className={`relative ${reveal("left").className}`}>
          {/* Peeche halka pink blob */}
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] bg-rose-100 md:-left-6 md:-top-6" />
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            className="relative w-full rounded-[2rem] object-cover shadow-xl"
          />
        </div>

        {/* Right: text */}
        <div className="text-center md:text-left">
          <div {...reveal("right", 150)}>
            <h2 className="text-3xl font-bold text-indigo-950 sm:text-4xl md:text-5xl">
              About Us
            </h2>
            {/* Underline jo width mein animate hoti hai */}
            <span
              className={`mx-auto mt-2 block h-1 rounded-full bg-rose-500 transition-all duration-700 ease-out motion-reduce:transition-none md:mx-0 ${
                visible ? "w-24" : "w-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            />
          </div>

          <p
            {...reveal("right", 300)}
            className={`mt-5 text-sm leading-relaxed text-slate-600 sm:text-base ${
              reveal("right", 300).className
            }`}
          >
            At {brandName}, we believe every child is unique and full of
            potential. Our classes in Drawing, Dance, and Yoga are designed to
            inspire creativity, build confidence, and promote overall
            well-being. We provide a safe, supportive, and joyful environment
            where children can learn, explore, express themselves, and grow.
          </p>

          <div {...reveal("up", 500)}>
            <Link
              to={buttonTo}
              className="mt-7 inline-flex items-center rounded-full bg-rose-500 px-7 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-lg active:translate-y-0"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}