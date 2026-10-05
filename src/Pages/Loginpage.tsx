// src/Pages/LoginPage.tsx
// React + Vite + Tailwind CSS (TypeScript)
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

// 👉 Sirf ek image: studio + ladki (drawing ke saath) — outside link yahan paste karo
const BG_IMG: string =
  "https://res.cloudinary.com/dquki4xol/image/upload/v1791198991/Sunlit_Creative_Study_Workspace_c3w0ut.png";

interface LoginPageProps {
  onLogin?: (data: { email: string; password: string; remember: boolean }) => void | Promise<void>;
  onGoogle?: () => void;
  onFacebook?: () => void;
}

/* ---------- icons ---------- */

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);
const LockIcon = () => (
  <svg {...iconProps}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
const EyeIcon = ({ off }: { off: boolean }) => (
  <svg {...iconProps}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="4" y1="4" x2="20" y2="20" />}
  </svg>
);
const ArrowIcon = () => (
  <svg {...iconProps} className="transition-transform duration-300 group-hover:translate-x-1">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36a12 12 0 1 1 0-24c3.1 0 5.8 1.2 8 3l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.7-.4-3.9z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path fill="#fff" d="M13.5 20v-6.8h2.3l.4-2.7h-2.7V8.8c0-.8.2-1.3 1.3-1.3h1.4V5.1c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.600v2h-2.300v2.700h2.300V20h2.900z" />
  </svg>
);

/* ---------- page ---------- */

