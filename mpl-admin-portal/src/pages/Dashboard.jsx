import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { EP } from "../api/endpoints";
import { formatPts } from "../utils/format";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await api(EP.teams);
      setTeams([...data].sort((a, b) => b.availablePurse - a.availablePurse));
      setStatus("success");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = teams.reduce((s, t) => s + Number(t.availablePurse ?? 0), 0);
  const max = Math.max(...teams.map((t) => Number(t.availablePurse ?? 0)), 1);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Remaining <span className="text-brand-600">Purse</span>
        </h1>
        <button
          onClick={load}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-brand-600 hover:text-brand-600"
        >
          Refresh
        </button>
      </div>

      {status === "loading" && <p className="mt-10 text-neutral-500">Loading...</p>}
      {status === "error" && <p className="mt-10 text-red-600">{error}</p>}

      {status === "success" && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-500">Teams</p>
              <p className="mt-1 text-3xl font-bold text-brand-700">{teams.length}</p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                Total Remaining Purse
              </p>
              <p className="mt-1 text-3xl font-bold text-brand-700">{formatPts(total)}</p>
            </div>
          </div>

          {teams.length === 0 ? (
            <p className="mt-10 text-neutral-500">No teams registered yet.</p>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {teams.map((t) => (
                <div
                  key={t.ownerRegistrationId}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="text-lg font-bold">{t.teamName}</h2>
                  <p className="text-xs text-neutral-400">{t.ownerRegistrationId}</p>
                  <p className="mt-4 text-2xl font-semibold text-brand-600">
                    {formatPts(t.availablePurse)}
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(Number(t.availablePurse) / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}