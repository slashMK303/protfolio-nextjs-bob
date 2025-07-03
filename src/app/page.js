import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatIDo from "./components/WhatIDo";
import Works from "./components/Works";
import Contact from "./components/Contact";
import About from "./components/Skills";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <main className="overflow-x-hidden">
        <section id="home" className="section-padding">
          <Hero />
        </section>
        <section id="whatido" className="section-padding">
          <WhatIDo />
        </section>
        <section id="works" className="section-padding">
          <Works />
        </section>
        <section id="about" className="section-padding">
          <About />
        </section>
        <section id="contact" className="section-padding">
          <Contact />
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}