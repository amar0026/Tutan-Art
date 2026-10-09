// src/Pages/Profilepage.tsx
// React + Vite + Tailwind CSS (TypeScript)
//
// Route (App.tsx):   <Route path="/profile" element={<ProfilePage />} />
//
// Sidebar ke links (My Classes / Saved Items / Account Settings / Log Out) neeche NAV array mein
// apne routes ke hisaab se badal lo.
//
// NOTE: Videos / profile abhi sirf browser memory mein save hote hain (refresh par chale jaate hain).
// Asli save ke liye props `onSaveProfile`, `onUploadVideo`, `onDeleteVideo` mein apna backend lagao.
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Category = "Drawing" | "Dance" | "Yoga";
type Visibility = "Public" | "Private";
type Filter = "All Videos" | Category;

interface VideoItem {
  id: string;
  title: string;
  category: Category;
  duration: string; // "02:34"
  uploadedAt: string; // "12 Sep 2026"
  visibility: Visibility;
  thumb?: string; // image link (khali ho to video frame / gradient dikhega)
  src?: string; // .mp4 link — play dabane par modal mein chalega
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  location: string;
  about: string;
  avatar?: string;
  memberSince: string;
}

interface UploadMeta {
  title: string;
  category: Category;
  visibility: Visibility;
}

interface ProfilePageProps {
  initialProfile?: ProfileData;
  initialVideos?: VideoItem[];
  /** false ho to upload card par "Available after signup" dikhta hai */
  canUpload?: boolean;
  /** Header ke right side ki bada image (dancer wali). Khali ho to sirf soft gradient dikhega */
  heroImg?: string;
  onSaveProfile?: (p: ProfileData) => Promise<void>;
  onUploadVideo?: (file: File, meta: UploadMeta) => Promise<void>;
  onDeleteVideo?: (id: string) => Promise<void>;
  onLogout?: () => void;
}

/* ------------------------------------------------------------------ */
/* Sample data (👉 apna data / backend yahan se jodo)                   */
/* ------------------------------------------------------------------ */

const IMG_DRAWING = "https://res.cloudinary.com/dquki4xol/image/upload/v1790581017/ChatGPT_Image_Sep_28_2026_01_06_38_PM_lvqhge.png";
const IMG_DANCE = "https://res.cloudinary.com/dquki4xol/image/upload/v1790581290/ChatGPT_Image_Sep_28_2026_01_10_19_PM_zjz6lz.png";
const IMG_YOGA = "https://res.cloudinary.com/dquki4xol/image/upload/v1790580684/ChatGPT_Image_Sep_28_2026_01_00_21_PM_x80zy6.png";

const DEFAULT_PROFILE: ProfileData = {
  name: "Sonali Ray",
  email: "sonaliray@gmail.com",
  phone: "+91 98765 43210",
  dob: "2002-03-15",
  location: "Kolkata, West Bengal",
  about: "I am passionate about art, dance and yoga. I love learning new creative skills and sharing my progress here.",
  memberSince: "12 June 2026",
};

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: "v1", title: "My Art Practice Session", category: "Drawing", duration: "02:34", uploadedAt: "12 Sep 2026", visibility: "Public", thumb: IMG_DRAWING },
  { id: "v2", title: "Bharatanatyam Performance", category: "Dance", duration: "03:18", uploadedAt: "05 Sep 2026", visibility: "Public", thumb: IMG_DANCE },
  { id: "v3", title: "Morning Yoga Routine", category: "Yoga", duration: "04:21", uploadedAt: "28 Aug 2026", visibility: "Private", thumb: IMG_YOGA },
];

const LOCATIONS = [
  "Kolkata, West Bengal",
  "Howrah, West Bengal",
  "Asansol, West Bengal",
  "Durgapur, West Bengal",
  "Siliguri, West Bengal",
  "Delhi",
  "Mumbai, Maharashtra",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Other",
];

