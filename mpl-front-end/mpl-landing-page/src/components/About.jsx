import aboutImage from "../assets/mpllogo.jpg";
import { features } from "./features";
import FeatureCard from "./FeatureCard";

export default function About() {
  return (
    <section id="about" className="bg-slate-950 py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* About Section */}
        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left Image */}
          <div className="relative">

            <div className="absolute -inset-6 rounded-3xl bg-yellow-400/10 blur-3xl"></div>

            <img
              src={aboutImage}
              alt="MPL Logo"
              className="relative rounded-3xl border border-white/10 shadow-2xl transition duration-500 hover:scale-105"
            />

          </div>

          {/* Right Content */}
          <div>

            <span className="uppercase tracking-[0.5rem] text-sm text-yellow-400">
              About MPL
            </span>

            <h2 className="mt-6 text-5xl font-black leading-tight text-white">
              Durg's Biggest
              <span className="block text-yellow-400">
                Tennis Ball Cricket
              </span>
              Tournament
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-9 text-gray-300">
              Mandi Premier League is more than just a cricket tournament.
              Every season brings together passionate players, thrilling
              matches, exciting live auctions and unforgettable memories
              for cricket lovers across Durg.
            </p>

            {/* Highlights */}
            <div className="mt-10 flex flex-wrap gap-10">

              <div>
                <h4 className="text-3xl font-bold text-yellow-400">100+</h4>
                <p className="text-gray-400">Players Pariticipated</p>
              </div>

              <div>
                <h4 className="text-3xl font-bold text-yellow-400">35+</h4>
                <p className="text-gray-400">Matches Conducted</p>
              </div>

              <div>
                <h4 className="text-3xl font-bold text-yellow-400">12</h4>
                <p className="text-gray-400">Teams Participated</p>
              </div>

            </div>

            <button className="mt-12 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black transition duration-300 hover:scale-105 hover:bg-yellow-300">
              Learn More
            </button>

          </div>

        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}

        </div>

      </div>
    </section>
  );
}