"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardData {
  nutrition: { calories: number; fat: number; carbs: number; protein: number } | null;
  weight: { weightKg: number; date: string } | null;
  lastWorkout: { activityName: string; durationSec: number; startTime: string } | null;
  garminDaily: { bodyBatteryHigh: number; bodyBatteryLow: number; steps: number; avgStress: number } | null;
  sleep: { sleepScore: number; durationMin: number } | null;
  burnedCalories: number;
}

function StatCard({ title, value, subtitle, color }: { title: string; value: string; subtitle?: string; color?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <p className="text-sm text-neutral-400 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color || ""}`}>{value}</p>
      {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  function loadDashboard() {
    fetch("/api/fitness/dashboard")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((d) => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadDashboard(); }, [router]);

  async function syncYazio() {
    setSyncing(true);
    setSyncMsg("");
    const res = await fetch("/api/fitness/yazio/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: new Date().toISOString().split("T")[0] }),
    });
    const data = await res.json();
    if (res.ok) {
      setSyncMsg(data.results?.join(" | ") || "Sync OK");
      loadDashboard();
    } else {
      setSyncMsg("Fehler: " + (data.error || "Unbekannt"));
    }
    setSyncing(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-neutral-500">Laden...</p></div>;
  }

  const today = new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tages-Dashboard</h1>
          <p className="text-neutral-400 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Countdown */}
          {(() => {
            const goal = new Date("2026-07-20T00:00:00");
            const now = new Date();
            const diff = Math.ceil((goal.getTime() - now.getTime()) / 86400000);
            const weeks = Math.floor(diff / 7);
            const daysLeft = diff % 7;
            return diff > 0 ? (
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{diff} <span className="text-sm font-normal text-neutral-400">Tage</span></p>
                <p className="text-xs text-neutral-500">bis 20. Juli 2026 ({weeks}W {daysLeft}T)</p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">Ziel erreicht!</p>
              </div>
            );
          })()}
          <div className="flex items-center gap-3">
            {syncMsg && <span className="text-xs text-neutral-400">{syncMsg}</span>}
            <button
              onClick={syncYazio}
              disabled={syncing}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {syncing ? "Sync..." : "Yazio syncen"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {(() => {
          const eaten = data?.nutrition?.calories || 0;
          const burned = data?.burnedCalories || 0;
          const netto = eaten - burned;
          const nettoStr = eaten === 0 && burned === 0 ? "–" : `${netto > 0 ? "+" : ""}${Math.round(netto)}`;
          const nettoColor = eaten === 0 && burned === 0 ? "" : netto > 0 ? "text-red-400" : "text-green-400";
          return (
            <>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
                <p className="text-xs text-neutral-400">Netto Kalorien</p>
                <p className={`text-3xl font-bold ${nettoColor}`}>{nettoStr}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {eaten > 0 ? `+${Math.round(eaten)}` : "0"} gegessen {burned > 0 ? `/ -${Math.round(burned)} Sport` : ""}
                </p>
              </div>
            </>
          );
        })()}
        <StatCard
          title="Gewicht"
          value={data?.weight ? `${data.weight.weightKg.toFixed(1)} kg` : "–"}
          subtitle={data?.weight ? data.weight.date : "Keine Daten"}
        />
        <StatCard
          title="Schritte"
          value={data?.garminDaily?.steps ? data.garminDaily.steps.toLocaleString("de-CH") : "–"}
          subtitle="Tagesziel: 10'000"
          color={data?.garminDaily?.steps && data.garminDaily.steps >= 10000 ? "text-green-500" : ""}
        />
        <StatCard
          title="Body Battery"
          value={data?.garminDaily ? `${data.garminDaily.bodyBatteryHigh}` : "–"}
          subtitle={data?.garminDaily ? `Tief: ${data.garminDaily.bodyBatteryLow}` : "Keine Daten"}
          color="text-green-500"
        />
        <StatCard
          title="Schlaf"
          value={data?.sleep ? `${Math.floor(data.sleep.durationMin / 60)}h ${data.sleep.durationMin % 60}m` : "–"}
          subtitle={data?.sleep?.sleepScore ? `Score: ${data.sleep.sleepScore}` : "Keine Daten"}
        />
        <StatCard
          title="Stress"
          value={data?.garminDaily?.avgStress ? `${data.garminDaily.avgStress}` : "–"}
          subtitle="Durchschnitt"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Letztes Workout</h2>
          {data?.lastWorkout ? (
            <div>
              <p className="text-xl font-bold">{data.lastWorkout.activityName}</p>
              <p className="text-neutral-400">
                {Math.round(data.lastWorkout.durationSec / 60)} Min |{" "}
                {new Date(data.lastWorkout.startTime).toLocaleDateString("de-CH")}
              </p>
            </div>
          ) : (
            <p className="text-neutral-500">Keine Aktivitaeten</p>
          )}
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Stress</h2>
          {data?.garminDaily?.avgStress ? (
            <div>
              <p className="text-xl font-bold">{data.garminDaily.avgStress}</p>
              <p className="text-neutral-400">Durchschnittlicher Stress-Level</p>
            </div>
          ) : (
            <p className="text-neutral-500">Keine Daten</p>
          )}
        </div>
      </div>
    </div>
  );
}
