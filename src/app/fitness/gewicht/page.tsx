"use client";

import { useEffect, useState } from "react";
import WeightTrend from "@/components/charts/WeightTrend";

interface WeightEntry {
  date: string;
  weightKg: number;
  source: string;
}

export default function GewichtPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState("");

  useEffect(() => {
    fetch("/api/fitness/weight?days=90")
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newWeight) return;
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch("/api/fitness/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, weightKg: parseFloat(newWeight), source: "manual" }),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries((prev) => [entry, ...prev]);
      setNewWeight("");
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-neutral-500">Laden...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Gewicht</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Gewichtsverlauf (90 Tage)</h2>
            <WeightTrend data={entries} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Gewicht eintragen</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="z.B. 82.5"
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-white"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Speichern
              </button>
            </form>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Letzte Eintraege</h2>
            <div className="space-y-2">
              {entries.slice(0, 10).map((entry, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-neutral-800 last:border-0 text-sm">
                  <span className="text-neutral-300">{entry.date}</span>
                  <span className="font-medium">{entry.weightKg.toFixed(1)} kg</span>
                  <span className="text-xs text-neutral-500">{entry.source}</span>
                </div>
              ))}
              {entries.length === 0 && <p className="text-neutral-500 text-sm">Keine Eintraege</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
