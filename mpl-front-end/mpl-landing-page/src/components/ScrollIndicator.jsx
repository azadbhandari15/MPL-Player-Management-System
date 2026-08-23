import { ArrowDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <a
      href="#stats"
      className="
        absolute
        bottom-8
        left-1/2
        z-20
        flex
        -translate-x-1/2
        animate-bounce
        flex-col
        items-center
        text-white
      "
    >
      <span className="mb-2 text-xs tracking-[0.5rem] text-gray-300">
        SCROLL
      </span>

      <ArrowDown size={34} />
    </a>
  );
}