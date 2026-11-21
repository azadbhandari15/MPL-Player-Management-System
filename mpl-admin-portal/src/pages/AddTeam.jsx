import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { EP } from "../api/endpoints";
import { formatPts } from "../utils/format";

const EMPTY = { ownerName: "", ownerContactNumber: "", ownerEmailId: "", teamName: "" };

export default function AddTeam() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await api(EP.registerOwner, {
        method: "POST",
        body: {
          ownerName: form.ownerName.trim(),
          ownerContactNumber: form.ownerContactNumber.trim(),
          ownerEmailId: form.ownerEmailId.trim(),
          teamName: form.teamName.trim(),
        },
      });
      setCreated(res);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 outline-none placeholder-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30";

  if (created) {
    return (
      <div className="max-w-md">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
          <div className="text-5xl">✅</div>
          <h1 className="mt-3 text-2xl font-bold">Team Created</h1>
          <p className="mt-4 text-lg font-semibold text-brand-700">{created.teamName}</p>
          <p className="text-sm text-neutral-600">Owner: {created.ownerName}</p>
          <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">Owner ID</p>
          <p className="rounded-lg bg-white px-4 py-2 font-bold tracking-wider text-brand-700">
            {created.ownerRegistrationId}
          </p>
          <p className="mt-3 text-sm text-neutral-600">
            Purse: <b>{formatPts(created.availablePurse)}</b>
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setCreated(null)}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm hover:border-brand-600 hover:text-brand-600"
            >
              Add another
            </button>
            <Link
              to="/teams"
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              View teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <Link to="/teams" className="text-sm text-neutral-500 hover:text-brand-600">
        ← Back to Teams
      </Link>
      <h1 className="mt-3 text-3xl font-bold">
        Add <span className="text-brand-600">Team</span>
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input className={input} placeholder="Team name" required value={form.teamName} onChange={set("teamName")} />
        <input className={input} placeholder="Owner name" required value={form.ownerName} onChange={set("ownerName")} />
        <input className={input} type="tel" placeholder="Owner phone (+91...)" required value={form.ownerContactNumber} onChange={set("ownerContactNumber")} />
        <input className={input} type="email" placeholder="Owner email" required value={form.ownerEmailId} onChange={set("ownerEmailId")} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}