const CATEGORIES: Category[] = ["Drawing", "Dance", "Yoga"];
const FILTERS: Filter[] = ["All Videos", "Drawing", "Dance", "Yoga"];
const MAX_VIDEO_MB = 100;
const MAX_AVATAR_MB = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const fmtDuration = (sec: number) => {
  if (!isFinite(sec) || sec <= 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const getDuration = (url: string) =>
  new Promise<number>((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => resolve(v.duration);
    v.onerror = () => resolve(0);
    v.src = url;
  });

const isAllowedVideo = (f: File) => ["video/mp4", "video/quicktime"].includes(f.type) || /\.(mp4|mov)$/i.test(f.name);

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
type IconProps = { size?: number; className?: string };
const mk = (paths: ReactNode) =>
  function Icon({ size = 18, className }: IconProps) {
    return (
      <svg width={size} height={size} {...ic} className={className}>
        {paths}
      </svg>
    );
  };

const UserIcon = mk(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>);
const PlayCircleIcon = mk(<><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5Z" fill="currentColor" /></>);
const ClassesIcon = mk(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="M8 14h2M12 14h2M8 17h2" /></>);
const HeartIcon = mk(<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11Z" />);
const GearIcon = mk(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>);
const LogoutIcon = mk(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>);
const CameraIcon = mk(<><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><circle cx="12" cy="13" r="3.5" /></>);
const MailIcon = mk(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>);
const PhoneIcon = mk(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />);
const CalendarIcon = mk(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>);
const PinIcon = mk(<><path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" /><circle cx="12" cy="9.5" r="2.5" /></>);
const NoteIcon = mk(<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>);
const ChevronIcon = mk(<path d="m6 9 6 6 6-6" />);
const BrushIcon = mk(<><path d="M18.4 2.6a2 2 0 0 1 3 3L12 15l-3-3Z" /><path d="M9 12c-3 0-4 2-4 4 0 2-1 3-2 4 3 .5 7 .2 8.5-2.5A3 3 0 0 0 9 12Z" /></>);
const DanceIcon = mk(<><circle cx="14" cy="4.5" r="1.8" fill="currentColor" /><path d="M14 7.5 11.5 13l4.5 3.5V21M11.5 13 8 21M13 9 6 6.5M13.5 9.5 19 6" /></>);
const LotusIcon = mk(<><path d="M12 5c1.8 2 2.6 4.2 2.6 6.4S13.8 15 12 16.5c-1.8-1.5-2.6-3.1-2.6-5.1S10.2 7 12 5Z" /><path d="M12 16.5c-3.2.4-6.2-1.2-7.5-4.3 2.3-.3 4.2.2 5.6 1.3M12 16.5c3.2.4 6.2-1.2 7.5-4.3-2.3-.3-4.2.2-5.6 1.3M5 18.5c2.3 1.6 4.5 2.2 7 2.2s4.7-.6 7-2.2" /></>);
const GridIcon = mk(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
const UploadCloudIcon = mk(<><path d="M7 18a4.5 4.5 0 0 1-.6-8.960A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 9.5" /><path d="m12 12-3 3m3-3 3 3m-3-3v9" /></>);
const LockIcon = mk(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);
const GlobeIcon = mk(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></>);
const EditIcon = mk(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
const TrashIcon = mk(<><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></>);
const PlusIcon = mk(<path d="M12 5v14M5 12h14" />);
const InfoIcon = mk(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>);
const CloseIcon = mk(<path d="M18 6 6 18M6 6l12 12" />);
const EyeIcon = mk(<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>);

const catIcon: Record<Category, (p: IconProps) => ReactNode> = {
  Drawing: BrushIcon,
  Dance: DanceIcon,
  Yoga: LotusIcon,
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

.pf-serif { font-family: 'Playfair Display', Georgia, serif; }
.pf-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

@keyframes pf-rise   { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pf-left   { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pf-drop   { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pf-line   { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes pf-title  { from { opacity: 0; transform: translateY(-110%); } to { opacity: 1; transform: translateY(0); } }
@keyframes pf-pop    { 0% { transform: scale(.4); opacity: 0; } 70% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
@keyframes pf-modal  { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pf-fade   { from { opacity: 0; } to { opacity: 1; } }
@keyframes pf-shine  { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(300%) skewX(-20deg); } }
@keyframes pf-ping   { 0% { transform: scale(.9); opacity: .6; } 100% { transform: scale(1.8); opacity: 0; } }
@keyframes pf-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes pf-sway   { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes pf-spin   { to { transform: rotate(360deg); } }
@keyframes pf-out    { to { opacity: 0; transform: scale(.9); } }
@keyframes pf-toast  { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes pf-shake  { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
@keyframes pf-draw   { to { stroke-dashoffset: 0; } }

.pf-rise  { animation: pf-rise .7s cubic-bezier(.2,.8,.2,1) backwards; }
.pf-left  { animation: pf-left .7s cubic-bezier(.2,.8,.2,1) backwards; }
.pf-drop  { animation: pf-drop .5s cubic-bezier(.2,.8,.2,1) backwards; }
.pf-line  { transform-origin: left; animation: pf-line .8s cubic-bezier(.2,.8,.2,1) .6s backwards; }
.pf-title { display: block; overflow: hidden; }
.pf-title > span { display: block; animation: pf-title .9s cubic-bezier(.2,.8,.2,1) .15s backwards; }
.pf-pop   { animation: pf-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
.pf-modal { animation: pf-modal .3s cubic-bezier(.2,.8,.2,1) both; }
.pf-fade  { animation: pf-fade .25s ease-out both; }
.pf-float { animation: pf-float 5s ease-in-out infinite; }
.pf-sway  { animation: pf-sway 5s ease-in-out infinite; transform-origin: 50% 100%; }
.pf-spin  { animation: pf-spin .8s linear infinite; }
.pf-out   { animation: pf-out .3s ease-in forwards; }
.pf-toast { animation: pf-toast .35s cubic-bezier(.2,.8,.2,1) both; }
.pf-shake { animation: pf-shake .35s ease-in-out; }
.pf-ping  { animation: pf-ping 1.8s ease-out infinite; }
.pf-check { stroke-dasharray: 26; stroke-dashoffset: 26; animation: pf-draw .45s ease-out .1s forwards; }
.pf-btn:hover:not(:disabled) .pf-shine { animation: pf-shine .8s ease-out; }

@media (prefers-reduced-motion: reduce) {
  .pf-rise, .pf-left, .pf-drop, .pf-line, .pf-title > span, .pf-pop, .pf-modal, .pf-fade, .pf-float,
  .pf-sway, .pf-spin, .pf-toast, .pf-shake, .pf-ping, .pf-btn:hover:not(:disabled) .pf-shine { animation: none !important; }
  .pf-out { animation-duration: 1ms; }
  .pf-check { animation: none; stroke-dashoffset: 0; }
}
`;

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
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

function Heading({ children }: { children: ReactNode }) {
  return (
    <div className="inline-block">
      <h2 className="pf-serif text-2xl font-bold text-[#1A110C] sm:text-3xl">{children}</h2>
      <span className="pf-line mt-1 block h-[3px] w-12 rounded-full bg-[#E8590C]" />
    </div>
  );
}

function Spinner() {
  return <span className="pf-spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />;
}

function Modal({ label, onClose, children, wide }: { label: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="pf-fade fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className={`pf-modal relative max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-[#FFFBF4] shadow-2xl ${wide ? "max-w-3xl" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:rotate-90 hover:bg-[#E8590C] hover:text-white"
        >
          <CloseIcon size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/** Thumbnail: image link > video frame > gradient */
function Thumb({ v }: { v: VideoItem }) {
  if (v.thumb) return <img src={v.thumb} alt={v.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />;
  if (v.src)
    return <video src={`${v.src}#t=0.5`} preload="metadata" muted playsInline className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />;
  return (
    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] text-lg font-bold text-white/90">{v.category}</span>
  );
}

/* ------------------------------------------------------------------ */
/* Upload / Edit modal                                                 */
/* ------------------------------------------------------------------ */

function VideoFormModal({
  mode,
  file,
  video,
  onClose,
  onSubmit,
}: {
  mode: "upload" | "edit";
  file?: File;
  video?: VideoItem;
  onClose: () => void;
  onSubmit: (meta: UploadMeta) => Promise<void>;
}) {
  const [title, setTitle] = useState(video?.title ?? (file ? file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") : ""));
  const [category, setCategory] = useState<Category>(video?.category ?? "Drawing");
  const [visibility, setVisibility] = useState<Visibility>(video?.visibility ?? "Public");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (title.trim().length < 3) {
      setError("Please enter a title (at least 3 characters)");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), category, visibility });
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded-xl border border-[#EBDCC6] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#E8590C] focus:ring-2 focus:ring-[#E8590C]/30";

  return (
    <Modal label={mode === "upload" ? "Upload video" : "Edit video"} onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-5 sm:p-6">
        <h3 className="pf-serif pr-8 text-2xl font-bold text-slate-800">{mode === "upload" ? "Upload New Video" : "Edit Video"}</h3>
        {file && (
          <p className="mt-1 truncate rounded-lg bg-[#FFF3EA] px-3 py-2 text-xs text-[#C2571A]">
            {file.name} &bull; {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        )}

        <label htmlFor="pf-vtitle" className="mt-4 block text-sm font-semibold text-slate-800">Title</label>
        <input id="pf-vtitle" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My Art Practice Session" className={`${field} mt-1.5 ${error ? "pf-shake border-red-400" : ""}`} />
        {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-slate-800">Category</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = catIcon[c];
              const on = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={on}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-300 ${
                    on ? "border-[#E8590C] bg-[#FFF3EA] text-[#C2571A] shadow-sm" : "border-[#EBDCC6] bg-white text-slate-600 hover:-translate-y-0.5 hover:border-[#E8590C]/50"
                  }`}
                >
                  <Icon size={20} />
                  {c}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-slate-800">Visibility</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {(["Public", "Private"] as Visibility[]).map((v) => {
              const on = visibility === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  aria-pressed={on}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    on ? "border-[#E8590C] bg-[#FFF3EA] text-[#C2571A] shadow-sm" : "border-[#EBDCC6] bg-white text-slate-600 hover:-translate-y-0.5 hover:border-[#E8590C]/50"
                  }`}
                >
                  {v === "Public" ? <GlobeIcon size={16} /> : <LockIcon size={16} />}
                  {v}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{visibility === "Public" ? "Everyone can watch this video." : "Only you can see this video."}</p>
        </fieldset>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border-2 border-[#EBDCC6] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#E8590C] hover:text-[#E8590C]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="pf-btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#E8590C] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
          >
            <span aria-hidden="true" className="pf-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25" />
            {busy ? <><Spinner /> Saving...</> : mode === "upload" ? "Upload Video" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const NAV = [
  { key: "details", label: "Personal Details", icon: UserIcon, scrollTo: "pf-details" },
  { key: "videos", label: "My Videos", icon: PlayCircleIcon, scrollTo: "pf-videos" },
  { key: "classes", label: "My Classes", icon: ClassesIcon, to: "/classes" },
  { key: "saved", label: "Saved Items", icon: HeartIcon, to: "/saved" },
  { key: "settings", label: "Account Settings", icon: GearIcon, to: "/settings" },
  { key: "logout", label: "Log Out", icon: LogoutIcon, to: "/login", logout: true },
] as const;

type Toast = { msg: string; kind: "ok" | "err" } | null;

export default function ProfilePage({
  initialProfile = DEFAULT_PROFILE,
  initialVideos = DEFAULT_VIDEOS,
  canUpload = true,
  heroImg = "",
  onSaveProfile,
  onUploadVideo,
  onDeleteVideo,
  onLogout,
}: ProfilePageProps) {
  const navigate = useNavigate();

  /* ----- profile ----- */
  const [saved, setSaved] = useState<ProfileData>(initialProfile);
  const [form, setForm] = useState<ProfileData>(initialProfile);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [activeNav, setActiveNav] = useState("details");
  const nameRef = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const locations = LOCATIONS.includes(form.location) || !form.location ? LOCATIONS : [form.location, ...LOCATIONS];

  /* ----- videos ----- */
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [filter, setFilter] = useState<Filter>("All Videos");
  const [removing, setRemoving] = useState<string | null>(null);
  const [formModal, setFormModal] = useState<null | { mode: "upload"; file: File } | { mode: "edit"; video: VideoItem }>(null);
  const [playing, setPlaying] = useState<VideoItem | null>(null);
  const [toDelete, setToDelete] = useState<VideoItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const videosView = useInView<HTMLElement>(0.05);

  const shown = filter === "All Videos" ? videos : videos.filter((v) => v.category === filter);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ----- profile handlers ----- */
  const setField = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Please enter a valid email";
    const digits = form.phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.dob) e.dob = "Please select your date of birth";
    else if (new Date(form.dob) > new Date()) e.dob = "Date of birth can't be in the future";
    if (!form.location) e.location = "Please select your location";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveProfile = async (ev: FormEvent) => {
    ev.preventDefault();
    if (saving || !validate()) return;
    setSaving(true);
    try {
      if (onSaveProfile) await onSaveProfile(form);
      else await new Promise((r) => setTimeout(r, 900));
      setSaved(form);
      setToast({ msg: "Profile updated successfully", kind: "ok" });
    } catch {
      setToast({ msg: "Could not save changes. Please try again.", kind: "err" });
    } finally {
      setSaving(false);
    }
  };

  const onAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setToast({ msg: "Please choose an image file", kind: "err" });
    if (f.size > MAX_AVATAR_MB * 1024 * 1024) return setToast({ msg: `Image must be under ${MAX_AVATAR_MB} MB`, kind: "err" });
    const url = URL.createObjectURL(f);
    setForm((p) => {
      if (p.avatar?.startsWith("blob:")) URL.revokeObjectURL(p.avatar);
      return { ...p, avatar: url };
    });
    setSaved((p) => ({ ...p, avatar: url }));
    setToast({ msg: "Profile photo updated", kind: "ok" });
  };

  const goNav = (item: (typeof NAV)[number]) => {
    if ("scrollTo" in item) {
      setActiveNav(item.key);
      document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if ("logout" in item) onLogout?.();
    navigate(item.to);
  };

  const editProfile = () => {
    setActiveNav("details");
    document.getElementById("pf-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 450);
  };

  /* ----- video handlers ----- */
  const pickFile = (file?: File) => {
    if (!file) return;
    if (!isAllowedVideo(file)) return setToast({ msg: "Only MP4 or MOV videos are supported", kind: "err" });
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) return setToast({ msg: `Video must be under ${MAX_VIDEO_MB} MB`, kind: "err" });
    setFormModal({ mode: "upload", file });
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (canUpload) pickFile(e.dataTransfer.files?.[0]);
  };

  const submitVideoForm = async (meta: UploadMeta) => {
    if (!formModal) return;
    try {
      if (formModal.mode === "upload") {
        const url = URL.createObjectURL(formModal.file);
        const dur = await getDuration(url);
        if (onUploadVideo) await onUploadVideo(formModal.file, meta);
        else await new Promise((r) => setTimeout(r, 900));
        const item: VideoItem = {
          id: `v${Date.now()}`,
          ...meta,
          duration: fmtDuration(dur),
          uploadedAt: today(),
          src: url,
        };
        setVideos((vs) => [item, ...vs]);
        setFilter("All Videos");
        setToast({ msg: "Video uploaded successfully", kind: "ok" });
      } else {
        const id = formModal.video.id;
        await new Promise((r) => setTimeout(r, 400));
        setVideos((vs) => vs.map((v) => (v.id === id ? { ...v, ...meta } : v)));
        setToast({ msg: "Video updated", kind: "ok" });
      }
      setFormModal(null);
    } catch {
      setToast({ msg: "Something went wrong. Please try again.", kind: "err" });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const v = toDelete;
    setToDelete(null);
    setRemoving(v.id);
    try {
      await onDeleteVideo?.(v.id);
      window.setTimeout(() => {
        setVideos((vs) => vs.filter((x) => x.id !== v.id));
        if (v.src?.startsWith("blob:")) URL.revokeObjectURL(v.src);
        setRemoving(null);
        setToast({ msg: "Video deleted", kind: "ok" });
      }, 300);
    } catch {
      setRemoving(null);
      setToast({ msg: "Could not delete the video", kind: "err" });
    }
  };

  const panel = "rounded-2xl border border-[#F0E2CD] bg-[#FFFBF4]/95 shadow-[0_8px_24px_-16px_rgba(59,42,32,0.35)]";
  const label = "mb-1.5 block text-xs font-semibold text-slate-700";
  const inputBase =
    "w-full rounded-lg border bg-[#FFFDF9] py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:-translate-y-0.5 focus:bg-white focus:shadow-[0_6px_14px_-8px_rgba(232,89,12,0.55)] focus:ring-2 focus:ring-[#E8590C]/30 motion-reduce:transition-none";
  const inputCls = (err?: string) => `${inputBase} ${err ? "pf-shake border-red-400" : "border-[#EBDCC6] focus:border-[#E8590C]"}`;
  const leadIcon = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500";

  return (
    <div className="pf-sans relative overflow-hidden bg-gradient-to-b from-[#FDF3E3] to-[#FCF7F0] pb-12">
      <style>{STYLES}</style>

      {/* decorative brush strokes / leaves */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F6C79A]/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-0 h-40 w-72 rounded-full bg-[#F8D7B0]/50 blur-3xl" />
      <svg aria-hidden="true" viewBox="0 0 60 160" className="pf-sway pointer-events-none absolute -left-2 top-56 hidden h-44 w-16 text-[#9DB38B]/70 xl:block" fill="currentColor">
        <path d="M30 158C28 110 26 60 34 4" stroke="currentColor" strokeWidth="2" fill="none" />
        {[[22, 120, -35], [40, 96, 30], [20, 72, -40], [42, 48, 35], [24, 26, -30]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="7" ry="16" transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </svg>

      {/* ---------- HEADER ---------- */}
      <header className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-md py-4 sm:py-6">
          <h1 className="pf-serif pf-title text-4xl font-extrabold tracking-wide text-[#1A110C] sm:text-5xl lg:text-6xl">
            <span>MY PROFILE</span>
          </h1>
          <p className="pf-drop mt-2 text-sm text-slate-700 sm:text-base" style={{ animationDelay: "0.5s" }}>
            Your creative journey, all in one place.
          </p>
          <span className="pf-line mt-1.5 block h-[3px] w-14 rounded-full bg-[#E8590C]" />
        </div>
        {heroImg && (
          <div className="pf-float pointer-events-none absolute bottom-0 right-2 top-0 hidden w-56 sm:block md:w-72 lg:w-96">
            <img src={heroImg} alt="" className="h-full w-full object-contain object-right-bottom" />
          </div>
        )}
      </header>

      {/* ---------- BODY ---------- */}
      <div className="relative mx-auto mt-4 grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
        {/* ===== Sidebar ===== */}
        <aside className={`${panel} pf-left h-fit p-4 lg:sticky lg:top-6`} style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col items-center text-center">
            <div className="group relative">
              <span aria-hidden="true" className="pf-ping absolute inset-0 rounded-full bg-[#E8590C]/30" />
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-[#F0C986] to-[#E9A98A] shadow-lg ring-2 ring-[#F0C986] sm:h-28 sm:w-28">
                {form.avatar ? (
                  <img src={form.avatar} alt={`${form.name} profile`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <span className="pf-serif flex h-full w-full items-center justify-center text-4xl font-bold text-white">{form.name.trim()[0]?.toUpperCase() ?? "?"}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInput.current?.click()}
                aria-label="Change profile photo"
                className="pf-pop absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8590C] text-white shadow-md ring-2 ring-white transition-all duration-300 hover:scale-110 hover:bg-[#C2571A]"
                style={{ animationDelay: "0.8s" }}
              >
                <CameraIcon size={15} />
              </button>
              <input ref={avatarInput} type="file" accept="image/*" onChange={onAvatar} className="sr-only" tabIndex={-1} />
            </div>

            <h2 className="pf-serif mt-3 text-xl font-bold text-slate-800">{saved.name}</h2>
            <p className="text-xs text-slate-500">Member since {saved.memberSince}</p>

            <button
              type="button"
              onClick={editProfile}
              className="pf-btn group relative mt-3 flex w-full max-w-[13rem] items-center justify-center gap-2 overflow-hidden rounded-full bg-[#E8590C] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] hover:shadow-lg active:translate-y-0"
            >
              <span aria-hidden="true" className="pf-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25" />
              <EditIcon size={16} /> Edit Profile
            </button>
          </div>

          <nav aria-label="Profile" className="mt-4 border-t border-[#F0E2CD] pt-3">
            <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {NAV.map((item, i) => {
                const Icon = item.icon;
                const on = activeNav === item.key;
                return (
                  <li key={item.key} className="pf-rise shrink-0" style={{ animationDelay: `${0.4 + i * 0.07}s` }}>
                    <button
                      type="button"
                      onClick={() => goNav(item)}
                      aria-current={on ? "true" : undefined}
                      className={`group relative flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                        on ? "bg-[#FDE9DA] text-[#E8590C]" : "text-slate-700 hover:bg-white hover:text-[#E8590C] lg:hover:translate-x-1"
                      }`}
                    >
                      <span className={`absolute left-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#E8590C] transition-transform duration-300 lg:block ${on ? "scale-y-100" : "scale-y-0"}`} />
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        <Icon size={19} />
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* ===== Main ===== */}
        <main className="min-w-0 space-y-5">
          {/* ---------- Basic details ---------- */}
          <section id="pf-details" className={`${panel} pf-rise scroll-mt-6 p-5 sm:p-6`} style={{ animationDelay: "0.3s" }}>
            <Heading>Basic Details</Heading>

            <form onSubmit={saveProfile} noValidate className="mt-5">
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Name */}
                <div>
                  <label htmlFor="pf-name" className={label}>Full Name <span className="text-[#E8590C]">*</span></label>
                  <div className="relative">
                    <span className={leadIcon}><UserIcon size={16} /></span>
                    <input id="pf-name" ref={nameRef} type="text" autoComplete="name" value={form.name} onChange={(e) => setField("name", e.target.value)} aria-invalid={!!errors.name} className={inputCls(errors.name)} />
                  </div>
                  {errors.name && <p className="mt-1 pl-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="pf-email" className={label}>Email Address <span className="text-[#E8590C]">*</span></label>
                  <div className="relative">
                    <span className={leadIcon}><MailIcon size={16} /></span>
                    <input id="pf-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setField("email", e.target.value)} aria-invalid={!!errors.email} className={inputCls(errors.email)} />
                  </div>
                  {errors.email && <p className="mt-1 pl-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label htmlFor="pf-phone" className={label}>Phone Number <span className="text-[#E8590C]">*</span></label>
                  <div className="relative">
                    <span className={leadIcon}><PhoneIcon size={16} /></span>
                    <input id="pf-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} aria-invalid={!!errors.phone} className={inputCls(errors.phone)} />
                  </div>
                  {errors.phone && <p className="mt-1 pl-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* DOB */}
                <div>
                  <label htmlFor="pf-dob" className={label}>Date of Birth <span className="text-[#E8590C]">*</span></label>
                  <div className="relative">
                    <span className={leadIcon}><CalendarIcon size={16} /></span>
                    <input id="pf-dob" type="date" max={new Date().toISOString().slice(0, 10)} value={form.dob} onChange={(e) => setField("dob", e.target.value)} aria-invalid={!!errors.dob} className={inputCls(errors.dob)} />
                  </div>
                  {errors.dob && <p className="mt-1 pl-1 text-xs text-red-500">{errors.dob}</p>}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="pf-loc" className={label}>Location <span className="text-[#E8590C]">*</span></label>
                  <div className="relative">
                    <span className={leadIcon}><PinIcon size={16} /></span>
                    <select id="pf-loc" value={form.location} onChange={(e) => setField("location", e.target.value)} aria-invalid={!!errors.location} className={`${inputCls(errors.location)} cursor-pointer appearance-none pr-9`}>
                      <option value="" disabled>Select location</option>
                      {locations.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"><ChevronIcon size={16} /></span>
                  </div>
                  {errors.location && <p className="mt-1 pl-1 text-xs text-red-500">{errors.location}</p>}
                </div>

                {/* About */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label htmlFor="pf-about" className={label}>About Me</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-3 text-slate-500"><NoteIcon size={16} /></span>
                    <textarea id="pf-about" rows={3} maxLength={240} value={form.about} onChange={(e) => setField("about", e.target.value)} className={`${inputBase} resize-none border-[#EBDCC6] focus:border-[#E8590C]`} />
                  </div>
                  <p className="mt-1 text-right text-[11px] text-slate-400">{form.about.length}/240</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                {dirty && <span className="pf-drop text-xs font-medium text-[#C2571A]">You have unsaved changes</span>}
                <button
                  type="submit"
                  disabled={saving || !dirty}
                  className="pf-btn group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#E8590C] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                >
                  <span aria-hidden="true" className="pf-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25" />
                  {saving ? <><Spinner /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </form>
          </section>

          {/* ---------- Creative videos ---------- */}
          <section id="pf-videos" ref={videosView.ref} className={`${panel} scroll-mt-6 p-5 transition-all duration-700 ease-out motion-reduce:transition-none sm:p-6 ${videosView.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <Heading>My Creative Videos</Heading>
              <p className="flex items-start gap-2 rounded-lg bg-[#FBEBDD] px-3 py-2 text-xs text-slate-700 sm:max-w-[17rem] sm:text-[13px]">
                <span className="mt-0.5 shrink-0 text-[#E8590C]"><InfoIcon size={16} /></span>
                Only signed-up users can upload and manage their own videos.
              </p>
            </div>

            {/* Filters + upload */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter videos">
                {FILTERS.map((f) => {
                  const on = filter === f;
                  const Icon = f === "All Videos" ? GridIcon : catIcon[f];
                  return (
                    <button
                      key={f}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setFilter(f)}
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
                        on ? "bg-[#E8590C] text-white shadow-md" : "bg-[#FBEBDD] text-slate-700 hover:-translate-y-0.5 hover:bg-white hover:text-[#E8590C] hover:shadow-sm"
                      }`}
                    >
                      {f !== "All Videos" && <span className={on ? "text-white" : "text-[#E8590C]"}><Icon size={16} /></span>}
                      {f}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!canUpload}
                onClick={() => document.getElementById("pf-video-input")?.click()}
                className="pf-btn group relative flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#E8590C] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span aria-hidden="true" className="pf-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25" />
                <span className="transition-transform duration-300 group-hover:rotate-90"><PlusIcon size={18} /></span>
                Upload New Video
              </button>
            </div>

            {/* Grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {/* Upload card */}
              <label
                htmlFor={canUpload ? "pf-video-input" : undefined}
                onDragOver={(e) => { e.preventDefault(); if (canUpload) setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`group flex min-h-[15rem] flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-all duration-300 ${
                  canUpload
                    ? `cursor-pointer ${dragOver ? "scale-[1.02] border-[#E8590C] bg-[#FFF3EA]" : "border-[#E2CDB0] bg-white/60 hover:-translate-y-1 hover:border-[#E8590C] hover:bg-white hover:shadow-lg"}`
                    : "border-[#E2CDB0] bg-white/60"
                }`}
              >
                <input id="pf-video-input" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" className="sr-only" disabled={!canUpload} onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }} />
                <span className={`text-[#E8590C] ${canUpload ? "pf-float" : ""}`}><UploadCloudIcon size={44} /></span>
                <p className="mt-2 text-sm font-bold text-slate-800">Upload your dance, drawing or yoga video</p>
                <p className="mt-1 text-xs text-slate-500">Supported formats: MP4, MOV (max {MAX_VIDEO_MB} MB)</p>
                {canUpload ? (
                  <span className="mt-3 rounded-full bg-[#FDE9DA] px-3 py-1 text-xs font-medium text-[#C2571A]">{dragOver ? "Drop to upload" : "Click or drag a file here"}</span>
                ) : (
                  <Link to="/signup" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FBE4D2] px-3.5 py-1.5 text-xs font-semibold text-[#C2571A] ring-1 ring-[#F2BE9E] transition hover:bg-[#E8590C] hover:text-white">
                    <LockIcon size={13} /> Available after signup
                  </Link>
                )}
              </label>

              {/* Video cards */}
              {shown.map((v, i) => {
                const CatIcon = catIcon[v.category];
                return (
                  <article
                    key={v.id}
                    className={`group overflow-hidden rounded-xl border border-[#F0E2CD] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${removing === v.id ? "pf-out" : "pf-rise"}`}
                    style={removing === v.id ? undefined : { animationDelay: `${0.05 + Math.min(i, 8) * 0.08}s` }}
                  >
                    <button type="button" onClick={() => setPlaying(v)} aria-label={`Play ${v.title}`} className="relative block aspect-video w-full overflow-hidden bg-[#F1E4D3] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8590C]">
                      <Thumb v={v} />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black/55 pl-0.5 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E8590C]">
                          <span aria-hidden="true" className="pf-ping absolute inset-0 rounded-full bg-white/40 opacity-0 group-hover:opacity-100" />
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.140v13.720a1 1 0 0 0 1.520.850l11.1-6.860a1 1 0 0 0 0-1.7L9.520 4.290A1 1 0 0 0 8 5.140z" /></svg>
                        </span>
                      </span>
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">{v.duration}</span>
                    </button>

                    <div className="p-3">
                      <h3 className="truncate text-sm font-bold text-slate-800" title={v.title}>{v.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="text-[#E8590C]"><CatIcon size={15} /></span>
                        {v.category}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">Uploaded on {v.uploadedAt}</p>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${v.visibility === "Public" ? "bg-[#DDF3E4] text-[#2F6B4F]" : "bg-slate-100 text-slate-600"}`}>
                          {v.visibility === "Public" ? <GlobeIcon size={13} /> : <LockIcon size={13} />}
                          {v.visibility}
                        </span>
                        <span className="flex items-center gap-1">
                          <button type="button" onClick={() => setFormModal({ mode: "edit", video: v })} aria-label={`Edit ${v.title}`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#E8590C] transition-all duration-200 hover:scale-110 hover:bg-[#FDE9DA]">
                            <EditIcon size={16} />
                          </button>
                          <button type="button" onClick={() => setToDelete(v)} aria-label={`Delete ${v.title}`} className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-50">
                            <TrashIcon size={16} />
                          </button>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {shown.length === 0 && (
              <p className="pf-fade mt-6 rounded-xl bg-white/60 px-4 py-8 text-center text-sm text-slate-500">
                No {filter === "All Videos" ? "" : filter.toLowerCase() + " "}videos yet. Upload your first one!
              </p>
            )}
          </section>
        </main>
      </div>

      {/* ---------- Modals ---------- */}
      {formModal && (
        <VideoFormModal
          key={formModal.mode === "upload" ? formModal.file.name : formModal.video.id}
          mode={formModal.mode}
          file={formModal.mode === "upload" ? formModal.file : undefined}
          video={formModal.mode === "edit" ? formModal.video : undefined}
          onClose={() => setFormModal(null)}
          onSubmit={submitVideoForm}
        />
      )}

      {playing && (
        <Modal label={`${playing.title} video`} onClose={() => setPlaying(null)} wide>
          <div className="bg-black">
            {playing.src ? (
              <video src={playing.src} controls autoPlay className="aspect-video w-full" />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-white/80">
                <EyeIcon size={28} />
                Is video ka link abhi add nahi hua. Data mein <code className="rounded bg-white/10 px-1">src</code> daalo.
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="pf-serif text-xl font-bold text-slate-800">{playing.title}</h3>
            <p className="text-xs text-slate-500">{playing.category} &bull; Uploaded on {playing.uploadedAt} &bull; {playing.visibility}</p>
          </div>
        </Modal>
      )}

      {toDelete && (
        <Modal label="Delete video" onClose={() => setToDelete(null)}>
          <div className="p-6 text-center">
            <span className="pf-pop mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500"><TrashIcon size={26} /></span>
            <h3 className="pf-serif mt-3 text-xl font-bold text-slate-800">Delete this video?</h3>
            <p className="mt-1 text-sm text-slate-600">&ldquo;{toDelete.title}&rdquo; will be removed. This can&apos;t be undone.</p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={() => setToDelete(null)} autoFocus className="rounded-xl border-2 border-[#EBDCC6] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#E8590C] hover:text-[#E8590C]">Cancel</button>
              <button type="button" onClick={confirmDelete} className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg">Yes, Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------- Toast ---------- */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`pf-toast fixed bottom-6 left-1/2 z-[110] flex max-w-[92vw] items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium text-white shadow-xl ${toast.kind === "ok" ? "bg-[#2F4A3E]" : "bg-red-500"}`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            {toast.kind === "ok" ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className="pf-check" d="m5 12.5 4.5 4.5L19 7.5" /></svg> : <CloseIcon size={12} />}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}