export default function LoginPage({ onLogin, onGoogle, onFacebook }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      await onLogin?.({ email, password, remember }); // 👉 yahan apna login API call jodo
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputWrap =
    "group flex items-center gap-3 rounded-xl border border-[#E8DCC8] bg-white px-4 py-3 text-slate-400 transition-all duration-300 focus-within:border-[#C2571A] focus-within:text-[#C2571A] focus-within:shadow-[0_0_0_3px_rgba(194,87,26,0.15)]";
  const inputCls =
    "w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none";
  const socialBtn =
    "flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C2571A]/50 hover:shadow-md active:translate-y-0";

  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-[#F6EBDC] lg:min-h-[700px]">
      {/* Local styles: fonts + keyframes — sab upar se neeche */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Caveat:wght@600&display=swap');

        .lp-serif  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .lp-sans   { font-family: 'DM Sans', system-ui, sans-serif; }
        .lp-script { font-family: 'Caveat', cursive; }

        @keyframes lp-line-down { from { opacity: 0; transform: translateY(-110%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lp-drop      { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lp-card      { from { opacity: 0; transform: translateY(-28px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes lp-reveal    { from { clip-path: inset(0 0 100% 0); opacity: 0; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
        @keyframes lp-sway      { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes lp-spin      { to { transform: rotate(360deg); } }

        .lp-line  { display: block; overflow: hidden; }
        .lp-line > span { display: block; animation: lp-line-down .9s cubic-bezier(.2,.8,.2,1) backwards; }
        .lp-drop  { animation: lp-drop .7s cubic-bezier(.2,.8,.2,1) backwards; }
        .lp-card  { animation: lp-card .9s cubic-bezier(.2,.8,.2,1) .5s backwards; }
        .lp-reveal{ animation: lp-reveal 1.3s cubic-bezier(.6,0,.2,1) backwards; }
        /* Background image fit: ladki (left-bottom) hamesha dikhe, kabhi stretch na ho */
        .lp-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 12% bottom;
        }
        @media (min-width: 768px)  { .lp-bg { background-position: left bottom; } }
        @media (min-width: 1536px) { .lp-bg { background-position: left 85%; } }

        /* Cream wash */
        .lp-wash { background: linear-gradient(to bottom, rgba(246,235,220,.88) 0%, rgba(246,235,220,.45) 35%, rgba(246,235,220,.15) 100%); }
        @media (min-width: 1024px) {
          .lp-wash { background: linear-gradient(to bottom right, rgba(246,235,220,.92) 0%, rgba(246,235,220,.5) 28%, rgba(246,235,220,0) 55%); }
        }

        .lp-sway  { transform-origin: 50% 100%; animation: lp-sway 5s ease-in-out infinite; }
        .lp-spin  { animation: lp-spin .8s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .lp-line > span, .lp-drop, .lp-card, .lp-reveal, .lp-sway, .lp-spin { animation: none !important; }
        }
      `}</style>

      {/* Background image (outside link) — ladki left mein */}
      <div
        className="lp-reveal lp-bg absolute inset-0 -z-20"
        style={{ backgroundImage: `url(${BG_IMG})`, animationDelay: "0.2s" }}
        aria-hidden="true"
      />
      {/* Cream wash: mobile par poora halka, desktop par sirf upar-left text ke liye */}
      <div
        className="lp-wash absolute inset-0 -z-10"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-12">
        {/* Left: brand */}
        <div className="flex items-start gap-3 self-start lg:self-start lg:pt-4">
          <svg
            className="lp-sway hidden h-24 w-10 shrink-0 sm:block lg:h-28 lg:w-12"
            viewBox="0 0 60 120"
            fill="none"
            stroke="#4d6a3a"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M30 118 C 30 80, 30 40, 30 6" />
            <path d="M30 30 C 18 26, 14 14, 18 6 C 28 8, 32 20, 30 30 Z" fill="#a9c28a" fillOpacity="0.6" />
            <path d="M30 56 C 44 52, 52 42, 50 32 C 38 34, 30 44, 30 56 Z" fill="#a9c28a" fillOpacity="0.6" />
            <path d="M30 78 C 16 74, 8 64, 10 54 C 22 56, 30 66, 30 78 Z" fill="#a9c28a" fillOpacity="0.6" />
            <path d="M30 100 C 42 96, 50 88, 48 78 C 38 80, 30 88, 30 100 Z" fill="#a9c28a" fillOpacity="0.6" />
          </svg>

          <div>
            <h1 className="lp-serif text-4xl font-bold leading-[1.05] tracking-wide text-slate-800 sm:text-5xl lg:text-6xl">
              <span className="lp-line">
                <span style={{ animationDelay: "0.35s" }}>TUTAN&rsquo;S</span>
              </span>
              <span className="lp-line">
                <span style={{ animationDelay: "0.5s" }}>CREATION</span>
              </span>
            </h1>
            <p className="lp-script lp-drop mt-2 text-xl text-slate-800 sm:text-2xl" style={{ animationDelay: "0.8s" }}>
              Draw &bull; Move &bull; Breathe &bull; Grow
            </p>
            <p className="lp-sans lp-drop mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-700" style={{ animationDelay: "1s" }}>
              A creative space for art, movement and mindfulness.
            </p>
          </div>
        </div>

        {/* Right: login card */}
        <div className="lp-card mx-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_20px_50px_-15px_rgba(59,42,32,0.35)] backdrop-blur-sm sm:p-8 lg:ml-auto lg:mr-0">
          <div className="text-center">
            <h2 className="lp-serif lp-drop text-3xl font-bold text-slate-800 sm:text-4xl" style={{ animationDelay: "0.8s" }}>
              Welcome Back
            </h2>
            <p className="lp-sans lp-drop mx-auto mt-1 max-w-[16rem] text-xs leading-relaxed text-slate-500" style={{ animationDelay: "0.9s" }}>
              Login to continue your creative journey with Tutan&rsquo;s Creation.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="lp-sans mt-6 space-y-4">
            <label className={`${inputWrap} lp-drop`} style={{ animationDelay: "1s" }}>
              <MailIcon />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                autoComplete="email"
                required
                className={inputCls}
              />
            </label>

            <label className={`${inputWrap} lp-drop`} style={{ animationDelay: "1.1s" }}>
              <LockIcon />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="text-slate-400 transition-colors hover:text-[#C2571A]"
              >
                <EyeIcon off={showPw} />
              </button>
            </label>

            <div className="lp-drop flex items-center justify-between text-xs" style={{ animationDelay: "1.2s" }}>
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded accent-[#C2571A]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-[#C2571A] transition-colors hover:text-[#A84812] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-[#D70810]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="lp-drop group flex w-full items-center justify-center gap-2 rounded-full bg-[#C2571A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A84812] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ animationDelay: "1.3s" }}
            >
              {loading ? (
                <span className="lp-spin h-5 w-5 rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  Login <ArrowIcon />
                </>
              )}
            </button>
          </form>

          <div className="lp-sans lp-drop my-5 flex items-center gap-3 text-xs text-slate-400" style={{ animationDelay: "1.4s" }}>
            <span className="h-px flex-1 bg-[#E8DCC8]" />
            or continue with
            <span className="h-px flex-1 bg-[#E8DCC8]" />
          </div>

          <div className="lp-sans space-y-3">
            <button type="button" onClick={onGoogle} className={`${socialBtn} lp-drop`} style={{ animationDelay: "1.5s" }}>
              <GoogleIcon /> Continue with Google
            </button>
            <button type="button" onClick={onFacebook} className={`${socialBtn} lp-drop`} style={{ animationDelay: "1.6s" }}>
              <FacebookIcon /> Continue with Facebook
            </button>
          </div>

          <p className="lp-sans lp-drop mt-6 text-center text-xs text-slate-600" style={{ animationDelay: "1.7s" }}>
            Don&rsquo;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#C2571A] transition-colors hover:text-[#A84812] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
