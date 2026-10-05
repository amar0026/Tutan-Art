
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

// 👉 Sirf ek image: studio + ladki — outside link yahan paste karo
const BG_IMG: string =
  "https://res.cloudinary.com/dquki4xol/image/upload/v1791198898/Serene_Yoga_Meditation_Studio_piefk7.png";

interface SignupPageProps {
  onSignup?: (data: { name: string; email: string; password: string }) => void | Promise<void>;
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

const UserIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
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
    <path fill="#fff" d="M13.5 20v-6.8h2.3l.4-2.7h-2.7V8.8c0-.8.2-1.3 1.3-1.3h1.4V5.1c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.3v2.7h2.3V20h2.9z" />
  </svg>
);

/* ---------- shared classes ---------- */

const inputWrap =
  "sp-drop group flex items-center gap-3 rounded-xl border border-[#E8DCC8] bg-white px-4 py-3 text-slate-400 transition-all duration-300 focus-within:border-[#C2571A] focus-within:text-[#C2571A] focus-within:shadow-[0_0_0_3px_rgba(194,87,26,0.15)]";
const inputCls = "w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none";
const socialBtn =
  "sp-drop flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C2571A]/50 hover:shadow-md active:translate-y-0";

/* ---------- small field helpers ---------- */

function Field({ icon, delay, children }: { icon: ReactNode; delay: number; children: ReactNode }) {
  return (
    <label className={inputWrap} style={{ animationDelay: `${delay}s` }}>
      {icon}
      {children}
    </label>
  );
}

function PasswordField({
  value,
  onChange,
  placeholder,
  autoComplete,
  delay,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  delay: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field icon={<LockIcon />} delay={delay}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={inputCls}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="text-slate-400 transition-colors hover:text-[#C2571A]"
      >
        <EyeIcon off={show} />
      </button>
    </Field>
  );
}

/* ---------- page ---------- */

