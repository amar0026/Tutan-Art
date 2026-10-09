// src/Pages/Paymentpage.tsx
// React + Vite + Tailwind CSS (TypeScript)
//
// QR: apni QR image ka link neeche QR_IMAGE_SRC mein paste karo (koi package install nahi karna).
//
// Routes (App.tsx):
//   <Route path="/payment" element={<PaymentPage />} />
//   <Route path="/payment/:slug" element={<PaymentPage />} />      (slug: dance | drawing | yoga)
//
// ClassDetails ke "Enroll Now" button se yahan aate hain:
//   navigate("/payment", { state: { classId: slug, batch: batch.label, price: data.price } });
//
// Online  -> UPI QR scan karke pay karo, phir UTR / Transaction ID submit karo
// Offline -> online payment nahi, office visit karke admission
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* 👉 Yahan apni details daalo                                         */
/* ------------------------------------------------------------------ */

const UPI_ID = "tutanscreation@upi"; // <-- apna asli UPI ID
const PAYEE_NAME = "Tutan's Creation";
const QR_IMAGE_SRC = "https://res.cloudinary.com/dquki4xol/image/upload/v1791539605/QR_code_high_resolution_qvbrga.png"; // 👉 apni QR image ka link yahan paste karo (jaise Cloudinary link)

