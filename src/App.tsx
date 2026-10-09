import { useEffect } from "react";
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

          {/* Auth pages: "Join a Class" -> /signup, Signup page ka "Login" -> /login */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Koi bhi galat/unknown URL (jaise /forgot-password) Home par bhej do */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}