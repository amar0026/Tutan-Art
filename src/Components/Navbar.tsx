import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Har link ka label + wo kis path pe le jaayega.
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Classes", to: "/classes" },
  { label: "Gallery", to: "/gallery" },
  { label: "Testimonials", to: "/testimonial" },
  { label: "Contact", to: "/contact" },
];

// "Join a Class" button yahan le jaayega
const JOIN_LINK = "/signup";

interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
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
      aria-hidden="true"
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
  const [open, setOpen] = useState(false);

  // Active link URL se nikalta hai — refresh ya direct link par bhi sahi link highlight hoga
  const { pathname } = useLocation();
  const active =
    NAV_LINKS.find((l) => l.to === pathname)?.label ??
    NAV_LINKS.find((l) => l.to !== "/" && pathname.startsWith(l.to))?.label ??
    "";

  // Route badalte hi (back button / link) mobile menu band ho jaye
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc dabane par mobile menu band
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Custom animations (Tailwind config ki zaroorat nahi) — upar se neeche */}
      <style>{`
        @keyframes nav-slide-down {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nav-drop-in {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-enter   { animation: nav-slide-down 0.6s cubic-bezier(.2,.8,.2,1) backwards; }
        .nav-item-in { animation: nav-drop-in 0.5s cubic-bezier(.2,.8,.2,1) backwards; }
        @media (prefers-reduced-motion: reduce) {
          .nav-enter, .nav-item-in { animation: none; }
        }
      `}</style>

      <nav
        aria-label="Main"
        className="nav-enter group/nav relative z-50 flex items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12 bg-[#F6EBDC]"
      >
        {/* White background layer — sirf hover par (desktop) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 origin-top scale-y-0 bg-white opacity-0 shadow-[0_6px_18px_-8px_rgba(59,42,32,0.35)] transition-[transform,opacity] duration-500 ease-out md:group-hover/nav:scale-y-100 md:group-hover/nav:opacity-100 motion-reduce:transition-none"
        />

        {/* Logo */}
        <Link
          to="/"
          className="nav-item-in relative z-10 flex items-center gap-2 shrink-0 transition-transform duration-300 hover:scale-105"
          style={{ animationDelay: "100ms" }}
          onClick={() => setOpen(false)}
        >
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-16 sm:h-20 lg:h-28 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="relative z-10 hidden md:flex items-center gap-6 lg:gap-11 ml-auto mr-5 lg:mr-10 text-base lg:text-lg font-medium text-slate-800">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.label}
              className="nav-item-in"
              style={{ animationDelay: `${200 + i * 80}ms` }}
            >
              <Link
                to={link.to}
                aria-current={active === link.label ? "page" : undefined}
                className="group relative block py-1 transition-colors duration-200 hover:text-[#C2571A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2571A]"
              >
                <span
                  className={`transition-colors duration-200 ${
                    active === link.label ? "text-[#C2571A]" : ""
                  }`}
                >
                  {link.label}
                </span>
                {/* Underline: active par full, hover par grow karti hai */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-[#C2571A] transition-all duration-300 ease-out ${
                    active === link.label ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA → Signup page */}
        <Link
          to={JOIN_LINK}
          className="nav-item-in group relative z-10 hidden md:inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D70810] px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#A84812] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D70810]"
          style={{ animationDelay: `${200 + NAV_LINKS.length * 80}ms` }}
        >
          Join a Class
          <ArrowIcon />
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="relative z-10 md:hidden rounded-full p-2.5 text-slate-800 transition-all duration-300 hover:bg-[#F3E7D6] hover:text-[#C2571A] active:scale-90"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span
            className={`block transition-transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </span>
        </button>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          aria-hidden={!open}
          className={`absolute md:hidden top-full left-0 w-full z-50 bg-white border-b border-[#EFE4D3] shadow-md overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
            open ? "max-h-[32rem] opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col items-start gap-1 px-6 py-4">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.label}
                className={`w-full transition-all duration-300 ease-out ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
              >
                <Link
                  to={link.to}
                  tabIndex={open ? 0 : -1}
                  aria-current={active === link.label ? "page" : undefined}
                  onClick={() => setOpen(false)}
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
                open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + NAV_LINKS.length * 60}ms` : "0ms" }}
            >
              {/* Mobile CTA → Signup page */}
              <Link
                to={JOIN_LINK}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
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