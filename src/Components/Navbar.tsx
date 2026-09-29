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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
    // Warm cream background + halka rose border = soft aur professional look
    <nav className="relative flex items-center justify-between px-5 py-3 sm:px-8 bg-[#FFF8F3] border-b border-rose-100 shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setActive("Home")}>
        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-20 w-auto object-contain"
        />
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              onClick={() => setActive(link.label)}
              className="relative py-1 block transition-colors duration-200 hover:text-rose-600"
            >
              <span className={active === link.label ? "text-rose-600" : ""}>
                {link.label}
              </span>
              <span
                className={`absolute left-0 -bottom-0.5 h-0.5 bg-rose-600 rounded-full transition-all duration-300 ease-out ${
                  active === link.label ? "w-full" : "w-0"
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
        className="hidden md:inline-flex items-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        Enroll Now
      </Link>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-slate-700"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile menu (navbar ke same cream bg ke saath) */}
      <div
        className={`absolute md:hidden top-full left-0 w-full z-50 bg-[#FFF8F3] border-b border-rose-100 shadow-md overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-start gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="w-full">
              <Link
                to={link.to}
                onClick={() => {
                  setActive(link.label);
                  setOpen(false);
                }}
                className={`block w-full text-left py-2 text-sm font-medium border-l-2 pl-3 transition-colors duration-200 ${
                  active === link.label
                    ? "text-rose-600 border-rose-600"
                    : "text-slate-700 border-transparent hover:text-rose-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="w-full">
            <Link
              to="/#contact"
              onClick={() => {
                setActive("Contact");
                setOpen(false);
              }}
              className="mt-2 block w-full text-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-600"
            >
              Enroll Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}