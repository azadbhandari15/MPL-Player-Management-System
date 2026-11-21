import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { EP } from "../api/endpoints";
import { formatPts, imageSrc } from "../utils/format";

const STORAGE_KEY = "mpl_live_auction";
const APPS_SCRIPT_URL = "/drive-proxy";
const BASE_BID = 200;

// Cache resolved Drive data URIs so re-renders or moving from candidate -> live won't re-fetch
const driveImageCache = new Map();

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

function getNextBid(live) {
  if (!live) return 0;
  if (!live.highestTeam) return live.currentBid;
  const increment = live.currentBid >= 3000 ? 200 : 100;
  return live.currentBid + increment;
}

function Photo({ url, name, className = "w-28 sm:w-44" }) {
  const isDriveUrl = typeof url === "string" && url.includes("drive.google.com");

  const [resolvedSrc, setResolvedSrc] = useState(() => {
    if (!url) return null;
    if (!isDriveUrl) return imageSrc(url);
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
      setResolvedSrc(imageSrc(url));
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
      <div
        className={`flex shrink-0 items-center justify-center bg-neutral-100 text-3xl sm:text-5xl ${className}`}
      >
        🏏
      </div>
    );
  }

  if (!resolvedSrc) {
    return (
      <div
        className={`flex shrink-0 animate-pulse items-center justify-center bg-neutral-200 text-xs font-medium text-neutral-500 ${className}`}
      >
        Loading...
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={name}
      onError={() => setFailed(true)}
      className={`shrink-0 object-cover object-top ${className}`}
    />
  );
}

export default function AuctionConsole() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [live, setLive] = useState(loadSaved); // { player, currentBid, highestTeam, history }
  const [candidate, setCandidate] = useState(null); // randomly drawn player, not yet live
  const [drawing, setDrawing] = useState(false);
  const [noPlayersAvailable, setNoPlayersAvailable] = useState(false);

  const [busy, setBusy] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setTeams(await api(EP.teams));
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

  const nextBid = getNextBid(live);

  async function markPlayerUnsold(playerId) {
    return api(EP.bidPlayer, {
      method: "POST",
      body: {
        playerId,
        ownerId: null,
        auctionStatus: "UNSOLD",
        auctionSoldAmount: null,
      },
    });
  }

  async function drawPlayer() {
    if (drawing) return;
    setDrawing(true);
    setNotice(null);
    setNoPlayersAvailable(false);
    try {
      const p = await api(EP.nextPlayer);
      if (!p?.playerId) {
        setCandidate(null);
        setNoPlayersAvailable(true);
      } else {
        setCandidate(p);
      }
    } catch (e) {
      setCandidate(null);
      if (e.status === 404 || /not found|no eligible/i.test(e.message)) {
        setNoPlayersAvailable(true);
      } else {
        setNotice({ type: "error", text: e.message });
      }
    } finally {
      setDrawing(false);
    }
  }

  async function skipCandidate() {
    if (drawing || !candidate) return;
    setDrawing(true);
    setNotice(null);
    setNoPlayersAvailable(false);
    try {
      await markPlayerUnsold(candidate.playerId);
      const p = await api(EP.nextPlayer);
      if (!p?.playerId) {
        setCandidate(null);
        setNoPlayersAvailable(true);
      } else {
        setCandidate(p);
      }
    } catch (e) {
      setCandidate(null);
      if (e.status === 404 || /not found|no eligible/i.test(e.message)) {
        setNoPlayersAvailable(true);
      } else {
        setNotice({ type: "error", text: e.message });
      }
    } finally {
      setDrawing(false);
    }
  }

  function startAuction() {
    if (!candidate) return;
    const next = { player: candidate, currentBid: BASE_BID, highestTeam: null, history: [] };
    setNotice(null);
    setNoPlayersAvailable(false);
    setLive(next);
    setCandidate(null);
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
      setLive(null);
      api(EP.liveAuction, { method: "DELETE" }).catch(() => {}); // make sure the public screen clears
      api(EP.teams).then(setTeams).catch(() => {}); // refresh purses
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function stopAuction() {
    if (busy || !window.confirm("Stop bidding for this player and mark as unsold?")) return;
    const { player } = live;
    setBusy(true);
    setNotice(null);
    try {
      const res = await markPlayerUnsold(player.playerId);
      setNotice({
        type: "success",
        text: `${res?.playerName ?? player.playerName} marked as UNSOLD`,
      });
      try {
        await api(EP.liveAuction, { method: "DELETE" });
        setSyncError(false);
      } catch {
        setSyncError(true);
      }
      setLive(null);
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold sm:text-2xl">
          Live <span className="text-brand-600">Auction</span>
        </h1>
        {live && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest sm:px-3 sm:py-1 sm:text-xs ${
              syncError ? "bg-red-100 text-red-700" : "bg-brand-100 text-brand-700"
            }`}
          >
            {syncError ? "Public screen not synced" : "Public screen live"}
          </span>
        )}
      </div>

      {notice && (
        <div
          className={`mt-2 rounded-lg border px-3 py-1.5 text-xs font-medium sm:mt-3 sm:px-4 sm:py-2.5 sm:text-sm ${
            notice.type === "success"
              ? "border-brand-100 bg-brand-50 text-brand-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      {loading && <p className="mt-4 text-sm text-neutral-500">Loading...</p>}
      {loadError && (
        <div className="mt-4">
          <p className="text-sm text-red-600">{loadError}</p>
          <button
            onClick={loadData}
            className="mt-2 rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Start panel */}
      {!loading && !loadError && !live && (
        <section className="mt-3 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-sm sm:mt-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold sm:text-xl">Next player</h2>
            <p className="hidden text-sm text-neutral-500 sm:block">
              Base price {formatPts(BASE_BID)} · +100 below 3,000, +200 from 3,000+
            </p>
          </div>

          {!candidate ? (
            <div className="mt-3 sm:mt-4">
              {noPlayersAvailable && (
                <p className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-600">
                  No player available for Auction
                </p>
              )}
              <button
                onClick={drawPlayer}
                disabled={drawing}
                className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:w-auto sm:px-7 sm:py-3 sm:text-base"
              >
                {drawing ? "Drawing..." : "🎲 Draw random player"}
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
              <div className="flex flex-row items-stretch overflow-hidden rounded-xl border border-brand-100 bg-brand-50/50 sm:min-h-[180px] sm:rounded-2xl">
                <Photo
                  url={candidate.imageUrl}
                  name={candidate.playerName}
                  className="w-28 sm:w-48"
                />
                <div className="flex flex-col justify-center p-3 sm:p-6">
                  <h3 className="text-base font-bold leading-tight sm:text-2xl">
                    {candidate.playerName}
                  </h3>
                  <span className="mt-1 inline-block w-fit rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700 sm:mt-2 sm:px-3 sm:py-1 sm:text-sm">
                    {candidate.playerType?.replace("_", " ")}
                  </span>
                  <p className="mt-1 text-[11px] text-neutral-500 sm:mt-2 sm:text-sm">
                    {candidate.playerId} · Base {formatPts(BASE_BID)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                <button
                  onClick={startAuction}
                  className="rounded-full bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 sm:px-7 sm:py-2.5 sm:text-sm"
                >
                  Start Auction
                </button>
                <button
                  onClick={skipCandidate}
                  disabled={drawing}
                  className="rounded-full border border-neutral-300 px-4 py-2.5 text-xs font-medium hover:border-brand-600 hover:text-brand-600 disabled:opacity-40 sm:px-6 sm:py-2.5 sm:text-sm"
                >
                  {drawing ? "Skipping..." : "Skip / draw again"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Live panel */}
      {live && (
        <>
          <section className="mt-2.5 flex flex-row items-stretch overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/50 shadow-sm sm:mt-3">
            <Photo
              url={live.player.imageUrl}
              name={live.player.playerName}
              className="w-24 sm:w-44 lg:w-52"
            />
            <div className="flex flex-1 flex-col justify-between p-3 sm:px-6 sm:py-4">
              <div className="flex items-start justify-between gap-2 sm:gap-6">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-500 sm:text-xs">
                    Now bidding
                  </p>
                  <h2 className="truncate text-base font-bold leading-tight sm:text-2xl lg:text-3xl">
                    {live.player.playerName}
                  </h2>
                  <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700 sm:mt-1.5 sm:px-3 sm:py-0.5 sm:text-xs">
                    {live.player.playerType?.replace("_", " ")}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-500 sm:text-xs">
                    Current bid
                  </p>
                  <p className="text-xl font-bold text-brand-600 sm:text-3xl lg:text-4xl">
                    {formatPts(live.currentBid)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-600 sm:mt-1 sm:text-sm">
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

              <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-4 sm:flex sm:flex-wrap sm:gap-2.5">
                <button
                  onClick={markSold}
                  disabled={!live.highestTeam || busy}
                  className="rounded-full bg-brand-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:px-6 sm:py-2 sm:text-sm"
                >
                  {busy ? "..." : "Mark Sold"}
                </button>
                <button
                  onClick={undoBid}
                  disabled={live.history.length === 0 || busy}
                  className="rounded-full border border-neutral-300 px-2.5 py-1.5 text-[11px] font-medium hover:border-brand-600 hover:text-brand-600 disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
                >
                  Undo
                </button>
                <button
                  onClick={stopAuction}
                  disabled={busy}
                  className="rounded-full border border-red-300 px-2.5 py-1.5 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
                >
                  Unsold
                </button>
                {syncError && (
                  <button
                    onClick={() => pushLive(live)}
                    className="col-span-3 rounded-full border border-neutral-300 px-3 py-1 text-[11px] font-medium hover:border-brand-600 hover:text-brand-600 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    Re-sync public screen
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="mt-3 sm:mt-4">
            <h2 className="text-sm font-bold sm:text-base">
              Teams <span className="font-normal text-neutral-400">· next bid {formatPts(nextBid)}</span>
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
              {teams.map((t) => {
                const isHighest = live.highestTeam?.ownerRegistrationId === t.ownerRegistrationId;
                const canAfford = Number(t.availablePurse) >= nextBid;
                return (
                  <div
                    key={t.ownerRegistrationId}
                    className={`rounded-xl border bg-white p-2.5 shadow-sm sm:p-3 ${
                      isHighest ? "border-brand-600 ring-2 ring-brand-500/30" : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="truncate text-xs font-bold sm:text-sm">{t.teamName}</h3>
                      {isHighest && (
                        <span className="shrink-0 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          Highest
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-neutral-500 sm:text-xs">
                      Purse: <b className="text-neutral-800">{formatPts(t.availablePurse)}</b>
                    </p>
                    <button
                      onClick={() => placeBid(t)}
                      disabled={isHighest || !canAfford || busy}
                      className="mt-2 w-full rounded-full bg-black px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:mt-2.5 sm:py-1.5 sm:text-xs"
                    >
                      {isHighest ? "Leading" : canAfford ? `Bid ${formatPts(nextBid)}` : "No purse"}
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