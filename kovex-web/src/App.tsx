import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Process from "./components/Process";
import WhyUs from "./components/WhyUs";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Process />
        <WhyUs />
        <About />
        <Testimonials />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
