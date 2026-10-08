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

// Route badalne ya hash link (#about, #contact) pe click karne par
// us id wale section tak smooth scroll kar deta hai.
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <Navbar />
      <ScrollToHash />
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
      <Footer />
    </>
  );
}