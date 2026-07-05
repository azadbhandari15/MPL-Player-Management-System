import stadium from "../assets/dharamshala.jpg";

import HeroBadge from "./HeroBadge";
import HeroButtons from "./HeroButtons";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${stadium})`,
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/60 to-slate-950/85" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20 md:pt-24">

        <div className="mx-auto flex max-w-5xl flex-col items-center text-center text-white gap-6">

          {/* Badge */}
          <HeroBadge />

          {/* Season */}
          <p className="uppercase tracking-[0.6rem] text-yellow-400 text-sm md:text-base">
            Season 4 • Nov – Dec 2026
          </p>

          {/* Heading */}
          <h1 className="font-black leading-none">

            <span className="block text-[clamp(3.8rem,9vw,7rem)]">
              Mandi Premier
            </span>

            <span className="block text-yellow-400 text-[clamp(4.5rem,10vw,8rem)]">
              League
            </span>

          </h1>

          {/* Description */}
          <p className="max-w-3xl text-lg md:text-2xl leading-8 md:leading-10 text-gray-200">
            The biggest tennis ball cricket tournament in Durg,
            bringing together passionate players, unforgettable
            matches, fierce competition, and thrilling live auctions.
          </p>

          {/* Buttons */}
          <HeroButtons />

        </div>

      </div>

      {/* Scroll Indicator */}

    </section>
  );
}