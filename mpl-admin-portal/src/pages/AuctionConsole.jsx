import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { EP } from "../api/endpoints";
import { formatPts, imageSrc } from "../utils/format";

const STORAGE_KEY = "mpl_live_auction";

function loadSaved() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

// What the public screen needs (matches LiveAuctionState on the backend)
function toPublicState(live) {
  return {
    playerId: live.player.playerId,
    playerName: live.player.playerName,
    playerType: live.player.playerType,
    imageUrl: live.player.imageUrl,
    currentBid: live.currentBid,
    highestBidderTeam: live.highestTeam?.teamName ?? null,
  };
}

function Photo({ url, name }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand-500 bg-neutral-100 text-4xl">
        🏏
      </div>
    );
  }
  return (
    <img
      src={imageSrc(url)}
      alt={name}
      onError={() => setFailed(true)}
      className="h-28 w-28 rounded-full border-4 border-brand-500 object-cover"
    />
  );
}

export default function AuctionConsole() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [live, setLive] = useState(loadSaved); // { player, currentBid, highestTeam, history }
  const [selectedId, setSelectedId] = useState("");
  const [baseBid, setBaseBid] = useState(100);
  const [step, setStep] = useState(50);

  const [busy, setBusy] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [t, p] = await Promise.all([api(EP.teams), api(`${EP.players}?page=0&size=500`)]);
      setTeams(t);
      setPlayers((p.content ?? []).filter((x) => x.registrationStatus !== "SOLD"));
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Keep the local state across refreshes
  useEffect(() => {
    if (live) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(live));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, [live]);

  async function pushLive(state) {
    try {
      await api(EP.liveAuction, { method: "POST", body: toPublicState(state) });
      setSyncError(false);
    } catch {
      setSyncError(true);
    }
  }

  // After a refresh or a backend restart, restore the public screen
  useEffect(() => {
    if (live) pushLive(live);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextBid = live ? (live.highestTeam ? live.currentBid + Number(step) : live.currentBid) : 0;

  function startAuction() {
    const player = players.find((p) => p.playerId === selectedId);
    if (!player || !(Number(baseBid) > 0)) return;
    const next = { player, currentBid: Number(baseBid), highestTeam: null, history: [] };
    setNotice(null);
    setLive(next);
    pushLive(next);
  }

  function placeBid(team) {
    const next = {
      ...live,
      currentBid: nextBid,
      highestTeam: { ownerRegistrationId: team.ownerRegistrationId, teamName: team.teamName },
      history: [...live.history, { currentBid: live.currentBid, highestTeam: live.highestTeam }],
    };
    setLive(next);
    pushLive(next);
  }

  function undoBid() {
    const prev = live.history[live.history.length - 1];
    if (!prev) return;
    const next = {
      ...live,
      currentBid: prev.currentBid,
      highestTeam: prev.highestTeam,
      history: live.history.slice(0, -1),
    };
    setLive(next);
    pushLive(next);
  }

  async function markSold() {
    if (!live?.highestTeam || busy) return;
    const { player, currentBid, highestTeam } = live;
    if (!window.confirm(`Sell ${player.playerName} to ${highestTeam.teamName} for ${formatPts(currentBid)}?`)) return;

    setBusy(true);
    setNotice(null);
    try {
      const res = await api(EP.bidPlayer, {
        method: "POST",
        body: {
          playerId: player.playerId,
          ownerId: highestTeam.ownerRegistrationId,
          auctionStatus: "SOLD",
          auctionSoldAmount: currentBid,
        },
      });
      setNotice({
        type: "success",
        text: `${res?.playerName ?? player.playerName} sold to ${res?.teamName ?? highestTeam.teamName} for ${formatPts(res?.bidAmount ?? currentBid)}`,
      });
      setPlayers((ps) => ps.filter((p) => p.playerId !== player.playerId));
      setLive(null);
      setSelectedId("");
      api(EP.liveAuction, { method: "DELETE" }).catch(() => {}); // make sure the public screen clears
      api(EP.teams).then(setTeams).catch(() => {}); // refresh purses
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function stopAuction() {
    if (busy || !window.confirm("Stop bidding for this player without selling?")) return;
    setBusy(true);
    try {
      await api(EP.liveAuction, { method: "DELETE" });
      setSyncError(false);
    } catch {
      setNotice({ type: "error", text: "The public screen could not be cleared. Try again." });
    }
    setLive(null);
    setBusy(false);
  }

  const input =
    "rounded-lg border border-neutral-300 bg-white px-4 py-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">
          Live <span className="text-brand-600">Auction</span>
        </h1>
        {live && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
              syncError ? "bg-red-100 text-red-700" : "bg-brand-100 text-brand-700"
            }`}
          >
            {syncError ? "Public screen not synced" : "Public screen live"}
          </span>
        )}
      </div>

      {notice && (
        <div
          className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "border-brand-100 bg-brand-50 text-brand-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      {loading && <p className="mt-10 text-neutral-500">Loading...</p>}
      {loadError && (
        <div className="mt-10">
          <p className="text-red-600">{loadError}</p>
          <button
            onClick={loadData}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Start panel */}
      {!loading && !loadError && !live && (
        <section className="mt-8 max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Start auction for a player</h2>
          <p className="text-sm text-neutral-500">{players.length} players available</p>

          <div className="mt-4 flex flex-col gap-4">
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className={input}>
              <option value="">Select a player...</option>
              {players.map((p) => (
                <option key={p.playerId} value={p.playerId}>
                  {p.playerName} · {p.playerType?.replace("_", " ")} · {p.playerId}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm text-neutral-600">
                Base price (pts)
                <input type="number" min="1" value={baseBid} onChange={(e) => setBaseBid(e.target.value)} className={`${input} mt-1 w-full`} />
              </label>
              <label className="text-sm text-neutral-600">
                Bid step (pts)
                <input type="number" min="1" value={step} onChange={(e) => setStep(e.target.value)} className={`${input} mt-1 w-full`} />
              </label>
            </div>

            <button
              onClick={startAuction}
              disabled={!selectedId || !(Number(baseBid) > 0) || !(Number(step) > 0)}
              className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Start Auction
            </button>
          </div>
        </section>
      )}

      {/* Live panel */}
      {live && (
        <>
          <section className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/50 p-6">
            <div className="flex flex-wrap items-center gap-6">
              <Photo url={live.player.imageUrl} name={live.player.playerName} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-neutral-500">Now bidding</p>
                <h2 className="text-3xl font-bold">{live.player.playerName}</h2>
                <span className="mt-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                  {live.player.playerType?.replace("_", " ")}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-neutral-500">Current bid</p>
                <p className="text-4xl font-bold text-brand-600">{formatPts(live.currentBid)}</p>
                <p className="mt-1 text-sm text-neutral-600">
                  {live.highestTeam ? (
                    <>
                      Highest: <b>{live.highestTeam.teamName}</b>
                    </>
                  ) : (
                    "No bids yet"
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={markSold}
                disabled={!live.highestTeam || busy}
                className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {busy ? "Working..." : "Mark Sold"}
              </button>
              <button
                onClick={undoBid}
                disabled={live.history.length === 0 || busy}
                className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm hover:border-brand-600 hover:text-brand-600 disabled:opacity-40"
              >
                Undo last bid
              </button>
              <button
                onClick={stopAuction}
                disabled={busy}
                className="rounded-full border border-red-300 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
              >
                Stop (not sold)
              </button>
              {syncError && (
                <button
                  onClick={() => pushLive(live)}
                  className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm hover:border-brand-600 hover:text-brand-600"
                >
                  Re-sync public screen
                </button>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-bold">
              Teams <span className="font-normal text-neutral-400">· next bid {formatPts(nextBid)}</span>
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {teams.map((t) => {
                const isHighest = live.highestTeam?.ownerRegistrationId === t.ownerRegistrationId;
                const canAfford = Number(t.availablePurse) >= nextBid;
                return (
                  <div
                    key={t.ownerRegistrationId}
                    className={`rounded-2xl border bg-white p-5 shadow-sm ${
                      isHighest ? "border-brand-600 ring-2 ring-brand-500/30" : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold">{t.teamName}</h3>
                      {isHighest && (
                        <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                          Highest
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      Purse: <b className="text-neutral-800">{formatPts(t.availablePurse)}</b>
                    </p>
                    <button
                      onClick={() => placeBid(t)}
                      disabled={isHighest || !canAfford || busy}
                      className="mt-4 w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isHighest ? "Leading" : canAfford ? `Bid ${formatPts(nextBid)}` : "Not enough purse"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}