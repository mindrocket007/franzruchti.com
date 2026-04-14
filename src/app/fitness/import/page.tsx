"use client";

import { useState } from "react";

export default function ImportPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(`Importiere ${type}-Daten...`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch("/api/fitness/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStatus(res.ok ? `Erfolgreich: ${data.imported} Eintraege importiert` : `Fehler: ${data.error}`);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Daten importieren</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Garmin Aktivitaeten</h2>
          <p className="text-sm text-neutral-400 mb-4">JSON-Export aus Garmin Connect oder garmin-givemydata</p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={(e) => handleFileUpload(e, "garmin-activities")}
            disabled={loading}
            className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-600-hover file:cursor-pointer"
          />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Garmin Schlaf & Recovery</h2>
          <p className="text-sm text-neutral-400 mb-4">Schlaf, HRV, Body Battery, Stress</p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={(e) => handleFileUpload(e, "garmin-daily")}
            disabled={loading}
            className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-600-hover file:cursor-pointer"
          />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Gewichtsdaten</h2>
          <p className="text-sm text-neutral-400 mb-4">CSV mit Spalten: date, weightKg</p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={(e) => handleFileUpload(e, "weight")}
            disabled={loading}
            className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-600-hover file:cursor-pointer"
          />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Garmin GDPR Export</h2>
          <p className="text-sm text-neutral-400 mb-4">Kompletter Garmin Datenexport (ZIP)</p>
          <input
            type="file"
            accept=".zip,.json"
            onChange={(e) => handleFileUpload(e, "garmin-gdpr")}
            disabled={loading}
            className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-600-hover file:cursor-pointer"
          />
        </div>
      </div>

      {status && (
        <div className={`mt-6 p-4 rounded-lg ${status.startsWith("Fehler") ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
          {status}
        </div>
      )}
    </div>
  );
}
