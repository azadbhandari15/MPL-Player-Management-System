import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOwnerDetails, formatPurse } from "../api/teamApi";

function Info({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-xl bg-slate-800 px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
      <p className="mt-1 font-semibold text-white break-words">{value}</p>
    </div>
  );
}

export default function TeamDetails() {
  const { ownerId } = useParams();
  const [owner, setOwner] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchOwnerDetails(ownerId)
      .then((data) => {
        if (cancelled) return;
         console.log("owner data:", data);
        console.log("first player:", data.players?.[0]);
        setOwner(data);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId, attempt]);

  const players = owner?.players ?? [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-36 text-white">
      <div className="mx-auto max-w-5xl">
        <Link to="/teams" className="text-sm text-white/60 hover:text-yellow-400">
          ← Back to Teams
        </Link>
        <h1 className="mt-4 text-4xl font-bold">
          Owner <span className="text-yellow-400">Details</span>
        </h1>

        {status === "loading" && (
          <p className="mt-12 text-center text-white/60">Loading Details...</p>
        )}

        {status === "error" && (
          <div className="mt-12 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="mt-4 rounded-full bg-yellow-400 px-6 py-2 font-semibold text-black hover:bg-yellow-300"
            >
              Retry
            </button>
          </div>
        )}

        {status === "success" && owner && (
          <>
            <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold text-yellow-400">{owner.teamName}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="Owner Name" value={owner.ownerName} />
                <Info label="Owner ID" value={owner.ownerRegistrationId ?? ownerId} />
                <Info label="Contact" value={owner.ownerContactNumber} />
                <Info label="Email" value={owner.ownerEmailId} />
                <Info
                  label="Available Purse"
                  value={owner.availablePurse != null ? formatPurse(owner.availablePurse) : undefined}
                />
                <Info
                  label="Registered On"
                  value={
                    owner.registrationDate
                      ? new Date(owner.registrationDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : undefined
                  }
                />
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">
                Players Bought in Auction{" "}
                <span className="text-white/50">({players.length})</span>
              </h2>

              {players.length === 0 ? (
                <p className="mt-6 text-white/60">No players bought yet.</p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {players.map((p, i) => (
                    <div
                      key={p.playerId ?? i}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-800 text-2xl">
                        🏏
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{p.playerName}</p>
                        <p className="text-sm text-white/60">
                          {p.playerType?.replace("_", " ")}
                        </p>
                      </div>

                      {p.bidAmount != null && (
                        <p className="font-bold text-yellow-400">
                          {formatPurse(p.bidAmount)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}