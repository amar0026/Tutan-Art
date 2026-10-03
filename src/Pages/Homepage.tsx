import About from "../Components/AboutSection";
import Classes from "../Components/ClassesSection";
import FeatureCard from "../Components/FeatureCard";
import Gallery from "../Components/Gallery";
import Hero from "../Components/Herosection";
import Mission from "../Components/Mission";
import Stats from "../Components/Stats";
import Testimonials from "../Components/testimonial";

const Home = () => {
  return (
    <>
      <Hero/>
      <FeatureCard/>
      <About/>
      <Mission/>
      <Classes/>
      <Stats/>
      <Gallery/>
      <Testimonials/>
    </>
  );
};

export default Home;