import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { EP } from "../api/endpoints";
import { imageSrc } from "../utils/format";
import UploadPlayers from "../components/UploadPlayers.jsx";

const PAGE_SIZE = 20;
// const APPS_SCRIPT_URL =
//   "https://script.google.com/macros/s/AKfycby5Er7QtQfOQ8fJLHW97oIrNkRUjbnDZykYUM2SsGaKO1iOoqy7-ABReClOzhv-e7UN/exec";

const APPS_SCRIPT_URL = "/drive-proxy";
// Cache resolved Drive data URIs across pagination and re-renders
const driveImageCache = new Map();

function Avatar({ url, name }) {
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
        🏏
      </div>
    );
  }

  if (!resolvedSrc) {
    return (
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-200" />
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={name}
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover"
    />
  );
}

export default function Players() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api(`${EP.players}?page=${page}&size=${PAGE_SIZE}`)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setStatus("success");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [page, attempt]);

  const rows = data?.content ?? [];
  const totalPages = data?.page?.totalPages ?? 1;
  const totalElements = data?.page?.totalElements ?? rows.length;

  const statuses = useMemo(
    () => ["ALL", ...new Set(rows.map((r) => r.registrationStatus).filter(Boolean))],
    [rows]
  );

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q || r.playerName?.toLowerCase().includes(q) || r.playerId?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "ALL" || r.registrationStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const reloadFromStart = () => {
    setPage(0);
    setAttempt((a) => a + 1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Registered <span className="text-brand-600">Players</span>
        {status === "success" && (
          <span className="ml-3 text-lg font-normal text-neutral-400">({totalElements})</span>
        )}
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter this page by name or ID"
          className="w-64 rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-brand-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-brand-600"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      <UploadPlayers onDone={reloadFromStart} />

      {status === "loading" && <p className="mt-10 text-neutral-500">Loading players...</p>}

      {status === "error" && (
        <div className="mt-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setAttempt((a) => a + 1)}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      )}

      {status === "success" && (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-widest text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">CricHeroes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                      No players match.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.playerId} className="hover:bg-brand-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar url={p.imageUrl} name={p.playerName} />
                        <span className="font-semibold">{p.playerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{p.playerId}</td>
                    <td className="px-4 py-3">{p.playerType?.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          p.registrationStatus === "SOLD"
                            ? "bg-brand-100 text-brand-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {p.registrationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.contactNumber}</td>
                    <td className="px-4 py-3">{p.playerEmail}</td>
                    <td className="px-4 py-3">
                      {p.cricHerosProfile?.startsWith("http") ? (
                        <a
                          href={p.cricHerosProfile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline"
                        >
                          Profile
                        </a>
                      ) : (
                        p.cricHerosProfile
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-neutral-500">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-neutral-300 px-4 py-2 enabled:hover:border-brand-600 enabled:hover:text-brand-600 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-neutral-300 px-4 py-2 enabled:hover:border-brand-600 enabled:hover:text-brand-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}