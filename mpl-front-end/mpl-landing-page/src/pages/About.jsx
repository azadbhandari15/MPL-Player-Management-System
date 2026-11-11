import AboutHero from "../components/about/AboutHero";
import OurStory from "../components/about/OurStory";
import Highlights from "../components/about/Highlights";
import Values from "../components/about/Values";
 
export default function About() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AboutHero />
      <OurStory />
      <Highlights />
      <Values />
    </main>
  );
}
 