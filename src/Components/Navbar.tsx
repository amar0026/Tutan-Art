import { useState } from "react";
import { Link } from "react-router-dom";

// Har link ka label + wo kis path/hash pe le jaayega.
// Sab sections abhi Home page (/) par hi hain, isliye "/#id" use kiya —
// isse App.tsx ka ScrollToHash automatically us section tak scroll kar dega.
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/#about" },
  { label: "Classes", to: "/#classes" },
  { label: "Gallery", to: "/#gallery" },
  { label: "Contact", to: "/#contact" },
];

interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// CTA button ka arrow (hover par aage slide karta hai)
function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Navbar({
  logoSrc = "https://res.cloudinary.com/dquki4xol/image/upload/v1790335634/ChatGPT_Image_Sep_25__2026__04_49_01_PM-removebg-preview_hyu9mr.png",
  logoAlt = "Logo",
}: NavbarProps) {
  const [active, setActive] = useState("Home");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Custom animations (Tailwind config ki zaroorat nahi) */}
      <style>{`
        @keyframes nav-slide-down {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nav-fade-up {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-enter   { animation: nav-slide-down 0.6s ease-out both; }
        .nav-item-in { animation: nav-fade-up 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .nav-enter, .nav-item-in { animation: none; }
        }
      `}</style>

      {/* Warm cream background + halka border = soft aur clean look */}
      <nav className="nav-enter relative flex items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12 bg-[#FBF6EE] border-b border-[#EFE4D3] shadow-sm">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 transition-transform duration-300 hover:scale-105"
          onClick={() => setActive("Home")}
        >
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-16 sm:h-20 lg:h-28 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-11 ml-auto mr-5 lg:mr-10 text-base lg:text-lg font-medium text-slate-800">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.label}
              className="nav-item-in"
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              <Link
                to={link.to}
                onClick={() => setActive(link.label)}
                className="group relative block py-1 transition-colors duration-200 hover:text-[#C2571A]"
              >
                <span
                  className={`transition-colors duration-200 ${
                    active === link.label ? "text-[#C2571A]" : ""
                  }`}
                >
                  {link.label}
                </span>
                {/* Underline: active par full, hover par bhi grow karti hai */}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-[#C2571A] transition-all duration-300 ease-out ${
                    active === link.label ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link
          to="/#contact"
          onClick={() => setActive("Contact")}
          className="nav-item-in group hidden md:inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D70810] px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#A84812] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          style={{ animationDelay: "600ms" }}
        >
          Join a Class
          <ArrowIcon />
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-full p-2.5 text-slate-800 transition-all duration-300 hover:bg-[#F3E7D6] hover:text-[#C2571A] active:scale-90"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`block transition-transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </span>
        </button>

        {/* Mobile menu (navbar ke same cream bg ke saath) */}
        <div
          className={`absolute md:hidden top-full left-0 w-full z-50 bg-[#FBF6EE] border-b border-[#EFE4D3] shadow-md overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
            open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col items-start gap-1 px-6 py-4">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.label}
                className={`w-full transition-all duration-300 ease-out ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
              >
                <Link
                  to={link.to}
                  onClick={() => {
                    setActive(link.label);
                    setOpen(false);
                  }}
                  className={`block w-full text-left py-3 text-base font-medium border-l-2 pl-3 transition-all duration-200 hover:pl-5 ${
                    active === link.label
                      ? "text-[#C2571A] border-[#C2571A]"
                      : "text-slate-800 border-transparent hover:text-[#C2571A]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className={`w-full transition-all duration-300 ease-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + NAV_LINKS.length * 60}ms` : "0ms" }}
            >
              <Link
                to="/#contact"
                onClick={() => {
                  setActive("Contact");
                  setOpen(false);
                }}
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#C2571A] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#A84812]"
              >
                Join a Class
                <ArrowIcon />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}