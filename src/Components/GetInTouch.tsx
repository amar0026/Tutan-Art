import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Props / config                                                      */
/* ------------------------------------------------------------------ */

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
  /** Google Maps embed ke liye search text */
  mapQuery?: string;
  /**
   * Form submit hone par call hota hai. Apna backend / EmailJS / Web3Forms yahan lagao.
   * Reject (throw) karoge to error message dikhega.
   */
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const DEFAULT_ADDRESS = "3 no, Sreema Road, Near Kathattola, Kolkata - 65";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const PinIcon = () => (
  <svg {...base}>
    <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg {...base}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const MailIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
const ClockIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path className="ct-check" d="m5 13 4 4L19 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.ct-sans { font-family: 'Inter', system-ui, sans-serif; }

@keyframes ct-pin-drop {
  0%   { transform: translateY(-300%); opacity: 0; }
  60%  { transform: translateY(0); opacity: 1; }
  78%  { transform: translateY(-18%); }
  100% { transform: translateY(0); }
}
@keyframes ct-ping {
  0%   { transform: scale(.6); opacity: .55; }
  100% { transform: scale(2.6); opacity: 0; }
}
@keyframes ct-shine {
  0%   { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(260%) skewX(-20deg); }
}
@keyframes ct-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
@keyframes ct-spin { to { transform: rotate(360deg); } }
@keyframes ct-draw { to { stroke-dashoffset: 0; } }
@keyframes ct-pop {
  0%   { transform: scale(.4); opacity: 0; }
  70%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes ct-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.ct-pin  { animation: ct-pin-drop .9s cubic-bezier(.3,.7,.4,1) .6s both; }
.ct-ping { animation: ct-ping 2s ease-out 1.5s infinite; }
.ct-info:hover .ct-icon { animation: ct-bob .6s ease-in-out; }
.ct-spin { animation: ct-spin .8s linear infinite; }
.ct-check { stroke-dasharray: 24; stroke-dashoffset: 24; animation: ct-draw .5s ease-out .25s forwards; }
.ct-pop   { animation: ct-pop .5s ease-out both; }
.ct-shake { animation: ct-shake .35s ease-in-out; }
.ct-btn:hover .ct-btn-shine { animation: ct-shine .8s ease-out; }

@media (prefers-reduced-motion: reduce) {
  .ct-pin, .ct-ping, .ct-spin, .ct-check, .ct-pop, .ct-shake,
  .ct-info:hover .ct-icon, .ct-btn:hover .ct-btn-shine { animation: none !important; }
  .ct-check { stroke-dashoffset: 0; }
}
`;

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function InfoRow({
  icon,
  title,
  children,
  index,
  visible,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className={`ct-info group flex items-start gap-4 rounded-2xl p-3 transition-all duration-500 ease-out hover:bg-white/70 hover:shadow-md motion-reduce:transition-none ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
      }`}
      style={{ transitionDelay: `${200 + index * 110}ms` }}
    >
      <span className="ct-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C2571A] shadow-sm ring-1 ring-[#F0D9C2] transition-all duration-300 group-hover:bg-[#C2571A] group-hover:text-white group-hover:ring-[#C2571A]">
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className="text-sm font-semibold text-[#1A110C]">{title}</h3>
        <div className="mt-0.5 text-sm leading-relaxed text-[#5C4636] break-words">{children}</div>
      </div>
    </div>
  );
}

const fieldCls = (hasError: boolean) =>
  `w-full rounded-xl border bg-[#FFF6EC] px-4 py-3 text-sm text-[#1A110C] placeholder:text-[#A38C79] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:bg-white focus:shadow-[0_6px_16px_-8px_rgba(194,87,26,0.5)] focus:ring-2 focus:ring-[#C2571A]/40 motion-reduce:transition-none ${
    hasError ? "border-red-400 ct-shake" : "border-[#F0D9C2] focus:border-[#C2571A]"
  }`;

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function Contact({
  address = DEFAULT_ADDRESS,
  phone = "+91 98363 65640",
  email = "info@tutanscreation.com",
  hours = ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: Closed"],
  mapQuery = DEFAULT_ADDRESS,
  onSubmit,
}: ContactProps) {
  const { ref, visible } = useInView<HTMLElement>();

  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mapActive, setMapActive] = useState(false);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const update = (key: keyof ContactFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Please enter a valid email";
    if (form.message.trim().length < 5) e.message = "Please write a short message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(form);
      } else {
        // TODO: yahan apna backend / EmailJS / Web3Forms call lagao.
        await new Promise((r) => setTimeout(r, 1000));
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const reveal = (from = "translate-y-6") =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${
      visible ? "translate-x-0 translate-y-0 opacity-100" : `${from} opacity-0`
    }`;

  return (
    <section
      id="contact"
      ref={ref}
      className="ct-sans relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#FCF7F0] to-[#FAEBDC] px-4 py-12 sm:px-6 md:py-16"
    >
      <style>{STYLES}</style>

      {/* soft decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#F6D9BC]/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-20 h-56 w-56 rounded-full bg-[#F3C9A5]/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className={`text-center ${reveal("translate-y-5")}`}>
          <h2 className="text-2xl font-bold tracking-wide text-[#1A110C] sm:text-3xl">CONTACT US</h2>
          <span
            aria-hidden="true"
            className={`mx-auto mt-1.5 block h-[3px] rounded-full bg-[#C2571A] transition-all duration-700 ease-out motion-reduce:transition-none ${
              visible ? "w-14" : "w-0"
            }`}
            style={{ transitionDelay: "250ms" }}
          />
          <p className="mx-auto mt-3 max-w-md text-sm text-[#5C4636]">
            Have a question or want to join a class? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Info + Form */}
        <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          {/* Info column */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <InfoRow index={0} visible={visible} icon={<PinIcon />} title="Address">
              {address}
            </InfoRow>
            <InfoRow index={1} visible={visible} icon={<PhoneIcon />} title="Phone">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition-colors hover:text-[#C2571A]">
                {phone}
              </a>
            </InfoRow>
            <InfoRow index={2} visible={visible} icon={<MailIcon />} title="Email">
              <a href={`mailto:${email}`} className="transition-colors hover:text-[#C2571A]">
                {email}
              </a>
            </InfoRow>
            <InfoRow index={3} visible={visible} icon={<ClockIcon />} title="Working Hours">
              {hours.map((h) => (
                <p key={h}>{h}</p>
              ))}
            </InfoRow>
          </div>

          {/* Form column */}
          <div
            className={`rounded-3xl bg-white/60 p-5 shadow-[0_10px_30px_-15px_rgba(59,42,32,0.35)] ring-1 ring-[#F0D9C2] backdrop-blur-sm sm:p-7 ${reveal("translate-x-8")}`}
            style={{ transitionDelay: "300ms" }}
          >
            <h3 className="text-lg font-bold text-[#1A110C]">Send Us a Message</h3>
            <span className="mt-1 block h-[3px] w-10 rounded-full bg-[#C2571A]" />

            {status === "sent" ? (
              <div className="flex min-h-[18rem] flex-col items-center justify-center text-center" role="status">
                <span className="ct-pop flex h-16 w-16 items-center justify-center rounded-full bg-[#C2571A] text-white shadow-lg">
                  <CheckIcon />
                </span>
                <p className="mt-4 text-lg font-semibold text-[#1A110C]">Thank you!</p>
                <p className="mt-1 text-sm text-[#5C4636]">Your message has been sent. We&apos;ll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-5 text-sm font-semibold text-[#C2571A] underline-offset-4 transition-colors hover:text-[#A24C1D] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                <div>
                  <label htmlFor="ct-name" className="sr-only">Your Name</label>
                  <input
                    id="ct-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    className={fieldCls(!!errors.name)}
                  />
                  {errors.name && <p className="mt-1 pl-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="ct-email" className="sr-only">Your Email</label>
                  <input
                    id="ct-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    className={fieldCls(!!errors.email)}
                  />
                  {errors.email && <p className="mt-1 pl-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="ct-msg" className="sr-only">Your Message</label>
                  <textarea
                    id="ct-msg"
                    rows={5}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    className={`${fieldCls(!!errors.message)} resize-none`}
                  />
                  {errors.message && <p className="mt-1 pl-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="ct-btn group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#C2571A] px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#A84812] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2571A] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 motion-reduce:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className="ct-btn-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25"
                  />
                  {status === "sending" ? (
                    <>
                      <span className="ct-spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                      <span className="relative">Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Send Message</span>
                      <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">
                        <ArrowIcon />
                      </span>
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p role="alert" className="text-center text-sm text-red-500">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Map */}
        <div
          className={`relative mt-10 overflow-hidden rounded-3xl bg-[#EFE4D3] shadow-[0_14px_34px_-16px_rgba(59,42,32,0.5)] ring-1 ring-[#F0D9C2] ${reveal("translate-y-8")}`}
          style={{ transitionDelay: "500ms" }}
          onMouseLeave={() => setMapActive(false)}
        >
          <iframe
            title="Tutan's Creation location"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`h-64 w-full border-0 sm:h-80 lg:h-96 ${mapActive ? "" : "pointer-events-none"}`}
          />

          {/* Click-to-interact overlay: mobile par page scroll na atke */}
          {!mapActive && (
            <button
              type="button"
              onClick={() => setMapActive(true)}
              aria-label="Click to interact with the map"
              className="group absolute inset-0 flex items-end justify-center bg-[#3B2A20]/0 pb-4 transition-colors duration-300 hover:bg-[#3B2A20]/10"
            >
              <span className="translate-y-2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-[#3B2A20] opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                Click to explore the map
              </span>
            </button>
          )}

          {/* Animated pin (sirf load par dikhta hai, map interact karte hi hat jaata hai) */}
          {visible && !mapActive && (
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2">
              <span className="ct-ping absolute left-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C2571A]/40" />
              <div className="ct-pin relative text-[#D70810] drop-shadow-lg">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
                  <circle cx="12" cy="9.5" r="2.6" fill="#fff" />
                </svg>
              </div>
            </div>
          )}

          {/* Open in Google Maps */}
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="group absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-[#C2571A] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C2571A] hover:text-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2571A]"
          >
            Open in Maps
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}