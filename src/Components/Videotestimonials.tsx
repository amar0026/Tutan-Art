import { useEffect, useState } from "react";

type Category = "Drawing" | "Dance" | "Yoga" | "Parents" | "Adult Learners";

interface Testimonial {
    id: number;
    name: string;
    role: string; // Student / Parent / Adult Learner
    category: Category;
    quote: string;
    duration: string;
    thumb: string; // 👉 outside image link yahan paste karo (khali chhodo to initials wala placeholder dikhega)
    videoUrl?: string; // 👉 .mp4 link (optional) — play click par modal mein chalega
}

const FILTERS: ("All" | Category)[] = ["All", "Drawing", "Dance", "Yoga", "Parents", "Adult Learners"];

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Aarohi Mehta",
        role: "Student",
        category: "Drawing",
        quote:
            "I love drawing classes at Tutan's Creation! The teachers make learning so much fun and easy to understand.",
        duration: "0:58",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791187865/Smiling_Girl_Presenting_Bird_Artwork_b7j6ji.png",
    },
    {
        id: 2,
        name: "Riya Patel",
        role: "Student",
        category: "Drawing",
        quote:
            "I have learned so many new techniques and now I feel more confident about my art. Thank you Tutan's Creation!",
        duration: "1:12",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791187863/Smiling_Artist_with_Sunset_Landscape_j9fsrb.png",
    },
    {
        id: 3,
        name: "Vivaan Kapoor",
        role: "Student",
        category: "Drawing",
        quote:
            "The drawing classes have helped me improve my skills a lot. The teachers are very supportive and encouraging.",
        duration: "0:46",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791187865/Young_Artist_Showcases_Pencil_Portrait_eifyeb.png",
    },
    {
        id: 4,
        name: "Ananya Sharma",
        role: "Student",
        category: "Dance",
        quote:
            "Tutan's Creation has helped me become more confident on stage. The dance classes are amazing and so well-structured.",
        duration: "1:20",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791188048/Bharatanatyam_Grace_in_Warm_Light_ijlozs.png",
    },
    {
        id: 5,
        name: "Isha Verma",
        role: "Adult Learner",
        category: "Yoga",
        quote:
            "The yoga classes help me stay calm, focused and positive. I feel more energetic and relaxed now.",
        duration: "1:05",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791188380/Sunlit_Home_Meditation_Retreat_q1eoim.png",
    },
    {
        id: 6,
        name: "Neha Kapoor",
        role: "Parent",
        category: "Parents",
        quote:
            "My daughter has grown so much in confidence after joining. The teachers are patient, caring and truly passionate.",
        duration: "1:15",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791188380/Warm_Home_Office_Portrait_with_Laptop_xearrj.png",
    },
    {
        id: 7,
        name: "Aditya Singh",
        role: "Student",
        category: "Drawing",
        quote:
            "I enjoy every class at Tutan's Creation. I've learned new styles and techniques and made many new friends.",
        duration: "0:52",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791188380/Proud_Young_Artist_at_Work_lwh2im.png",
    },
    {
        id: 8,
        name: "Priya Sharma",
        role: "Student",
        category: "Drawing",
        quote:
            "The instructors give personal attention and always motivate us to do better. I love the creative environment here!",
        duration: "1:08",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791188845/Proud_Artist_Sharing_Her_Sketchbook_fg5y1n.png",
    },
    {
        id: 9,
        name: "Meera Iyer",
        role: "Adult Learner",
        category: "Adult Learners",
        quote:
            "Tutan's Creation is a perfect blend of creativity and mindfulness. The classes are refreshing and very well planned.",
        duration: "1:10",
        thumb: "https://res.cloudinary.com/dquki4xol/image/upload/v1791188845/Warm_Home_Office_Portrait_qgkeyl.png",
    },
];

/* ---------- small pieces ---------- */

function Star() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8590C" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

function PlayIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.1-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
        </svg>
    );
}

function initials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2);
}

/* ---------- card ---------- */

