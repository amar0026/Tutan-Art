import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  logoSrc?: string;
  logoAlt?: string;
  ctaTo?: string;
}

const QUICK_LINKS = ["Home", "About Us", "Classes", "Gallery", "Contact"];
const CLASSES = ["Drawing Class", "Dance Class", "Yoga Class"];

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M23 12s0-3.6-.46-5.3a2.9 2.9 0 0 0-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.3a2.9 2.9 0 0 0 2 2c1.64.5 8.54.5 8.54.5s6.9 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12Z" />
      <path d="M9.75 15.5V8.5L15.5 12l-5.75 3.5Z" fill="#DC2626" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DB2777" strokeWidth="2">
      <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function FooterLinkList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-blue-950 relative inline-block pb-2 mb-4">
        {title}
        <span className="absolute left-0 -bottom-0.5 h-0.5 w-8 bg-rose-500 rounded-full" />
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-slate-600 text-sm inline-block transition-all duration-200 hover:text-rose-600 hover:translate-x-1"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// CTA banner screen mein aate hi ek baar animation chalane ke liye
function useInView<T extends HTMLElement>(threshold = 0.4) {
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
@keyframes cta-shine {
  0%   { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(220%) skewX(-20deg); }
}
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.5); }
  50%      { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
}
@media (prefers-reduced-motion: reduce) {
  .cta-shine, .cta-pulse { animation: none !important; }
}
`;

function CtaBanner({ ctaTo = "/#contact" }: { ctaTo?: string }) {
  const { ref, visible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="px-5 pt-10 sm:px-8 md:pt-14">
      <style>{KEYFRAMES}</style>
      <div
        className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-8 shadow-lg transition-all duration-700 ease-out motion-reduce:transition-none sm:px-10 md:py-10 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Shine sweep, sirf ek baar entrance ke baad */}
        {visible && (
          <span
            aria-hidden="true"
            className="cta-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/20"
            style={{ animation: "cta-shine 1.2s ease-out 0.4s both" }}
          />
        )}

        <div className="relative flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div
            className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
              visible ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
              Ready to Begin the Journey?
            </h3>
            <p className="mt-1 text-sm text-rose-50 sm:text-base">
              Join Tutan's Creation and let your child explore, learn and grow.
            </p>
          </div>

          <Link
            to={ctaTo}
            className={`cta-pulse shrink-0 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-rose-600 shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-xl active:translate-y-0 motion-reduce:transition-none ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: "300ms",
              animation: visible ? "cta-pulse 2.4s ease-out 1.6s 3" : "none",
            }}
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Footer({
  logoSrc = "https://res.cloudinary.com/dquki4xol/image/upload/v1790335634/ChatGPT_Image_Sep_25__2026__04_49_01_PM-removebg-preview_hyu9mr.png",
  logoAlt = "Tutan's Creation logo",
  ctaTo = "/#contact",
}: FooterProps) {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <footer className="relative bg-white overflow-hidden">
      {/* CTA banner */}
      <CtaBanner ctaTo={ctaTo} />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-24 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div>
          <img src={logoSrc} alt={logoAlt} className="h-20 w-auto object-contain mb-3" />
          <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
            Nurturing creativity and wellness for a brighter tomorrow through
            Art, Dance and Yoga.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[
              { key: "fb", bg: "bg-blue-600", icon: <FacebookIcon /> },
              {
                key: "ig",
                bg: "bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600",
                icon: <InstagramIcon />,
              },
              { key: "yt", bg: "bg-red-600", icon: <YoutubeIcon /> },
            ].map((s) => (
              <a
                key={s.key}
                href="#"
                onMouseEnter={() => setHoveredSocial(s.key)}
                onMouseLeave={() => setHoveredSocial(null)}
                className={`flex items-center justify-center w-9 h-9 rounded-full ${s.bg} transition-transform duration-200 ease-out ${
                  hoveredSocial === s.key ? "scale-110 -translate-y-0.5 shadow-md" : ""
                }`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <FooterLinkList title="Quick Links" items={QUICK_LINKS} />
        <FooterLinkList title="Our Classes" items={CLASSES} />

        {/* Contact column */}
        <div>
          <h3 className="text-lg font-bold text-blue-950 relative inline-block pb-2 mb-4">
            Contact Us
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-8 bg-rose-500 rounded-full" />
          </h3>
          <div className="flex items-start gap-3 mb-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-100 shrink-0">
              <MapPinIcon />
            </span>
            <p className="text-slate-600 text-sm leading-relaxed pt-1.5">
              3 no, Sreema Road, Near Kathattola, Kolkata - 65
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 shrink-0">
              <PhoneIcon />
            </span>
            <a
              href="tel:9836365640"
              className="text-blue-950 font-bold text-base transition-colors duration-200 hover:text-rose-600"
            >
              9836365640
            </a>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-17 left-0 w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 80" className="w-full h-16 sm:h-20" preserveAspectRatio="none">
          <path
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z"
            fill="#EFF3FA"
          />
        </svg>
      </div>

      {/* Bottom bar */}
      <div className="relative bg-blue-950 text-blue-100 text-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Tutan's Creation. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <span className="text-blue-400">|</span>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}