import { Play } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-5">

      <button
        className="
          rounded-full
          bg-yellow-400
          px-9
          py-4
          font-semibold
          text-black
          shadow-xl
          transition-all
          duration-300
          hover:scale-105
          hover:bg-yellow-300
        "
      >
        Register Now
      </button>

      <button
        className="
          flex
          items-center
          gap-3
          rounded-full
          border
          border-white
          px-9
          py-4
          text-white
          transition-all
          duration-300
          hover:scale-105
          hover:bg-white
          hover:text-black
        "
      >
        <Play size={18} />
        Watch Live Auction
      </button>

    </div>
  );
}