const OFFICE = {
  address: "3 no, Sreema Road, Near Kathattola, Kolkata - 65",
  phone: "9836365640",
  hours: ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: Closed"],
  mapQuery: "3 Sreema Road Kathattola Kolkata 700065",
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Mode = "Online" | "Offline";
type Stage = "checkout" | "processing" | "success" | "error";

interface Batch {
  id: string;
  label: string;
  /** Ye batch kin modes mein available hai. Khali chhodo to Online + Offline dono. */
  modes?: Mode[];
}

const ALL_MODES: Mode[] = ["Online", "Offline"];
const supports = (b: Batch, m: Mode) => (b.modes ?? ALL_MODES).includes(m);

interface ClassInfo {
  title: string;
  price: number;
  image: string;
  batches: Batch[];
}

export interface EnrollPayload {
  ref: string;
  classId: string;
  batch: string;
  mode: Mode;
  amount: number;
  utr?: string; // sirf online ke liye
}

interface LocationState {
  classId?: string;
  batch?: string;
  price?: number;
}

/* ------------------------------------------------------------------ */
/* Data (ClassDetails ke data se match)                                */
/* ------------------------------------------------------------------ */

const CLASSES: Record<string, ClassInfo> = {
  dance: {
    title: "Dance Classes",
    price: 1500,
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790581290/ChatGPT_Image_Sep_28_2026_01_10_19_PM_zjz6lz.png",
    batches: [
      { id: "d1", label: "Mon, Wed, Fri \u2022 5:00 PM - 6:00 PM" },
      { id: "d2", label: "Tue, Thu \u2022 6:00 PM - 7:00 PM" },
      { id: "d3", label: "Weekend Batch \u2022 10:00 AM - 11:00 AM" },
    ],
  },
  drawing: {
    title: "Drawing Classes",
    price: 1000,
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790581017/ChatGPT_Image_Sep_28_2026_01_06_38_PM_lvqhge.png",
    batches: [
      { id: "r1", label: "Mon, Wed \u2022 4:00 PM - 5:00 PM" },
      { id: "r2", label: "Tue, Thu \u2022 5:00 PM - 6:00 PM" },
      { id: "r3", label: "Weekend Batch \u2022 11:00 AM - 12:00 PM" },
    ],
  },
  yoga: {
    title: "Yoga Classes",
    price: 1200,
    image: "https://res.cloudinary.com/dquki4xol/image/upload/v1790580684/ChatGPT_Image_Sep_28_2026_01_00_21_PM_x80zy6.png",
    batches: [
      { id: "y1", label: "Mon, Wed, Fri \u2022 6:30 AM - 7:30 AM" },
      { id: "y2", label: "Tue, Thu \u2022 7:00 PM - 8:00 PM" },
      { id: "y3", label: "Weekend Batch \u2022 8:00 AM - 9:00 AM" },
    ],
  },
};

const DISCOUNT = 0; // 👉 coupon system lagao to yahan se calculate karo (server par verify karna)

const rupee = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE.mapQuery)}`;

/**
 * 👉 Yahan apna backend call lagao (order/enrolment save karna, admin ko notify karna).
 * Online payment ka UTR admin ko manually / bank statement se verify karna padega,
 * kyunki sirf QR scan se browser ko payment ka proof nahi milta.
 */
async function submitEnrollment(_payload: EnrollPayload): Promise<void> {
  await new Promise((r) => setTimeout(r, 1500));
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} {...ic} strokeWidth={2.6}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" {...ic} className="transition-transform duration-300 group-hover:translate-x-1.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="16" height="16" {...ic}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" {...ic}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const MonitorIcon = () => (
  <svg width="16" height="16" {...ic}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);
const PinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} {...ic}>
    <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" {...ic}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" {...ic}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const CopyIcon = () => (
  <svg width="15" height="15" {...ic}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
const PhoneAppIcon = () => (
  <svg width="16" height="16" {...ic}>
    <rect x="7" y="2" width="10" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap');

.pay-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
.pay-sans  { font-family: 'DM Sans', system-ui, sans-serif; }

@keyframes pay-drop   { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pay-rise   { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pay-swap   { from { opacity: 0; transform: translateY(12px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pay-ring   { 0% { box-shadow: 0 0 0 0 rgba(232,89,12,.5); } 100% { box-shadow: 0 0 0 12px rgba(232,89,12,0); } }
@keyframes pay-pop    { 0% { transform: scale(.4); opacity: 0; } 70% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
@keyframes pay-shine  { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(300%) skewX(-20deg); } }
@keyframes pay-spin   { to { transform: rotate(360deg); } }
@keyframes pay-draw   { to { stroke-dashoffset: 0; } }
@keyframes pay-total  { 0% { transform: scale(1); } 40% { transform: scale(1.12); color: #C2571A; } 100% { transform: scale(1); } }
@keyframes pay-shake  { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
@keyframes pay-scan   { 0% { top: 4%; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: 96%; opacity: 0; } }
@keyframes pay-corner { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes pay-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes pay-confetti {
  0%   { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(120px) rotate(300deg); opacity: 0; }
}

.pay-drop  { animation: pay-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
.pay-rise  { animation: pay-rise .7s cubic-bezier(.2,.8,.2,1) backwards; }
.pay-swap  { animation: pay-swap .5s cubic-bezier(.2,.8,.2,1) both; }
.pay-current { animation: pay-ring 1.8s ease-out infinite; }
.pay-pop   { animation: pay-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
.pay-spin  { animation: pay-spin .8s linear infinite; }
.pay-check { stroke-dasharray: 30; stroke-dashoffset: 30; animation: pay-draw .55s ease-out .3s forwards; }
.pay-total { animation: pay-total .5s ease-out; }
.pay-shake { animation: pay-shake .35s ease-in-out; }
.pay-scan  { animation: pay-scan 2.6s ease-in-out infinite; }
.pay-corner{ animation: pay-corner 1.8s ease-in-out infinite; }
.pay-bounce{ animation: pay-bounce 1.6s ease-in-out infinite; }
.pay-btn:hover:not(:disabled) .pay-shine { animation: pay-shine .9s ease-out; }
.pay-confetti span { position: absolute; top: 0; width: 8px; height: 14px; border-radius: 2px; animation: pay-confetti 1.4s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .pay-drop, .pay-rise, .pay-swap, .pay-current, .pay-pop, .pay-spin, .pay-total, .pay-shake,
  .pay-scan, .pay-corner, .pay-bounce, .pay-btn:hover:not(:disabled) .pay-shine, .pay-confetti span { animation: none !important; }
  .pay-scan { display: none; }
  .pay-check { animation: none; stroke-dashoffset: 0; }
}
`;

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  // current: active step ka 0-based index. Isse pehle ke steps "done" hain.
  return (
    <ol className="pay-drop mx-auto flex w-full max-w-2xl items-start" aria-label="Checkout progress" style={{ animationDelay: "0.1s" }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center" aria-current={active ? "step" : undefined}>
            {i > 0 && (
              <span aria-hidden="true" className="absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 bg-[#E2D3BC]">
                <span
                  className="block h-full origin-left bg-[#E8590C] transition-transform duration-700 ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${i <= current ? 1 : 0})`, transitionDelay: `${i * 120}ms` }}
                />
              </span>
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-500 ${
                done
                  ? "border-[#E8590C] bg-[#E8590C] text-white"
                  : active
                    ? "pay-current border-[#E8590C] bg-[#E8590C] text-white"
                    : "border-[#CDB99C] bg-[#FFFBF4] text-[#8A7660]"
              }`}
            >
              {done ? <CheckIcon size={15} /> : i + 1}
            </span>
            <span
              className={`mt-2 px-1 text-center text-[11px] font-medium leading-tight transition-colors duration-300 sm:text-sm ${
                active ? "text-[#C2571A]" : done ? "text-slate-700" : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* QR panel (Online)                                                   */
/* ------------------------------------------------------------------ */

function QrPanel({
  upiLink,
  amount,
  utr,
  setUtr,
  utrError,
}: {
  upiLink: string;
  amount: number;
  utr: string;
  setUtr: (v: string) => void;
  utrError: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
    } catch {
      /* clipboard block ho to chup-chaap ignore */
    }
  };

  const corner = "pay-corner absolute h-5 w-5 border-[#E8590C]";

  return (
    <div className="pay-swap rounded-2xl border border-[#EBDCC6] bg-white/70 p-4 sm:p-5">
      <h3 className="pay-serif text-xl font-bold text-slate-800">Scan &amp; Pay</h3>
      <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Open any UPI app (GPay, PhonePe, Paytm, BHIM) and scan this QR.</p>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* QR */}
        <div className="relative shrink-0">
          <div className="relative rounded-2xl bg-white p-4 shadow-[0_10px_28px_-14px_rgba(59,42,32,0.55)] ring-1 ring-[#EBDCC6]">
            {QR_IMAGE_SRC ? (
              <img src={QR_IMAGE_SRC} alt="UPI QR code" className="h-44 w-44 object-contain sm:h-48 sm:w-48" />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-lg border-2 border-dashed border-[#E2D3BC] p-3 text-center text-xs text-slate-500 sm:h-48 sm:w-48">
                QR code coming soon. Please use the UPI ID to pay.
              </div>
            )}

            {/* scanner corners + moving line */}
            <span aria-hidden="true" className={`${corner} left-1.5 top-1.5 rounded-tl-lg border-l-2 border-t-2`} />
            <span aria-hidden="true" className={`${corner} right-1.5 top-1.5 rounded-tr-lg border-r-2 border-t-2`} />
            <span aria-hidden="true" className={`${corner} bottom-1.5 left-1.5 rounded-bl-lg border-b-2 border-l-2`} />
            <span aria-hidden="true" className={`${corner} bottom-1.5 right-1.5 rounded-br-lg border-b-2 border-r-2`} />
            <span
              aria-hidden="true"
              className="pay-scan pointer-events-none absolute inset-x-3 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#E8590C] to-transparent shadow-[0_0_10px_rgba(232,89,12,0.8)]"
            />
          </div>
          <p className="mt-2 text-center text-sm font-bold text-[#E8590C]">{rupee(amount)}</p>
        </div>

        {/* Details */}
        <div className="w-full min-w-0 flex-1 space-y-3">
          <div className="rounded-xl bg-[#FFF6EC] px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Pay to</p>
            <p className="text-sm font-semibold text-slate-800">{PAYEE_NAME}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-sm text-slate-700">{UPI_ID}</span>
              <button
                type="button"
                onClick={copy}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                  copied ? "bg-[#2F6B4F] text-white" : "bg-white text-[#C2571A] ring-1 ring-[#EBDCC6] hover:bg-[#E8590C] hover:text-white"
                }`}
                aria-live="polite"
              >
                {copied ? <CheckIcon size={13} /> : <CopyIcon />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Mobile par seedha UPI app kholne ke liye */}
          <a
            href={upiLink}
            className="group flex items-center justify-center gap-2 rounded-xl border-2 border-[#E8590C] bg-white px-4 py-2.5 text-sm font-semibold text-[#E8590C] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF3EA] md:hidden"
          >
            <PhoneAppIcon /> Pay with UPI App
          </a>

          {/* UTR */}
          <div>
            <label htmlFor="pay-utr" className="text-sm font-semibold text-slate-800">
              After paying, enter UTR / Transaction ID
            </label>
            <input
              id="pay-utr"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={12}
              placeholder="12-digit UTR number"
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/\D/g, ""))}
              aria-invalid={!!utrError}
              className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm tracking-wider text-slate-800 outline-none transition-all duration-200 placeholder:tracking-normal placeholder:text-slate-400 focus:ring-2 focus:ring-[#E8590C]/30 ${
                utrError ? "pay-shake border-red-400" : "border-[#EBDCC6] focus:border-[#E8590C]"
              }`}
            />
            {utrError && <p className="mt-1 pl-1 text-xs text-red-500">{utrError}</p>}
            <p className="mt-1.5 text-xs text-slate-500">You&apos;ll find it in your UPI app under payment details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Office panel (Offline)                                              */
/* ------------------------------------------------------------------ */

function OfficePanel({ amount, refId }: { amount: number; refId: string }) {
  const rows = [
    { icon: <PinIcon />, title: "Address", body: <span>{OFFICE.address}</span> },
    {
      icon: <PhoneIcon />,
      title: "Phone",
      body: (
        <a href={`tel:${OFFICE.phone}`} className="transition-colors hover:text-[#C2571A]">
          {OFFICE.phone}
        </a>
      ),
    },
    {
      icon: <ClockIcon />,
      title: "Office Hours",
      body: (
        <>
          {OFFICE.hours.map((h) => (
            <span key={h} className="block">
              {h}
            </span>
          ))}
        </>
      ),
    },
  ];

  return (
    <div className="pay-swap rounded-2xl border border-[#EBDCC6] bg-white/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="pay-bounce flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8590C] text-white shadow-md">
          <PinIcon size={22} />
        </span>
        <div>
          <h3 className="pay-serif text-xl font-bold text-slate-800">Visit Our Office</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Offline classes are enrolled at our studio. No online payment needed &mdash; just visit us to complete your admission.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.title}
            className="pay-rise group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-300 hover:bg-white hover:shadow-sm"
            style={{ animationDelay: `${0.15 + i * 0.1}s` }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBE4D2] text-[#E8590C] transition-all duration-300 group-hover:bg-[#E8590C] group-hover:text-white">
              {r.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.title}</p>
              <div className="text-sm leading-relaxed text-slate-800 break-words">{r.body}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-xl bg-[#FFF6EC] px-3 py-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
        Fee to pay at office: <strong className="text-[#E8590C]">{rupee(amount)}</strong>. Quote reference{" "}
        <strong className="tracking-wide">{refId}</strong> at the desk.
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-center gap-2 rounded-xl border-2 border-[#E8590C] bg-white px-4 py-2.5 text-sm font-semibold text-[#E8590C] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF3EA]"
        >
          <PinIcon /> Get Directions
        </a>
        <a
          href={`tel:${OFFICE.phone}`}
          className="group flex items-center justify-center gap-2 rounded-xl border-2 border-[#EBDCC6] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E8590C] hover:text-[#E8590C]"
        >
          <PhoneIcon /> Call Now
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

function Checkout({
  slug,
  data,
  price,
  initialBatchLabel,
}: {
  slug: string;
  data: ClassInfo;
  price: number;
  initialBatchLabel?: string;
}) {
  const startBatch = data.batches.find((b) => b.label === initialBatchLabel) ?? data.batches[0];

  const [mode, setMode] = useState<Mode>(supports(startBatch, "Online") ? "Online" : "Offline");
  const [batchId, setBatchId] = useState(startBatch.id);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [stage, setStage] = useState<Stage>("checkout");
  const [doneMode, setDoneMode] = useState<Mode>("Online");
  // Reference ek baar bante hi fix rehta hai
  const [refId] = useState(() => `TC${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`);

  const batch = data.batches.find((b) => b.id === batchId) ?? startBatch;
  const batchesForMode = data.batches.filter((b) => supports(b, mode));
  const hasMode = (m: Mode) => data.batches.some((b) => supports(b, m));
  const online = mode === "Online";

  const total = Math.max(price - DISCOUNT, 0);
  const steps = ["Select Class", "Choose Batch", online ? "Payment" : "Visit Office", "Confirmation"];

  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(
    `${data.title} ${refId}`
  )}`;

  useEffect(() => {
    if (stage === "success") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  const changeMode = (m: Mode) => {
    if (!hasMode(m) || m === mode) return;
    setMode(m);
    setUtrError("");
    // Current batch naye mode mein bhi chalta ho to wahi rakho, warna pehla available batch
    if (!supports(batch, m)) {
      const first = data.batches.find((b) => supports(b, m));
      if (first) setBatchId(first.id);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (stage === "processing") return;

    if (online && !/^\d{12}$/.test(utr)) {
      setUtrError("Enter the 12-digit UTR / Transaction ID from your UPI app");
      return;
    }
    setUtrError("");
    setStage("processing");

    try {
      await submitEnrollment({
        ref: refId,
        classId: slug,
        batch: batch.label,
        mode,
        amount: total,
        utr: online ? utr : undefined,
      });
      setDoneMode(mode);
      setStage("success");
    } catch {
      setStage("error");
    }
  };

  const panel = "rounded-2xl border border-[#EBDCC6] bg-[#FFFBF4] shadow-sm";

  /* ---------- SUCCESS ---------- */
  if (stage === "success") {
    const wasOnline = doneMode === "Online";
    const rows: [string, string][] = wasOnline
      ? [
          ["Reference", refId],
          ["Class", data.title],
          ["Batch", batch.label],
          ["Mode", "Online"],
          ["Amount Paid", rupee(total)],
          ["UTR", utr],
        ]
      : [
          ["Reference", refId],
          ["Class", data.title],
          ["Batch", batch.label],
          ["Mode", "Offline"],
          ["Fee at Office", rupee(total)],
        ];

    return (
      <div className="pay-sans min-h-[70vh] bg-[#F6EBDC] px-4 py-8 sm:px-8 lg:px-12">
        <style>{STYLES}</style>
        <div className="mx-auto max-w-5xl">
          <Stepper steps={steps} current={3} />
          <div className={`${panel} pay-rise relative mx-auto mt-10 max-w-lg overflow-hidden p-6 text-center sm:p-10`}>
            <div className="pay-confetti pointer-events-none absolute inset-x-0 top-0 h-0" aria-hidden="true">
              {[8, 22, 36, 50, 64, 78, 90].map((left, i) => (
                <span
                  key={left}
                  style={{
                    left: `${left}%`,
                    background: ["#E8590C", "#F0C986", "#2F4A3E", "#E9A98A"][i % 4],
                    animationDelay: `${0.2 + i * 0.08}s`,
                  }}
                />
              ))}
            </div>

            <span className="pay-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8590C] text-white shadow-lg">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path className="pay-check" d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>

            <h1 className="pay-serif mt-5 text-3xl font-bold text-slate-800 sm:text-4xl">
              {wasOnline ? "Payment Submitted!" : "Seat Reserved!"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              {wasOnline
                ? "Thank you! We'll verify your payment and confirm your enrolment shortly."
                : "Please visit our office with your reference number to complete your admission."}
            </p>

            <dl className="mt-6 divide-y divide-[#EBDCC6] rounded-xl bg-white/70 text-left text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="break-all text-right font-semibold text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>

            {!wasOnline && (
              <p className="mt-4 flex items-start justify-center gap-2 text-sm text-slate-600">
                <span className="mt-0.5 text-[#E8590C]">
                  <PinIcon />
                </span>
                {OFFICE.address}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!wasOnline && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-[#E8590C] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] hover:shadow-lg"
                >
                  Get Directions
                </a>
              )}
              <Link
                to="/"
                className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  wasOnline
                    ? "bg-[#E8590C] text-white shadow-md hover:bg-[#C2571A] hover:shadow-lg"
                    : "border-2 border-[#E8590C] bg-white text-[#E8590C] hover:bg-[#FFF3EA]"
                }`}
              >
                Back to Home
              </Link>
              <Link
                to="/classes"
                className="rounded-xl border-2 border-[#EBDCC6] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E8590C] hover:text-[#E8590C]"
              >
                Explore More Classes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- CHECKOUT ---------- */
  const busy = stage === "processing";

  return (
    <div className="pay-sans relative overflow-hidden bg-[#F6EBDC] px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
      <style>{STYLES}</style>

      <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-[#F0C986]/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#E9A98A]/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Stepper steps={steps} current={2} />

        <form onSubmit={submit} noValidate className="mt-8 grid gap-5 md:grid-cols-[15rem_1fr] lg:mt-10 lg:grid-cols-[15rem_1fr_19rem]">
          {/* ---------- Class card ---------- */}
          <aside className={`${panel} pay-rise h-fit overflow-hidden p-3`} style={{ animationDelay: "0.2s" }}>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-[#F0C986] to-[#E9A98A]">
              <img src={data.image} alt={data.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
            </div>
            <h1 className="pay-serif mt-3 text-2xl font-bold leading-tight text-slate-800">{data.title}</h1>
            <p className="mt-0.5 text-xl font-bold text-[#E8590C]">
              {rupee(price)} <span className="text-sm font-medium text-slate-500">/ month</span>
            </p>
            <Link
              to={`/classes/${slug}`}
              className="mt-2 inline-block text-xs font-medium text-[#C2571A] underline-offset-4 transition-colors hover:text-[#A84812] hover:underline"
            >
              Change class
            </Link>
          </aside>

          {/* ---------- Middle ---------- */}
          <div className={`${panel} pay-rise p-5 sm:p-6`} style={{ animationDelay: "0.3s" }}>
            {/* Class mode */}
            <fieldset>
              <legend className="pay-serif text-xl font-bold text-slate-800">Class Mode</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(["Online", "Offline"] as Mode[]).map((m) => {
                  const on = mode === m;
                  const disabled = !hasMode(m);
                  return (
                    <label
                      key={m}
                      className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                        disabled
                          ? "cursor-not-allowed border-transparent bg-white/40 text-slate-400"
                          : on
                            ? "cursor-pointer border-[#E8590C] bg-[#FFF3EA] text-slate-800 shadow-sm"
                            : "cursor-pointer border-[#EBDCC6] bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:border-[#E8590C]/50 hover:bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={m}
                        checked={on}
                        disabled={disabled}
                        onChange={() => changeMode(m)}
                        className="peer sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#E8590C]/50 peer-focus-visible:ring-offset-2 ${
                          on ? "border-[#E8590C]" : "border-slate-300"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full bg-[#E8590C] transition-transform duration-300 ${on ? "scale-100" : "scale-0"}`} />
                      </span>
                      <span className="flex items-center gap-1.5">
                        {m === "Online" ? <MonitorIcon /> : <PinIcon />}
                        {m}
                      </span>
                      {disabled && <span className="absolute right-2 text-[10px] font-normal">Not available</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Selected batch */}
            <div className="mt-5">
              <label htmlFor="pay-batch" className="pay-serif text-xl font-bold text-slate-800">
                Selected Batch
              </label>
              <div className="relative mt-2">
                <select
                  id="pay-batch"
                  key={mode}
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="pay-drop w-full cursor-pointer appearance-none rounded-xl border border-[#EBDCC6] bg-white py-3 pl-4 pr-10 text-sm text-slate-700 outline-none transition-all duration-200 hover:border-[#E8590C]/50 focus:border-[#E8590C] focus:ring-2 focus:ring-[#E8590C]/30"
                >
                  {batchesForMode.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label} ({mode})
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <ChevronIcon />
                </span>
              </div>
            </div>

            {/* Mode ke hisaab se panel — key badalte hi dobara animate hota hai */}
            <div key={mode} className="mt-5">
              {online ? (
                <QrPanel upiLink={upiLink} amount={total} utr={utr} setUtr={(v) => { setUtr(v); if (utrError) setUtrError(""); }} utrError={utrError} />
              ) : (
                <OfficePanel amount={total} refId={refId} />
              )}
            </div>
          </div>

          {/* ---------- Order summary ---------- */}
          <aside
            className={`${panel} pay-rise h-fit p-5 sm:p-6 md:col-span-2 lg:sticky lg:top-6 lg:col-span-1`}
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="pay-serif text-xl font-bold text-slate-800">Order Summary</h2>

            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-600">Class Fee</dt>
                <dd className="font-medium text-slate-800">{rupee(price)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-600">Discount</dt>
                <dd className="font-medium text-[#2F6B4F]">{DISCOUNT ? `- ${rupee(DISCOUNT)}` : rupee(0)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 text-xs text-slate-500">
                <dt>Batch</dt>
                <dd key={batch.id} className="pay-drop text-right">
                  {batch.label} ({mode})
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center justify-between border-t border-[#EBDCC6] pt-3">
              <span className="text-base font-bold text-slate-800">{online ? "Total" : "Pay at Office"}</span>
              <span key={total} className="pay-total text-2xl font-bold text-[#E8590C]">
                {rupee(total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="pay-btn group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#E8590C] to-[#C2571A] px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8590C] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 motion-reduce:transition-none"
            >
              <span aria-hidden="true" className="pay-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25" />
              {busy ? (
                <>
                  <span className="pay-spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                  <span className="relative">{online ? "Submitting..." : "Reserving..."}</span>
                </>
              ) : (
                <>
                  <span className="relative">{online ? "I've Paid" : "Reserve My Seat"}</span>
                  <span className="relative">
                    <ArrowIcon />
                  </span>
                </>
              )}
            </button>

            {stage === "error" && (
              <p role="alert" className="mt-3 text-center text-sm text-red-500">
                Something went wrong. Please try again.
              </p>
            )}

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
              <span className="text-[#2F6B4F]">
                <LockIcon />
              </span>
              {online ? "Pay only via the QR shown on this page" : "No online payment for offline classes"}
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Route wrapper                                                       */
/* ------------------------------------------------------------------ */

export default function PaymentPage() {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState | null;

  const slug = (paramSlug ?? state?.classId ?? "dance").toLowerCase();
  const data = CLASSES[slug];

  if (!data) return <Navigate to="/classes" replace />;

  return <Checkout key={slug} slug={slug} data={data} price={state?.price ?? data.price} initialBatchLabel={state?.batch} />;
}