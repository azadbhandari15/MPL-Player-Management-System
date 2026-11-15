import { useState } from "react";
import { X } from "lucide-react";
import { imageSrc } from "../api/playerApi";

function PlayerAvatar({ imageUrl, name }) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700 text-2xl">
        🏏
      </div>
    );
  }

  return (
    <img
      src={imageSrc(imageUrl)}
      alt={name}
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover"
    />
  );
}

export default function SearchResults({ status, results, onSelect, onClose }) {
  if (status === "idle") return null;

  return (
    <div className="fixed left-1/2 top-28 z-40 w-[calc(100%-3rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-yellow-400">
          Search Results
        </p>
        <button
          onClick={onClose}
          aria-label="Close Results"
          className="flex items-center gap-1 text-sm text-white/70 hover:text-yellow-400"
        >
          <X size={18} />
          Close
        </button>
      </div>

      {status === "loading" && (
        <p className="py-6 text-center text-white/60">Searching...</p>
      )}

      {status === "empty" && (
        <p className="py-6 text-center text-white/60">No player found</p>
      )}

      {status === "success" && (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {results.map((p) => (
            <li key={p.playerId}>
              <button
                onClick={() => onSelect(p)}
                className="flex w-full items-center gap-4 rounded-xl bg-slate-800 p-3 text-left transition hover:bg-slate-700"
              >
                <PlayerAvatar imageUrl={p.imageUrl} name={p.playerName} />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-white">
                    {p.playerName}
                  </div>
                  <div className="text-sm text-yellow-400">{p.playerId}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}