"use client";

import { useEffect, useState, useCallback } from "react";

interface Exercise {
  id?: string;
  exerciseName: string;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  weightKg: number | null;
  restSec: number | null;
  notes: string | null;
  sortOrder: number;
}

interface RoutineData {
  id: string;
  name: string;
  sortOrder: number;
  exercises: Exercise[];
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  routines: RoutineData[];
}

interface WorkoutLog {
  id: string;
  date: string;
  durationMin: number | null;
  notes: string | null;
  routine: { name: string } | null;
  sets: { exerciseName: string; setNumber: number; reps: number; weightKg: number | null; rpe: number | null }[];
}

interface GarminActivity {
  id: string;
  activityType: string;
  activityName: string | null;
  startTime: string;
  durationSec: number;
  distanceM: number | null;
  avgHr: number | null;
  maxHr: number | null;
  caloriesBurned: number | null;
  trainingEffect: number | null;
}

const activityTypeLabels: Record<string, string> = {
  running: "Laufen",
  cycling: "Radfahren",
  strength_training: "Krafttraining",
  indoor_cardio: "Cardio",
  walking: "Gehen",
  hiking: "Wandern",
  swimming: "Schwimmen",
  yoga: "Yoga",
  elliptical: "Crosstrainer",
  treadmill_running: "Laufband",
};

function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function formatDistance(meters: number | null) {
  if (!meters || meters < 100) return null;
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
}

