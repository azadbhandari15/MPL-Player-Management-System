const STORY = [
  "MPL started in 2024 with an idea: to give players who have never taken part in any tournament a chance to be part of one.",
  "Players register themselves, get picked up by teams in the auction, and take part in the season.",
  "Every season we aim to grow the number of teams, bring in more players, and make match days something the whole town looks forward to.",
];

export default function OurStory() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold">Our story</h2>
        <div className="mt-6 max-w-2xl space-y-5 leading-relaxed text-white/70">
          {STORY.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}