import { useEffect, useState } from "react";
import { X } from "lucide-react";

const TYPE_LABELS = {
  BATSMAN: "Batsman",
  BOWLER: "Bowler",
  ALL_ROUNDER: "All Rounder",
};

const APPS_SCRIPT_URL = "/drive-proxy";
const driveImageCache = new Map();

function PlayerAvatar({ url, name }) {
  const isDriveUrl = typeof url === "string" && url.includes("drive.google.com");

  const [resolvedSrc, setResolvedSrc] = useState(() => {
    if (!url) return null;
    if (!isDriveUrl) return url;
    return driveImageCache.get(url) ?? null;
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);

    if (!url) {
      setResolvedSrc(null);
      return;
    }

    if (!isDriveUrl) {
      setResolvedSrc(url);
      return;
    }

    if (driveImageCache.has(url)) {
      setResolvedSrc(driveImageCache.get(url));
      return;
    }

    let isMounted = true;
    setResolvedSrc(null);

    fetch(`${APPS_SCRIPT_URL}?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.error || !data.url) {
          setFailed(true);
        } else {
          driveImageCache.set(url, data.url);
          setResolvedSrc(data.url);
        }
      })
      .catch(() => {
        if (isMounted) setFailed(true);
      });

    return () => {
      isMounted = false;
    };
  }, [url, isDriveUrl]);

  if (!url || failed) {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-yellow-400 bg-slate-800 text-4xl">
        🏏
      </div>
    );
  }

  if (!resolvedSrc) {
    return (
      <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full border-2 border-yellow-400 bg-slate-800 text-xs text-white/60">
        Loading...
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={name}
      onError={() => setFailed(true)}
      className="h-24 w-24 rounded-full border-2 border-yellow-400 object-cover"
    />
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-2 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="break-all text-right text-white">{children}</span>
    </div>
  );
}

export default function PlayerDetailCard({ player, onClose }) {
  if (!player) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-yellow-400"
        >
          <X size={22} />
        </button>
        <div className="mb-6 flex flex-col items-center">
          <PlayerAvatar url={player.imageUrl} name={player.playerName} />
          <h3 className="mt-3 text-xl font-bold text-white">{player.playerName}</h3>
          <p className="text-yellow-400">{player.playerId}</p>
        </div>
        <Row label="Type">{TYPE_LABELS[player.playerType] || player.playerType}</Row>
        <Row label="Status">{player.registrationStatus}</Row>
        <Row label="Phone">{player.contactNumber}</Row>
        <Row label="Email">{player.playerEmail}</Row>
        {player.cricHerosProfile && (
          <Row label="CricHeros">{player.cricHerosProfile}</Row>
        )}
      </div>
    </div>
  );
}