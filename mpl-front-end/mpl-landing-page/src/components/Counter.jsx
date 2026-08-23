import { useEffect, useRef, useState } from "react";

export default function Counter({
  end,
  label,
 suffix = "+",
  duration = 2000,
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;

        started.current = true;

        let start = 0;
        const startTime = performance.now();

        function animate(currentTime) {
          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          const value = Math.floor(progress * end);

          setCount(value);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        }

        requestAnimationFrame(animate);
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(counterRef.current);

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div
      ref={counterRef}
      className="text-center"
    >
      <h3 className="text-5xl md:text-6xl font-black text-yellow-400">
        {count}
        {suffix}
      </h3>

      <p className="mt-3 uppercase tracking-[0.25rem] text-gray-400">
        {label}
      </p>
    </div>
  );
}