import About from "../Components/AboutSection";
import Classes from "../Components/ClassesSection";
import Gallery from "../Components/Gallery";
import Hero from "../Components/Herosection";
import Stats from "../Components/Stats";
import Testimonials from "../Components/testimonial";

const Home = () => {
  return (
    <>
      <Hero/>
      <About/>
     <Classes/>
     <Stats/>
     <Gallery/>
     <Testimonials/>
    </>
  );
};

export default Home;