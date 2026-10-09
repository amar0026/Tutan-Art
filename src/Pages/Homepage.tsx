import About from "../Components/AboutSection";
import Classes from "../Components/Class";
import FeatureCard from "../Components/FeatureCard";
import Gallery from "../Components/GallerySection"; // slider — andar GalleryCard use hota hai
import Hero from "../Components/Herosection";
import Mission from "../Components/Mission";
import Stats from "../Components/Stats";
import Testimonials from "../Components/testimonial";

const Home = () => {
  return (
    <>
      <Hero />
      <FeatureCard />
      <About />
      <Mission />
      <Classes />
      <Stats />
      <Gallery />
      <Testimonials />
    </>
  );
};

export default Home;