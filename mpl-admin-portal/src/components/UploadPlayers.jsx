import { useRef, useState } from "react";
import { api } from "../api/client";
import { EP } from "../api/endpoints";

export default function UploadPlayers({ onDone }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function send(dryRun) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api(`${EP.playersImport}?dryRun=${dryRun}`, {
        method: "POST",
        body: form,
      });
      setResult(res);
      if (res.applied) {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        onDone?.();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function confirmImport() {
    if (
      !window.confirm(
        `This will DELETE all ${result.existingToDelete} existing players and add ${result.toInsert} from the sheet. Continue?`
      )
    )
      return;
    await send(false);
  }

  const canConfirm =
    file && !busy && result?.dryRun && !result.applied && result.errors.length === 0 && result.toInsert > 0;

  return (
    <section className="mt-6 max-w-xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold">Import players (Excel)</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Uploading replaces all existing players with the rows in the sheet.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setResult(null);
          setError("");
        }}
        className="mt-3 block text-sm"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => send(true)}
          disabled={!file || busy}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-brand-600 hover:text-brand-600 disabled:opacity-40"
        >
          {busy ? "Working..." : "Preview"}
        </button>
        <button
          onClick={confirmImport}
          disabled={!canConfirm}
          className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Replace all players
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 text-sm">
          {result.applied ? (
            <p className="font-semibold text-brand-700">Imported {result.toInsert} players.</p>
          ) : (
            <p>
              Preview: <b>{result.toInsert}</b> of {result.totalRows} rows valid.{" "}
              <b>{result.existingToDelete}</b> existing players will be deleted.
            </p>
          )}
          {result.errors.length > 0 && (
            <div className="mt-2 text-red-700">
              <b>Fix these rows first ({result.errors.length}):</b>
              <ul className="list-disc pl-5">
                {result.errors.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}