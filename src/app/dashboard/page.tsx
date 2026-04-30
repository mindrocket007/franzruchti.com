"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";

const LOCAL_NOTES_KEY = "dashboard-notes";
const DASHBOARD_SLUG = "_dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/project/${DASHBOARD_SLUG}/data`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        if (data.exists) {
          setNotes(data.notes ?? "");
          localStorage.setItem(LOCAL_NOTES_KEY, data.notes ?? "");
        } else {
          // No server data: migrate from localStorage if present
          const local = localStorage.getItem(LOCAL_NOTES_KEY) ?? "";
          if (local) {
            setNotes(local);
            void fetch(`/api/project/${DASHBOARD_SLUG}/data`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notes: local, goals: [], tasks: [], accesses: [] }),
            });
          }
        }
      } catch {
        // Offline or auth issue: fall back to localStorage
        const local = localStorage.getItem(LOCAL_NOTES_KEY) ?? "";
        if (!cancelled) setNotes(local);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSaveNotes() {
    setSaveError(null);
    localStorage.setItem(LOCAL_NOTES_KEY, notes);
    try {
      const res = await fetch(`/api/project/${DASHBOARD_SLUG}/data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, goals: [], tasks: [], accesses: [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedAt(new Date().toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Speichern fehlgeschlagen");
    }
  }

  const [importStatus, setImportStatus] = useState<string | null>(null);

  async function handleImportAccesses() {
    setImportStatus("Lade …");
    try {
      const res = await fetch("/api/accesses");
      if (!res.ok) throw new Error("Fehler beim Laden");
      const { data } = await res.json();
      let count = 0;
      for (const [slug, entries] of Object.entries(data as Record<string, unknown[]>)) {
        const withIds = (entries as Array<Record<string, string>>).map((e) => ({
          id: Math.random().toString(36).slice(2, 9),
          ...e,
        }));
        // Read current server data so we don't overwrite notes/goals/tasks
        const cur = await fetch(`/api/project/${slug}/data`, { cache: "no-store" });
        const curData = cur.ok ? await cur.json() : { notes: "", goals: [], tasks: [] };
        await fetch(`/api/project/${slug}/data`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notes: curData.notes ?? "",
            goals: curData.goals ?? [],
            tasks: curData.tasks ?? [],
            accesses: withIds,
          }),
        });
        localStorage.setItem(`accesses-${slug}`, JSON.stringify(withIds));
        count += withIds.length;
      }
      setImportStatus(`${count} Zugänge in ${Object.keys(data).length} Projekten gespeichert`);
    } catch (e) {
      setImportStatus("Fehler: " + (e instanceof Error ? e.message : "unbekannt"));
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl md:text-3xl font-bold">Meine Projekte</h1>
        <button
          onClick={handleLogout}
          className="text-neutral-500 hover:text-white text-sm transition-colors"
        >
          Abmelden
        </button>
      </div>

      <div className="mb-6 border border-neutral-800 rounded-xl p-5 bg-neutral-950">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-sm font-semibold uppercase tracking-wide">Notizen</h2>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="text-neutral-500 text-xs">Gespeichert um {savedAt}</span>
            )}
            {saveError && (
              <span className="text-red-500 text-xs">Fehler: {saveError}</span>
            )}
            <button
              onClick={handleSaveNotes}
              disabled={!loaded}
              className="text-xs bg-white text-black px-3 py-1 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Speichern
            </button>
          </div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Gedanken, Ideen, offene Punkte …"
          className="w-full min-h-[120px] bg-black border border-neutral-800 rounded-lg p-3 text-neutral-200 text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-y"
        />
      </div>

      <div className="mb-12 flex items-center gap-3">
        <button
          onClick={handleImportAccesses}
          className="text-xs border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white px-3 py-2 rounded transition-colors"
        >
          Zugänge aus Server importieren
        </button>
        {importStatus && <span className="text-neutral-500 text-xs">{importStatus}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          href="/fitness"
          className="group border border-blue-800 bg-blue-950/30 rounded-xl p-6 hover:border-blue-600 transition-colors"
        >
          <h2 className="text-white text-xl font-semibold mb-2 group-hover:text-blue-300">
            Fitness Dashboard
          </h2>
          <p className="text-neutral-400 text-sm">Ernaehrung, Gewicht, Training, Recovery – Yazio & Garmin</p>
          <p className="text-blue-600 text-xs mt-4">Live-Daten</p>
        </a>
        {projects.map((project) => (
          <a
            key={project.slug}
            href={`/project/${project.slug}`}
            className="group border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 transition-colors"
          >
            <h2 className="text-white text-xl font-semibold mb-2 group-hover:text-neutral-300">
              {project.title}
            </h2>
            <p className="text-neutral-500 text-sm">{project.description}</p>
            {project.pages.length > 0 && (
              <p className="text-neutral-600 text-xs mt-4">
                {project.pages.length} Seiten
              </p>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}