export default function SignupPage({ onSignup, onGoogle, onFacebook }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!agree) return setError("Please accept the Terms & Conditions and Privacy Policy.");

    try {
      setLoading(true);
      await onSignup?.({ name: name.trim(), email, password }); // 👉 yahan apna signup API call jodo
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-[#F6EBDC] lg:min-h-[760px]">
      {/* Local styles: fonts + keyframes — sab upar se neeche */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&family=Caveat:wght@600&display=swap');

        .sp-serif  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sp-sans   { font-family: 'DM Sans', system-ui, sans-serif; }
        .sp-script { font-family: 'Caveat', cursive; }

        @keyframes sp-line-down { from { opacity: 0; transform: translateY(-110%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sp-drop      { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sp-card      { from { opacity: 0; transform: translateY(-28px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes sp-reveal    { from { clip-path: inset(0 0 100% 0); opacity: 0; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
        @keyframes sp-sway      { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes sp-spin      { to { transform: rotate(360deg); } }

        .sp-line  { display: block; overflow: hidden; }
        .sp-line > span { display: block; animation: sp-line-down .9s cubic-bezier(.2,.8,.2,1) backwards; }
        .sp-drop  { animation: sp-drop .7s cubic-bezier(.2,.8,.2,1) backwards; }
        .sp-card  { animation: sp-card .9s cubic-bezier(.2,.8,.2,1) .5s backwards; }
        .sp-reveal{ animation: sp-reveal 1.3s cubic-bezier(.6,0,.2,1) backwards; }
        /* Background image fit: ladki (left-bottom) hamesha dikhe, kabhi stretch na ho */
        .sp-bg {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 12% bottom;
        }
        @media (min-width: 768px)  { .sp-bg { background-position: left bottom; } }
        @media (min-width: 1536px) { .sp-bg { background-position: left 85%; } }

        /* Cream wash */
        .sp-wash { background: linear-gradient(to bottom, rgba(246,235,220,.88) 0%, rgba(246,235,220,.45) 35%, rgba(246,235,220,.15) 100%); }
        @media (min-width: 1024px) {
          .sp-wash { background: linear-gradient(to bottom right, rgba(246,235,220,.92) 0%, rgba(246,235,220,.5) 28%, rgba(246,235,220,0) 55%); }
        }

        .sp-sway  { transform-origin: 50% 100%; animation: sp-sway 5s ease-in-out infinite; }
        .sp-spin  { animation: sp-spin .8s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .sp-line > span, .sp-drop, .sp-card, .sp-reveal, .sp-sway, .sp-spin { animation: none !important; }
        }
      `}</style>

      {/* Background image (outside link) — ladki left mein */}
      <div
        className="sp-reveal sp-bg absolute inset-0 -z-20"
        style={{ backgroundImage: `url(${BG_IMG})`, animationDelay: "0.2s" }}
        aria-hidden="true"
      />
      {/* Cream wash: mobile par poora halka, desktop par sirf upar-left text ke liye */}
      <div
        className="sp-wash absolute inset-0 -z-10"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-12">
        {/* Left: brand */}
        <div className="flex items-start gap-3 self-start lg:pt-4">
          <svg
            className="sp-sway hidden h-24 w-10 shrink-0 sm:block lg:h-28 lg:w-12"
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
            <h1 className="sp-serif text-4xl font-bold leading-[1.05] tracking-wide text-slate-800 sm:text-5xl lg:text-6xl">
              <span className="sp-line">
                <span style={{ animationDelay: "0.35s" }}>TUTAN&rsquo;S</span>
              </span>
              <span className="sp-line">
                <span style={{ animationDelay: "0.5s" }}>CREATION</span>
              </span>
            </h1>
            <p className="sp-script sp-drop mt-2 text-xl text-slate-800 sm:text-2xl" style={{ animationDelay: "0.8s" }}>
              Draw &bull; Move &bull; Breathe &bull; Grow
            </p>
            <p className="sp-sans sp-drop mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-700" style={{ animationDelay: "1s" }}>
              A creative space for art, movement and mindfulness.
            </p>
          </div>
        </div>

        {/* Right: signup card */}
        <div className="sp-card mx-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_20px_50px_-15px_rgba(59,42,32,0.35)] backdrop-blur-sm sm:p-8 lg:ml-auto lg:mr-0">
          <div className="text-center">
            <h2 className="sp-serif sp-drop text-3xl font-bold text-slate-800 sm:text-4xl" style={{ animationDelay: "0.8s" }}>
              Create Your Account
            </h2>
            <p className="sp-sans sp-drop mx-auto mt-1 max-w-[17rem] text-xs leading-relaxed text-slate-500" style={{ animationDelay: "0.9s" }}>
              Join Tutan&rsquo;s Creation and start your creative journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="sp-sans mt-6 space-y-3.5">
            <Field icon={<UserIcon />} delay={1}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                autoComplete="name"
                required
                className={inputCls}
              />
            </Field>

            <Field icon={<MailIcon />} delay={1.1}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                autoComplete="email"
                required
                className={inputCls}
              />
            </Field>

            <PasswordField value={password} onChange={setPassword} placeholder="Password" autoComplete="new-password" delay={1.2} />
            <PasswordField value={confirm} onChange={setConfirm} placeholder="Confirm Password" autoComplete="new-password" delay={1.3} />

            <label className="sp-drop flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-slate-600" style={{ animationDelay: "1.4s" }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#C2571A]"
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="font-medium text-[#C2571A] hover:text-[#A84812] hover:underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-medium text-[#C2571A] hover:text-[#A84812] hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-[#D70810]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="sp-drop group flex w-full items-center justify-center gap-2 rounded-full bg-[#C2571A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A84812] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ animationDelay: "1.5s" }}
            >
              {loading ? (
                <span className="sp-spin h-5 w-5 rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  Sign Up <ArrowIcon />
                </>
              )}
            </button>
          </form>

          <div className="sp-sans sp-drop my-4 flex items-center gap-3 text-xs text-slate-400" style={{ animationDelay: "1.6s" }}>
            <span className="h-px flex-1 bg-[#E8DCC8]" />
            or continue with
            <span className="h-px flex-1 bg-[#E8DCC8]" />
          </div>

          <div className="sp-sans space-y-3">
            <button type="button" onClick={onGoogle} className={socialBtn} style={{ animationDelay: "1.7s" }}>
              <GoogleIcon /> Continue with Google
            </button>
            <button type="button" onClick={onFacebook} className={socialBtn} style={{ animationDelay: "1.8s" }}>
              <FacebookIcon /> Continue with Facebook
            </button>
          </div>

          <p className="sp-sans sp-drop mt-5 text-center text-xs text-slate-600" style={{ animationDelay: "1.9s" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#C2571A] transition-colors hover:text-[#A84812] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
