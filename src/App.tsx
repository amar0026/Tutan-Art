import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Homepage";
import About from "./Pages/Aboutpage";
import Classes from "./Pages/Classpage";
import Gallery from "./Pages/Gallerypage";
import Contact from "./Pages/Contactpage";
import Testimonial from "./Pages/Testimonialpage";
import ClassDetails from "./Pages/ClassDetailspage";
import LoginPage from "./Pages/Loginpage";
import SignupPage from "./Pages/SignupPage";
import PaymentPage from "./Pages/PaymentPage";
import ProfilePage from "./Pages/Profilepage";

// Route badalne par top par scroll karta hai.
// Hash link (#about, #contact) ho to us id wale section tak smooth scroll karta hai.
// Section thodi der baad render ho to bhi dhoondhne ke liye kuch baar dobara try karta hai.
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const toTop = () => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    if (!hash) {
      toTop();
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer: number | undefined;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (tries++ < 10) {
        timer = window.setTimeout(tryScroll, 50);
      } else {
        toTop();
      }
    };

    tryScroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

// Neeche-right mein round arrow button: thoda scroll karte hi dikhta hai,
// click par smoothly top par le jaata hai. Ring scroll progress dikhati hai.
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(y > 300);
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const C = 2 * Math.PI * 21; // ring ki lambai (r = 21)

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFBF4] text-[#C2571A] shadow-[0_8px_22px_-8px_rgba(59,42,32,0.55)] transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#C2571A] hover:text-white hover:shadow-[0_14px_28px_-10px_rgba(194,87,26,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2571A] active:scale-90 motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-6 scale-75 opacity-0"
      }`}
    >
      {/* Scroll progress ring */}
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="none" stroke="#EBDCC6" strokeWidth="3" className="transition-colors duration-300 group-hover:stroke-white/30" />
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="#E8590C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          className="transition-colors duration-300 group-hover:stroke-white"
        />
      </svg>

      {/* Arrow */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="relative transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}

export default function App() {
  return (
    // min-h-screen + flex: chhote pages (login/signup) par bhi Footer neeche chipka rahe
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ScrollToHash />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:slug" element={<ClassDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />

          {/* Payment: ClassDetails ke "Enroll Now" se yahan aate hain */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/:slug" element={<PaymentPage />} />

          {/* Navbar ke profile icon se yahan aate hain */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Auth pages: "Join a Class" -> /signup, Signup page ka "Login" -> /login */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Koi bhi galat/unknown URL (jaise /forgot-password) Home par bhej do */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <ScrollToTopButton />
    </div>
  );
}