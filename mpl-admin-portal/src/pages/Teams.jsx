import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { EP } from "../api/endpoints";
import { formatPts } from "../utils/format";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);
  const [details, setDetails] = useState({}); // id -> { loading | data | error }

  useEffect(() => {
    api(EP.teams)
      .then((d) => {
        setTeams(d);
        setStatus("success");
      })
      .catch((e) => {
        setError(e.message);
        setStatus("error");
      });
  }, []);

  async function toggle(id) {
    if (open === id) return setOpen(null);
    setOpen(id);
    if (details[id]?.data) return;
    setDetails((d) => ({ ...d, [id]: { loading: true } }));
    try {
      const data = await api(EP.ownerDetails(id));
      setDetails((d) => ({ ...d, [id]: { data } }));
    } catch (e) {
      setDetails((d) => ({ ...d, [id]: { error: e.message } }));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          <span className="text-brand-600">Teams</span>
        </h1>
        <Link
          to="/teams/new"
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add Team
        </Link>
      </div>

      {status === "loading" && <p className="mt-10 text-neutral-500">Loading...</p>}
      {status === "error" && <p className="mt-10 text-red-600">{error}</p>}
      {status === "success" && teams.length === 0 && (
        <p className="mt-10 text-neutral-500">No teams yet. Add the first one.</p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {teams.map((t) => {
          const id = t.ownerRegistrationId;
          const d = details[id];
          const players = d?.data?.players ?? [];
          return (
            <div key={id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <button
                onClick={() => toggle(id)}
                className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left"
              >
                <div>
                  <h2 className="text-lg font-bold">{t.teamName}</h2>
                  <p className="text-xs text-neutral-400">{id}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      Remaining Purse
                    </p>
                    <p className="text-xl font-semibold text-brand-600">
                      {formatPts(t.availablePurse)}
                    </p>
                  </div>
                  <span className="text-neutral-400">{open === id ? "▲" : "▼"}</span>
                </div>
              </button>

              {open === id && (
                <div className="border-t border-neutral-100 bg-brand-50/40 p-5">
                  {d?.loading && <p className="text-neutral-500">Loading details...</p>}
                  {d?.error && <p className="text-red-600">{d.error}</p>}
                  {d?.data && (
                    <>
                      <div className="flex flex-col gap-2">
                        <p className="rounded-xl bg-white px-4 py-2.5 text-sm text-neutral-600">
                          <span className="inline-block w-20 font-medium text-neutral-500">
                            Owner:
                          </span>
                          <b>{d.data.ownerName}</b> · {d.data.ownerContactNumber} 
                        </p>

                        {(d.data.coOwnerName || d.data.coOwnerContactNumber) && (
                          <p className="rounded-xl bg-white px-4 py-2.5 text-sm text-neutral-600">
                            <span className="inline-block w-20 font-medium text-neutral-500">
                              Co-Owner:
                            </span>
                            <b>{d.data.coOwnerName}</b>
                            {d.data.coOwnerContactNumber && ` · ${d.data.coOwnerContactNumber}`}
                          </p>
                        )}
                      </div>

                      <h3 className="mt-5 text-sm font-semibold uppercase tracking-widest text-neutral-500">
                        Players bought ({players.length})
                      </h3>
                      {players.length === 0 ? (
                        <p className="mt-2 text-neutral-500">None yet.</p>
                      ) : (
                        <ul className="mt-2 divide-y divide-neutral-200 rounded-xl bg-white">
                          {players.map((p) => (
                            <li
                              key={p.playerId}
                              className="flex items-center justify-between px-4 py-3 text-sm"
                            >
                              <span>
                                <b>{p.playerName}</b>{" "}
                                <span className="text-neutral-500">
                                  · {p.playerType?.replace("_", " ")}
                                </span>
                              </span>
                              <span className="font-semibold text-brand-600">
                                {formatPts(p.bidAmount)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}