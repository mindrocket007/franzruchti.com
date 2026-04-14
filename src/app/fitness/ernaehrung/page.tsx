"use client";

import { useEffect, useState } from "react";
import MacroChart from "@/components/charts/MacroChart";

interface NutritionDay {
  date: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  fiber: number;
  sugar: number;
  meals: { mealType: string; foodName: string; calories: number; protein: number; carbs: number; fat: number }[];
}

interface GarminActivity {
  activityName: string | null;
  activityType: string;
  caloriesBurned: number | null;
  durationSec: number;
  startTime: string;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: "Frühstück",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  snack: "Snack",
};

const mealTypeOrder = ["breakfast", "lunch", "dinner", "snack"];

export default function ErnaehrungPage() {
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [activities, setActivities] = useState<GarminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/fitness/nutrition?days=7").then((r) => r.json()),
      fetch("/api/fitness/garmin/activities?limit=10").then((r) => r.json()),
    ])
      .then(([d, a]) => { setDays(d); setActivities(a); })
      .finally(() => setLoading(false));
  }, []);

  async function syncToday() {
    setSyncing(true);
    await fetch("/api/fitness/yazio/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: new Date().toISOString().split("T")[0] }),
    });
    const d = await fetch("/api/fitness/nutrition?days=7").then((r) => r.json());
    setDays(d);
    setSyncing(false);
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-neutral-500">Laden...</p></div>;

  const todayStr = new Date().toISOString().split("T")[0];
  const viewDate = selectedDay || todayStr;
  const currentDay = days.find((d) => d.date === viewDate);

  // Leeres Tages-Objekt wenn keine Daten fuer den Tag
  const displayDay = currentDay || { date: viewDate, calories: 0, fat: 0, carbs: 0, protein: 0, fiber: 0, sugar: 0, meals: [] };

  // Verbrannte Kalorien fuer den gewaehlten Tag (aus Garmin-Aktivitaeten)
  const dayActivities = activities.filter((a) => a.startTime?.startsWith(viewDate));
  const burnedCalories = dayActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);

  // Mahlzeiten nach Typ gruppieren und sortieren
  const groupedMeals = mealTypeOrder
    .map((type) => ({
      type,
      label: mealTypeLabels[type] || type,
      meals: displayDay.meals.filter((m: { mealType: string }) => m.mealType === type),
      total: displayDay.meals.filter((m: { mealType: string }) => m.mealType === type).reduce((s: number, m: { calories: number }) => s + m.calories, 0),
    }))
    .filter((g) => g.meals.length > 0);

  // Alle Tage inkl. heute (auch wenn keine Daten)
  const allDates = [...new Set([todayStr, ...days.map((d) => d.date)])].sort().reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Ernährung</h1>
        <button
          onClick={syncToday}
          disabled={syncing}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {syncing ? "Sync..." : "Yazio syncen"}
        </button>
      </div>

      {/* Tages-Auswahl */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {allDates.slice(0, 7).map((date) => {
          const dayData = days.find((d) => d.date === date);
          return (
            <button
              key={date}
              onClick={() => setSelectedDay(date)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                viewDate === date ? "bg-blue-600 text-white" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              {date === todayStr ? "Heute" : new Date(date).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "short" })}
              {dayData && <span className="ml-1 text-xs opacity-70">{Math.round(dayData.calories)}</span>}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* KPI Cards inkl. verbrannte Kalorien */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-400">Gegessen</p>
            <p className="text-2xl font-bold">{displayDay.calories > 0 ? Math.round(displayDay.calories) : "–"}</p>
            <p className="text-xs text-neutral-500">kcal</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-400">Verbrannt</p>
            <p className="text-2xl font-bold text-orange-400">{burnedCalories > 0 ? Math.round(burnedCalories) : "–"}</p>
            <p className="text-xs text-neutral-500">{dayActivities.length > 0 ? `${dayActivities.length} Aktivität${dayActivities.length > 1 ? "en" : ""}` : "kein Sport"}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-400">Protein</p>
            <p className="text-2xl font-bold text-blue-500">{displayDay.protein > 0 ? `${Math.round(displayDay.protein)}g` : "–"}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-400">Kohlenhydrate</p>
            <p className="text-2xl font-bold text-amber-500">{displayDay.carbs > 0 ? `${Math.round(displayDay.carbs)}g` : "–"}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-400">Fett</p>
            <p className="text-2xl font-bold text-red-500">{displayDay.fat > 0 ? `${Math.round(displayDay.fat)}g` : "–"}</p>
          </div>
        </div>

        {/* Verbrannte Kalorien Details */}
        {dayActivities.length > 0 && (
          <div className="bg-neutral-900 border border-orange-900/50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-orange-400 mb-3">Verbrannte Kalorien (Sport)</h2>
            {dayActivities.map((a, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 text-sm">
                <span>{a.activityName || a.activityType} – {Math.round(a.durationSec / 60)} min</span>
                <span className="text-orange-400 font-medium">{Math.round(a.caloriesBurned || 0)} kcal</span>
              </div>
            ))}
            {displayDay.calories > 0 && (
              <div className="border-t border-neutral-800 mt-2 pt-2 flex justify-between text-sm font-semibold">
                <span>Netto-Kalorien</span>
                <span className={Math.round(displayDay.calories) - burnedCalories > 0 ? "text-white" : "text-green-400"}>
                  {Math.round(displayDay.calories - burnedCalories)} kcal
                </span>
              </div>
            )}
          </div>
        )}

        {/* Makro-Chart */}
        {days.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Makros (7 Tage)</h2>
            <MacroChart data={days} />
          </div>
        )}

        {/* Mahlzeiten gruppiert */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Mahlzeiten {viewDate === todayStr ? "heute" : new Date(viewDate).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "short" })}
          </h2>
          {groupedMeals.length > 0 ? (
            <div className="space-y-5">
              {groupedMeals.map((group) => (
                <div key={group.type}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">{group.label}</h3>
                    <span className="text-sm text-neutral-500">{Math.round(group.total)} kcal</span>
                  </div>
                  <div className="space-y-1">
                    {group.meals.map((meal: { foodName: string; calories: number; protein: number; carbs: number; fat: number }, i: number) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-neutral-800/50 last:border-0">
                        <span className="text-sm">{meal.foodName}</span>
                        <div className="text-right text-xs text-neutral-400">
                          <span className="text-sm text-white mr-2">{Math.round(meal.calories)} kcal</span>
                          P:{Math.round(meal.protein)} K:{Math.round(meal.carbs)} F:{Math.round(meal.fat)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">Keine Mahlzeiten eingetragen. Klicke &quot;Yazio syncen&quot; um deine Daten zu laden.</p>
          )}
        </div>
      </div>
    </div>
  );
}
