import GalleryCard, { type GalleryItem } from "../Components/GalleryCard";
import ClassHero from "../Components/ClassHero";
import ClassesSection from "../Components/Class";

const galleryItems: GalleryItem[] = [
  { src: "", alt: "Drawing class", category: "Drawing" },
  { src: "", alt: "Dance practice", category: "Dance" },
  { src: "", alt: "Morning yoga", category: "Yoga" },
  { src: "", alt: "Annual event", category: "Events" },
];

const ClassesPage = () => {
  const handleOpen = (index: number) => {
    console.log("Open photo", index);
  };

  return (
    <>
      <ClassHero />
      <ClassesSection />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, i) => (
          <GalleryCard key={i} item={item} index={i} onOpen={handleOpen} />
        ))}
      </section>
    </>
  );
};

export default ClassesPage;