function Card({ t, index, onPlay }: { t: Testimonial; index: number; onPlay: (t: Testimonial) => void }) {
    return (
        <article
            className="vt-card group flex flex-col overflow-hidden rounded-2xl border border-[#EBDCC6] bg-[#FFFBF4] p-2.5 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 70}ms` }}
        >
            {/* Thumbnail */}
            <button
                type="button"
                onClick={() => onPlay(t)}
                aria-label={`Play ${t.name}'s video testimonial`}
                className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#E9D8BE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2571A]"
            >
                {t.thumb ? (
                    <img
                        src={t.thumb}
                        alt={t.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F0C986] to-[#E9A98A] font-serif text-5xl font-bold text-white/90">
                        {initials(t.name)}
                    </span>
                )}

                {/* Play button */}
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="vt-ring absolute h-14 w-14 rounded-full bg-black/30" />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black/55 pl-0.5 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C2571A]">
                        <PlayIcon />
                    </span>
                </span>

                {/* Duration */}
                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                    {t.duration}
                </span>
            </button>

            {/* Quote */}
            <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
                <div className="flex gap-2">
                    <span className="font-serif text-4xl leading-[0.8] text-[#E8590C]" aria-hidden="true">
                        &ldquo;
                    </span>
                    <p className="text-[13px] leading-relaxed text-slate-700 sm:text-sm">&ldquo;{t.quote}&rdquo;</p>
                </div>

                <div className="mt-3 flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} />
                    ))}
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
            </div>
        </article>
    );
}

/* ---------- main section ---------- */

export default function VideoTestimonials() {
    const [filter, setFilter] = useState<"All" | Category>("All");
    const [active, setActive] = useState<Testimonial | null>(null);

    const list = filter === "All" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.category === filter);

    // Modal: Esc se band + background scroll lock
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [active]);

    return (
        <section id="testimonials" className="bg-[#F6EBDC] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
            <style>{`
        @keyframes vt-drop {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vt-ring {
          0%   { transform: scale(0.9); opacity: .55; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes vt-modal {
          from { opacity: 0; transform: translateY(-12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vt-card  { animation: vt-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
        .vt-pills { animation: vt-drop .6s cubic-bezier(.2,.8,.2,1) backwards; }
        .vt-ring  { animation: vt-ring 2.2s ease-out infinite; }
        .vt-modal { animation: vt-modal .35s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .vt-card, .vt-pills, .vt-ring, .vt-modal { animation: none !important; }
        }
      `}</style>

            <div className="mx-auto max-w-6xl">
                {/* Filter pills (mobile par horizontal scroll) */}
                <div
                    className="vt-pills -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="tablist"
                    aria-label="Filter testimonials"
                >
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            role="tab"
                            aria-selected={filter === f}
                            onClick={() => setFilter(f)}
                            className={`shrink-0 rounded-full border px-5 py-1.5 text-sm font-medium transition-all duration-300 active:scale-95 ${filter === f
                                    ? "border-[#C2571A] bg-[#C2571A] text-white shadow-md"
                                    : "border-[#E2D3BC] bg-white text-slate-700 hover:border-[#C2571A] hover:text-[#C2571A]"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Grid — key badalte hi cards dobara animate hote hain */}
                <div key={filter} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {list.map((t, i) => (
                        <Card key={t.id} t={t} index={i} onPlay={setActive} />
                    ))}
                </div>
            </div>

            {/* Video modal */}
            {active && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setActive(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${active.name} video testimonial`}
                >
                    <div
                        className="vt-modal relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActive(null)}
                            aria-label="Close video"
                            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 transition hover:bg-[#C2571A] hover:text-white"
                        >
                            ✕
                        </button>

                        {active.videoUrl ? (
                            <video src={active.videoUrl} poster={active.thumb || undefined} controls autoPlay className="aspect-video w-full" />
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center p-6 text-center text-sm text-white/80">
                                {active.name} ka video abhi add nahi hua. <br />
                                Data mein <code className="mx-1 rounded bg-white/10 px-1">videoUrl</code> daalo.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
