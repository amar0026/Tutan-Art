import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Config – yahan se content badal sakte ho                            */
/* ------------------------------------------------------------------ */

interface FooterProps {
  ctaTo?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapUrl?: string;
  /** Optional: apni dancer / leaf image dena chaho to yahan do, warna SVG dikhega */
  dancerSrc?: string;
  leafSrc?: string;
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/classes" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/#contact" },
];

const TAGLINE = ["Draw", "Paint", "Dance", "Grow"];

const SOCIALS = [
  { key: "fb", label: "Facebook", href: "#", icon: <FacebookIcon /> },
  { key: "ig", label: "Instagram", href: "#", icon: <InstagramIcon /> },
  { key: "yt", label: "YouTube", href: "#", icon: <YoutubeIcon /> },
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12s0-3.6-.46-5.3a2.9 2.9 0 0 0-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.3a2.9 2.9 0 0 0 2 2c1.64.5 8.54.5 8.54.5s6.9 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12Z" />
      <path d="M9.75 15.5V8.5L15.5 12l-5.75 3.5Z" fill="#3B2A20" />
    </svg>
  );
}

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function MailIcon() {
  return (
    <svg {...iconProps} fill="currentColor" stroke="none">
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v.3l-10 6.4L2 5.8v-.3Z" />
      <path d="M22 8.2v10.3a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5V8.2l9.46 6.05a1 1 0 0 0 1.08 0L22 8.2Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps} fill="currentColor" stroke="none">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1L6.6 10.8Z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Illustrations (replace with images via props if you want)           */
/* ------------------------------------------------------------------ */

function DancerArt() {
  return (
    <svg viewBox="0 0 130 160" className="h-full w-full" fill="none" stroke="#3B2A20" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="58" cy="34" r="6" fill="#3B2A20" />
      {/* raised arm */}
      <path d="M54 46C60 34 70 18 82 6" strokeWidth="3" />
      <path d="M54 48C44 52 36 56 30 64" strokeWidth="2.5" />
      {/* torso */}
      <path d="M54 44C50 58 52 70 58 82" strokeWidth="4" />
      {/* back leg */}
      <path d="M58 82C44 96 28 112 8 134" strokeWidth="3.5" />
      <path d="M8 134l-6 8" strokeWidth="2.5" />
      {/* front leg */}
      <path d="M58 82C74 90 88 104 100 126" strokeWidth="3.5" />
      <path d="M100 126l10 6" strokeWidth="2.5" />
      {/* skirt flow */}
      <path d="M52 76C40 80 30 84 22 92M62 78C74 78 86 82 94 90" strokeWidth="1.5" opacity=".6" />
    </svg>
  );
}

function LeafArt() {
  const leaves = [
    { cx: 40, cy: 118, r: -40 },
    { cx: 66, cy: 100, r: 30 },
    { cx: 36, cy: 84, r: -50 },
    { cx: 70, cy: 68, r: 40 },
    { cx: 42, cy: 52, r: -35 },
    { cx: 62, cy: 32, r: 25 },
  ];
  return (
    <svg viewBox="0 0 100 150" className="h-full w-full" aria-hidden="true">
      <path d="M12 148C30 120 52 80 56 12" fill="none" stroke="#3B2A20" strokeWidth="2.2" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <ellipse key={i} cx={l.cx} cy={l.cy} rx="6" ry="15" fill="#3B2A20" transform={`rotate(${l.r} ${l.cx} ${l.cy})`} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap');

.tc-sans  { font-family: 'Inter', system-ui, sans-serif; }
.tc-serif { font-family: 'Playfair Display', Georgia, serif; }

@keyframes tc-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-8px) rotate(-1.5deg); }
}
@keyframes tc-sway {
  0%, 100% { transform: rotate(-2deg); }
  50%      { transform: rotate(3deg); }
}
@keyframes tc-shine {
  0%   { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(260%) skewX(-20deg); }
}
@keyframes tc-ring {
  0%   { box-shadow: 0 0 0 0 rgba(184, 90, 38, .45); }
  100% { box-shadow: 0 0 0 16px rgba(184, 90, 38, 0); }
}
@keyframes tc-wiggle {
  0%, 100% { transform: rotate(0); }
  25%      { transform: rotate(-12deg) scale(1.1); }
  75%      { transform: rotate(10deg) scale(1.1); }
}
@keyframes tc-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tc-grow-x {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes tc-pop {
  from { opacity: 0; transform: translateY(10px) scale(.92); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.tc-float  { animation: tc-float 5s ease-in-out infinite; transform-origin: 50% 100%; }
.tc-sway   { animation: tc-sway 4.5s ease-in-out infinite; transform-origin: 20% 100%; }
.tc-btn-ring { animation: tc-ring 2.4s ease-out 1.6s 3; }
.tc-rise   { opacity: 0; animation: tc-rise .7s ease-out forwards; }
.tc-line-l { transform-origin: right center; animation: tc-grow-x .9s ease-out .3s both; }
.tc-line-r { transform-origin: left center;  animation: tc-grow-x .9s ease-out .3s both; }
.tc-pop    { animation: tc-pop .28s cubic-bezier(.2,.9,.3,1.2) both; }
.tc-item:hover .tc-item-icon,
.tc-item[data-open="true"] .tc-item-icon { animation: tc-wiggle .6s ease-in-out; }

@media (prefers-reduced-motion: reduce) {
  .tc-float, .tc-sway, .tc-btn-ring, .tc-line-l, .tc-line-r, .tc-pop,
  .tc-item:hover .tc-item-icon, .tc-item[data-open="true"] .tc-item-icon { animation: none !important; }
  .tc-rise { animation: none !important; opacity: 1; }
}
`;

/* ------------------------------------------------------------------ */
/* CTA banner                                                          */
/* ------------------------------------------------------------------ */

function CtaBanner({
  ctaTo,
  dancerSrc,
  leafSrc,
}: {
  ctaTo: string;
  dancerSrc?: string;
  leafSrc?: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="bg-[#FCF7F0] px-4 pt-5 sm:px-6">
      <div
        className={`relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#F8EDE0] px-6 py-8 transition-all duration-700 ease-out motion-reduce:transition-none sm:py-9 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Dancer – left */}
        <div className="tc-float pointer-events-none absolute -bottom-1 left-2 h-24 w-20 sm:left-8 sm:h-32 sm:w-28 md:h-36 md:w-32">
          {dancerSrc ? <img src={dancerSrc} alt="" className="h-full w-full object-contain" /> : <DancerArt />}
        </div>

        {/* Leaf – right */}
        <div className="tc-sway pointer-events-none absolute -bottom-1 right-2 h-20 w-14 sm:right-10 sm:h-28 sm:w-20 md:h-32 md:w-24">
          {leafSrc ? <img src={leafSrc} alt="" className="h-full w-full object-contain" /> : <LeafArt />}
        </div>

        <div className="tc-sans relative mx-auto flex max-w-xl flex-col items-center px-8 text-center sm:px-0">
          <h2
            className={`text-2xl font-semibold tracking-wide text-[#1A110C] transition-all duration-700 ease-out motion-reduce:transition-none sm:text-3xl ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            JOIN TUTAN&apos;S CREATION
          </h2>
          <p
            className={`mt-2 text-sm font-medium text-[#1A110C] transition-all duration-700 ease-out motion-reduce:transition-none sm:text-base ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "280ms" }}
          >
            Let your creativity, energy and inner peace grow with us.
          </p>

          <Link
            to="/Signup"
            className={`group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#D70810] px-9 py-3 text-sm font-medium tracking-wide text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#A24C1D] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85A26] active:translate-y-0 motion-reduce:transition-none ${
              visible ? "tc-btn-ring translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: visible ? "0ms, 0ms, 0ms" : "400ms" }}
          >
            {/* shine sweep on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25 group-hover:[animation:tc-shine_.8s_ease-out]"
            />
            <span className="relative">JOIN NOW</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact strip with hover info                                       */
/* ------------------------------------------------------------------ */

interface InfoItem {
  key: string;
  label: string;
  icon: ReactNode;
  title: string;
  body: ReactNode;
}

function ContactStrip({
  email,
  phone,
  address,
  mapUrl,
}: {
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useInView<HTMLDivElement>(0.3);

  // bahar tap/click karne par ya Escape dabane par band
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setActive(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const linkCls =
    "font-semibold text-[#B85A26] underline-offset-4 transition-colors hover:text-[#8A3F15] hover:underline";

  const items: InfoItem[] = [
    {
      key: "contact",
      label: "CONTACT",
      icon: <MailIcon />,
      title: "Write to us",
      body: (
        <a href={`mailto:${email}`} className={linkCls}>
          {email}
        </a>
      ),
    },
    {
      key: "address",
      label: "ADDRESS",
      icon: <PinIcon />,
      title: "Visit our studio",
      body: <span>{address}</span>,
    },
    {
      key: "phone",
      label: "PHONE",
      icon: <PhoneIcon />,
      title: "Call us",
      body: (
        <a href={`tel:${phone.replace(/\s/g, "")}`} className={linkCls}>
          {phone}
        </a>
      ),
    },
    {
      key: "map",
      label: "MAP",
      icon: <MapIcon />,
      title: "Find us on the map",
      body: (
        <a href={mapUrl} target="_blank" rel="noreferrer" className={linkCls}>
          Open in Google Maps
        </a>
      ),
    },
  ];

  return (
    <div ref={ref} className="tc-sans bg-[#FCF7F0] px-4 pb-7 pt-7 sm:px-6">
      <div ref={wrapRef} className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
        {items.map((item, i) => {
          const open = active === item.key;
          const id = `tc-info-${item.key}`;
          return (
            <div
              key={item.key}
              className={`relative flex justify-center transition-all duration-700 ease-out motion-reduce:transition-none ${
                visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 90}ms` }}
              onMouseEnter={() => setActive(item.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(item.key)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null);
              }}
            >
              <button
                type="button"
                data-open={open}
                aria-describedby={open ? id : undefined}
                aria-expanded={open}
                onClick={() => setActive(item.key)}
                className="tc-item group flex items-center gap-3 rounded-lg px-3 py-2 text-[#1A110C] transition-colors duration-200 hover:text-[#B85A26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85A26] sm:gap-4"
              >
                <span className="tc-item-icon inline-flex">{item.icon}</span>
                <span className="relative text-base font-semibold tracking-wide sm:text-lg">
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-[#B85A26] transition-transform duration-300 ${
                      open ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
              </button>

              {/* Hover card */}
              {open && (
                <div
                  className={`absolute bottom-full z-30 pb-3 ${
                    i % 2 === 0 ? "left-0" : "right-0"
                  } md:left-1/2 md:right-auto md:-translate-x-1/2`}
                >
                  <div
                    id={id}
                    role="tooltip"
                    className="tc-pop relative w-60 rounded-2xl border border-[#E8D5BC] bg-white p-4 text-left shadow-xl sm:w-64"
                  >
                    <p className="text-xs font-semibold text-[#8A6B4A]">{item.title}</p>
                    <div className="mt-1 text-sm leading-relaxed text-[#3B2A20] break-words">{item.body}</div>
                    {/* arrow */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-[#E8D5BC] bg-white ${
                        i % 2 === 0 ? "left-10" : "right-10"
                      } md:left-1/2 md:right-auto md:-translate-x-1/2`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export default function Footer({
  ctaTo = "/#contact",
  email = "hello@tutanscreation.com", // <- apna real email daalo
  phone = "9836365640",
  address = "3 no, Sreema Road, Near Kathattola, Kolkata - 65",
  mapUrl = "https://www.google.com/maps/search/?api=1&query=3+Sreema+Road+Kathattola+Kolkata+700065",
  dancerSrc,
  leafSrc,
}: FooterProps) {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);
  const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <footer>
      <style>{STYLES}</style>

      <CtaBanner ctaTo={ctaTo} dancerSrc={dancerSrc} leafSrc={leafSrc} />
      <ContactStrip email={email} phone={phone} address={address} mapUrl={mapUrl} />

      {/* Dark bottom section */}
      <div ref={ref} className="tc-sans bg-[#3B2A20] px-4 pb-6 pt-8 text-center text-[#F3E7D8]">
        {/* Title with gold lines */}
        <div className="mx-auto flex max-w-xl items-center justify-center gap-4">
          <span className={`h-px flex-1 bg-[#B8935A] ${visible ? "tc-line-l" : "scale-x-0"}`} />
          <h3
            className={`tc-serif text-sm font-medium uppercase tracking-[0.08em] sm:text-base ${visible ? "tc-rise" : "opacity-0"}`}
            style={delay(200)}
          >
            Tutan&apos;s Creation
          </h3>
          <span className={`h-px flex-1 bg-[#B8935A] ${visible ? "tc-line-r" : "scale-x-0"}`} />
        </div>

        {/* Tagline */}
        <ul
          className={`mt-2 flex flex-wrap items-center justify-center gap-x-3 text-xs font-medium sm:text-sm ${visible ? "tc-rise" : "opacity-0"}`}
          style={delay(350)}
        >
          {TAGLINE.map((w, i) => (
            <li key={w} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[#B8935A]" aria-hidden="true" />}
              {w}
            </li>
          ))}
        </ul>

        {/* Socials */}
        <div
          className={`mt-4 flex items-center justify-center gap-4 ${visible ? "tc-rise" : "opacity-0"}`}
          style={delay(500)}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              aria-label={s.label}
              className="inline-flex text-white transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:text-[#E3B66F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E3B66F] motion-reduce:transition-none"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Nav links */}
        <nav
          aria-label="Footer"
          className={`mt-4 ${visible ? "tc-rise" : "opacity-0"}`}
          style={delay(650)}
        >
          <ul className="flex flex-wrap items-center justify-center gap-y-2 text-xs sm:text-[13px]">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l.label}
                className={`px-3 ${i > 0 ? "border-l border-[#B8935A]/70" : ""}`}
              >
                <Link
                  to={l.to}
                  className="relative inline-block py-0.5 transition-colors duration-200 hover:text-[#E3B66F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3B66F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#E3B66F] after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p
          className={`mt-4 text-[11px] text-[#D9C7B0] ${visible ? "tc-rise" : "opacity-0"}`}
          style={delay(800)}
        >
          © {new Date().getFullYear()} Tutan&apos;s Creation. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}