export default function TrainingPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [activities, setActivities] = useState<GarminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"activities" | "plan" | "log" | "history">("activities");
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDesc, setNewPlanDesc] = useState("");

  const [selectedRoutine, setSelectedRoutine] = useState<RoutineData | null>(null);
  const [logSets, setLogSets] = useState<{ exerciseName: string; setNumber: number; reps: number; weightKg: number; rpe: number }[]>([]);
  const [logNotes, setLogNotes] = useState("");

  const loadData = useCallback(async () => {
    const [p, w, a] = await Promise.all([
      fetch("/api/fitness/training/plans").then((r) => r.json()),
      fetch("/api/fitness/training/workouts?limit=20").then((r) => r.json()),
      fetch("/api/fitness/garmin/activities?limit=30").then((r) => r.json()),
    ]);
    setPlans(p);
    setWorkouts(w);
    setActivities(a);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function createPlan() {
    if (!newPlanName) return;
    await fetch("/api/fitness/training/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPlanName, description: newPlanDesc || null }),
    });
    setNewPlanName("");
    setNewPlanDesc("");
    setShowNewPlan(false);
    loadData();
  }

  async function deletePlan(id: string) {
    await fetch(`/api/fitness/training/plans/${id}`, { method: "DELETE" });
    loadData();
  }

  function startWorkout(routine: RoutineData) {
    setSelectedRoutine(routine);
    const sets: typeof logSets = [];
    for (const ex of routine.exercises) {
      for (let s = 1; s <= ex.sets; s++) {
        sets.push({ exerciseName: ex.exerciseName, setNumber: s, reps: ex.repsMin, weightKg: ex.weightKg || 0, rpe: 0 });
      }
    }
    setLogSets(sets);
    setLogNotes("");
    setTab("log");
  }

  async function saveWorkout() {
    if (!logSets.length) return;
    const today = new Date().toISOString().split("T")[0];
    await fetch("/api/fitness/training/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routineId: selectedRoutine?.id,
        date: today,
        notes: logNotes || null,
        sets: logSets.filter((s) => s.reps > 0),
      }),
    });
    setSelectedRoutine(null);
    setLogSets([]);
    setTab("history");
    loadData();
  }

  async function deleteWorkout(id: string) {
    await fetch(`/api/fitness/training/workouts/${id}`, { method: "DELETE" });
    loadData();
  }

  async function deleteActivity(id: string) {
    if (!confirm("Aktivität löschen?")) return;
    await fetch(`/api/fitness/garmin/activities?id=${id}`, { method: "DELETE" });
    loadData();
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-neutral-500">Laden...</p></div>;

  const activePlan = plans.find((p) => p.isActive);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Training</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["activities", "plan", "log", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-blue-600 text-white" : "bg-neutral-900 border border-neutral-800 hover:bg-neutral-800"
            }`}
          >
            {t === "activities" ? "Garmin Aktivitäten" : t === "plan" ? "Trainingsplan" : t === "log" ? "Workout loggen" : "Meine Workouts"}
          </button>
        ))}
      </div>

      {/* GARMIN AKTIVITÄTEN */}
      {tab === "activities" && (
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((a) => (
              <div key={a.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {a.activityName || activityTypeLabels[a.activityType] || a.activityType}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {formatDate(a.startTime)} um {formatTime(a.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                      {activityTypeLabels[a.activityType] || a.activityType}
                    </span>
                    <button onClick={() => deleteActivity(a.id)} className="text-xs text-red-500 hover:text-red-400 transition-colors">Löschen</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500">Dauer</p>
                    <p className="text-lg font-bold">{formatDuration(a.durationSec)}</p>
                  </div>
                  {a.caloriesBurned ? (
                    <div>
                      <p className="text-xs text-neutral-500">Kalorien</p>
                      <p className="text-lg font-bold text-orange-400">{Math.round(a.caloriesBurned)} kcal</p>
                    </div>
                  ) : null}
                  {a.avgHr ? (
                    <div>
                      <p className="text-xs text-neutral-500">Herzfrequenz</p>
                      <p className="text-lg font-bold text-red-400">{a.avgHr} <span className="text-sm font-normal text-neutral-500">/ {a.maxHr} bpm</span></p>
                    </div>
                  ) : null}
                  {formatDistance(a.distanceM) ? (
                    <div>
                      <p className="text-xs text-neutral-500">Distanz</p>
                      <p className="text-lg font-bold">{formatDistance(a.distanceM)}</p>
                    </div>
                  ) : null}
                  {a.trainingEffect ? (
                    <div>
                      <p className="text-xs text-neutral-500">Training Effect</p>
                      <p className="text-lg font-bold text-green-400">{a.trainingEffect.toFixed(1)}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">Keine Garmin-Aktivitäten vorhanden. Starte ein Training auf deiner Forerunner 265.</p>
          )}
        </div>
      )}

      {/* TRAININGSPLAN TAB */}
      {tab === "plan" && (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  {plan.description && <p className="text-sm text-neutral-400">{plan.description}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  {plan.isActive && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Aktiv</span>}
                  <button onClick={() => deletePlan(plan.id)} className="text-xs text-red-500 hover:underline">Löschen</button>
                </div>
              </div>
              <div className="space-y-4">
                {plan.routines.sort((a, b) => a.sortOrder - b.sortOrder).map((routine) => (
                  <div key={routine.id} className="border border-neutral-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{routine.name}</h3>
                      <button onClick={() => startWorkout(routine)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">Starten</button>
                    </div>
                    <div className="space-y-1">
                      {routine.exercises.sort((a, b) => a.sortOrder - b.sortOrder).map((ex, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{ex.exerciseName}</span>
                          <span className="text-neutral-400">{ex.sets}x{ex.repsMin}{ex.repsMax ? `-${ex.repsMax}` : ""} {ex.weightKg ? `@ ${ex.weightKg}kg` : ""}</span>
                        </div>
                      ))}
                      {routine.exercises.length === 0 && <p className="text-sm text-neutral-600">Keine Übungen</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {showNewPlan ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Neuer Trainingsplan</h2>
              <div className="space-y-3">
                <input value={newPlanName} onChange={(e) => setNewPlanName(e.target.value)} placeholder="Name (z.B. Push/Pull/Legs)" className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950" />
                <input value={newPlanDesc} onChange={(e) => setNewPlanDesc(e.target.value)} placeholder="Beschreibung (optional)" className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950" />
                <div className="flex gap-2">
                  <button onClick={createPlan} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Erstellen</button>
                  <button onClick={() => setShowNewPlan(false)} className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">Abbrechen</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNewPlan(true)} className="w-full py-3 border-2 border-dashed border-neutral-800 rounded-xl text-neutral-500 hover:border-blue-600 hover:text-blue-500 transition-colors">+ Neuer Trainingsplan</button>
          )}
        </div>
      )}

      {/* WORKOUT LOGGER TAB */}
      {tab === "log" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          {selectedRoutine ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">{selectedRoutine.name}</h2>
              <div className="space-y-4">
                {(() => {
                  const exercises = [...new Set(logSets.map((s) => s.exerciseName))];
                  return exercises.map((exName) => (
                    <div key={exName} className="border border-neutral-800 rounded-lg p-4">
                      <h3 className="font-medium mb-2">{exName}</h3>
                      <div className="grid grid-cols-4 gap-2 text-xs text-neutral-400 mb-1">
                        <span>Set</span><span>Reps</span><span>Gewicht (kg)</span><span>RPE</span>
                      </div>
                      {logSets.map((s, idx) => ({ ...s, idx })).filter((s) => s.exerciseName === exName).map(({ idx, setNumber }) => (
                        <div key={idx} className="grid grid-cols-4 gap-2 mb-1">
                          <span className="text-sm py-1">{setNumber}</span>
                          <input type="number" value={logSets[idx].reps} onChange={(e) => { const u = [...logSets]; u[idx].reps = parseInt(e.target.value) || 0; setLogSets(u); }} className="px-2 py-1 rounded border border-neutral-800 bg-neutral-950 text-sm" />
                          <input type="number" step="0.5" value={logSets[idx].weightKg} onChange={(e) => { const u = [...logSets]; u[idx].weightKg = parseFloat(e.target.value) || 0; setLogSets(u); }} className="px-2 py-1 rounded border border-neutral-800 bg-neutral-950 text-sm" />
                          <input type="number" step="0.5" min="0" max="10" value={logSets[idx].rpe || ""} onChange={(e) => { const u = [...logSets]; u[idx].rpe = parseFloat(e.target.value) || 0; setLogSets(u); }} className="px-2 py-1 rounded border border-neutral-800 bg-neutral-950 text-sm" placeholder="–" />
                        </div>
                      ))}
                    </div>
                  ));
                })()}
                <textarea value={logNotes} onChange={(e) => setLogNotes(e.target.value)} placeholder="Notizen (optional)" className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-sm" rows={2} />
                <div className="flex gap-2">
                  <button onClick={saveWorkout} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Workout speichern</button>
                  <button onClick={() => { setSelectedRoutine(null); setLogSets([]); }} className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">Abbrechen</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500 mb-4">Wähle eine Routine aus deinem Trainingsplan</p>
              {activePlan && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {activePlan.routines.map((r) => (
                    <button key={r.id} onClick={() => startWorkout(r)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{r.name}</button>
                  ))}
                </div>
              )}
              {!activePlan && <p className="text-sm text-neutral-600">Erstelle zuerst einen Trainingsplan</p>}
            </div>
          )}
        </div>
      )}

      {/* MEINE WORKOUTS TAB */}
      {tab === "history" && (
        <div className="space-y-4">
          {workouts.length > 0 ? (
            workouts.map((w) => (
              <div key={w.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">{w.routine?.name || "Freies Training"}</p>
                    <p className="text-sm text-neutral-400">{w.date} {w.durationMin ? `| ${w.durationMin} Min` : ""}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-sm text-neutral-500">{w.sets.length} Sets</span>
                    <button onClick={() => deleteWorkout(w.id)} className="text-xs text-red-500 hover:underline">X</button>
                  </div>
                </div>
                {w.sets.length > 0 && (
                  <div className="mt-2 text-sm space-y-1">
                    {(() => {
                      const exercises = [...new Set(w.sets.map((s) => s.exerciseName))];
                      return exercises.map((exName) => {
                        const exSets = w.sets.filter((s) => s.exerciseName === exName);
                        const summary = exSets.map((s) => `${s.reps}x${s.weightKg || 0}kg`).join(", ");
                        return <div key={exName} className="text-neutral-300"><span className="font-medium">{exName}:</span> {summary}</div>;
                      });
                    })()}
                  </div>
                )}
                {w.notes && <p className="text-sm text-neutral-400 mt-2 italic">{w.notes}</p>}
              </div>
            ))
          ) : (
            <p className="text-neutral-500">Noch keine Workouts geloggt</p>
          )}
        </div>
      )}
    </div>
  );
}
