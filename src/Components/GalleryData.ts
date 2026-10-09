// src/Components/galleryData.ts
// Gallery ka shared data — home slider (GallerySection) aur Gallery page (GalleryGrid) dono yahin se padhte hain.
import type { GalleryItem } from "./GalleryCard";

/* Pehli 5 images tumhari home slider wali hain.
   `src` khali wali entries abhi placeholder hain — wahan apne Cloudinary links paste karo.
   Nayi photo jodni ho to bas ek aur entry add kar do. */
export const GALLERY: GalleryItem[] = [
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_3_zjktdd.jpg", alt: "Boy drawing at his desk", category: "Drawing" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_5_fppmqi.jpg", alt: "Girls performing classical dance", category: "Dance" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666099/images_4_aehklx.jpg", alt: "Child doing a yoga pose", category: "Yoga" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666099/images_7_sjtlaz.jpg", alt: "Children painting together", category: "Drawing" },
  { src: "https://res.cloudinary.com/dquki4xol/image/upload/v1790666098/images_6_pe9pde.jpg", alt: "Girl performing classical dance", category: "Dance" },

  // 👉 Extra images — apne links yahan paste karo
  { src: "", alt: "Sketching session in the studio", category: "Drawing" },
  { src: "", alt: "Watercolour class in progress", category: "Drawing" },
  { src: "", alt: "Bharatanatyam practice", category: "Dance" },
  { src: "", alt: "Stage performance", category: "Dance" },
  { src: "", alt: "Morning yoga session", category: "Yoga" },
  { src: "", alt: "Meditation and breathing class", category: "Yoga" },
  { src: "", alt: "Annual day celebration", category: "Events" },
];