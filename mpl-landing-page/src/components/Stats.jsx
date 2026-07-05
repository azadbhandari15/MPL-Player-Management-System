import Counter from "./Counter";
import {
  Trophy,
  Users,
  Shield,
  CircleDot,
} from "lucide-react";

const stats = [
  {
    icon: Trophy,
    value: 3,
    suffix: "",
    label: "Seasons",
  },
  {
    icon: CircleDot,
    value: 38,
    suffix: "+",
    label: "Matches",
  },
  {
    icon: Users,
    value: 120,
    suffix: "+",
    label: "Players",
  },
  {
    icon: Shield,
    value: 12,
    suffix: "",
    label: "Teams",
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="uppercase tracking-[0.5rem] text-yellow-400 text-sm">
            OUR JOURNEY
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            MPL In Numbers
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-gray-400">
            Four successful seasons, hundreds of players,
            unforgettable cricket memories.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center"
              >
                <Icon
                  size={44}
                  className="text-yellow-400 mb-5"
                />

                <Counter
                  end={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}