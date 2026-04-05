"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { projects } from "@/lib/projects";
import { projectIntel } from "@/lib/project-news";

interface Goal {
  id: string;
  text: string;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function createGoals(count: number): Goal[] {
  return Array.from({ length: count }, () => ({ id: generateId(), text: "" }));
}

function createTasks(count: number): Task[] {
  return Array.from({ length: count }, () => ({ id: generateId(), text: "", done: false }));
}

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projects.find((p) => p.slug === slug);
  const intel = projectIntel[slug];

  // News filter & expand
  const [newsCategory, setNewsCategory] = useState("alle");
  const [showAllNews, setShowAllNews] = useState(false);

  // Social filter & expand
  const [socialPlatform, setSocialPlatform] = useState("alle");
  const [showAllSocial, setShowAllSocial] = useState(false);

  // Check if item was added today (for NEW badge)
  function isNew(addedAt: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    return addedAt === today;
  }

  // Notes
  const [notes, setNotes] = useState("");

  // Goals
  const [goals, setGoals] = useState<Goal[]>(() => createGoals(4));

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => createTasks(5));

  // Save indicator
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedNotes = localStorage.getItem(`notes-${slug}`);
    if (storedNotes) setNotes(storedNotes);

    const storedGoals = localStorage.getItem(`goals-${slug}`);
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch {}
    }

    const storedTasks = localStorage.getItem(`tasks-${slug}`);
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch {}
    }
  }, [slug]);

  const saveAll = useCallback(() => {
    localStorage.setItem(`notes-${slug}`, notes);
    localStorage.setItem(`goals-${slug}`, JSON.stringify(goals));
    localStorage.setItem(`tasks-${slug}`, JSON.stringify(tasks));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [slug, notes, goals, tasks]);

  // Goal handlers
  function updateGoal(id: string, text: string) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, text } : g)));
  }

  function removeGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function addGoal() {
    setGoals((prev) => [...prev, { id: generateId(), text: "" }]);
  }

  // Task handlers
  function updateTask(id: string, text: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function addTask() {
    setTasks((prev) => [...prev, { id: generateId(), text: "", done: false }]);
  }

  // Auto-resize textarea
  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-500">Projekt nicht gefunden</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 md:px-16 lg:px-24">
      <a
        href="/dashboard"
        className="text-neutral-600 hover:text-neutral-400 text-sm mb-8 block transition-colors"
      >
        &larr; Zurück zum Dashboard
      </a>

      <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
        {project.title}
      </h1>
      <p className="text-neutral-500 mb-10">{project.description}</p>

      {/* Strategische Ziele */}
      <section className="mb-12">
        <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Die wichtigsten strategischen Ziele
        </h2>
        <div className="space-y-2">
          {goals.map((goal, i) => (
            <div key={goal.id} className="flex gap-2 group">
              <span className="text-neutral-600 text-sm mt-2.5 w-6 shrink-0 text-right">
                {i + 1}.
              </span>
              <textarea
                value={goal.text}
                onChange={(e) => {
                  updateGoal(goal.id, e.target.value);
                  autoResize(e.target);
                }}
                onFocus={(e) => autoResize(e.target)}
                placeholder="Ziel eingeben..."
                rows={1}
                className="flex-1 bg-neutral-900 border border-neutral-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-neutral-600 placeholder:text-neutral-700 resize-none overflow-hidden text-sm"
              />
              <button
                onClick={() => removeGoal(goal.id)}
                className="text-neutral-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-lg px-1"
                title="Entfernen"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addGoal}
          className="mt-3 text-neutral-600 hover:text-neutral-400 text-sm transition-colors"
        >
          + Ziel hinzufügen
        </button>
      </section>

      {/* Seiten */}
      {project.pages.length > 0 && (
        <section className="mb-12">
          <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-4">
            Seiten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.pages.map((page) => (
              <a
                key={page.slug}
                href={page.external ? page.file : `/project/${slug}/${page.slug}`}
                target={page.external ? "_blank" : undefined}
                rel={page.external ? "noopener noreferrer" : undefined}
                className="group border border-neutral-800 rounded-lg p-4 hover:border-neutral-600 transition-colors flex items-center justify-between"
              >
                <span className="text-white group-hover:text-neutral-300">
                  {page.title}
                </span>
                {page.external && (
                  <span className="text-neutral-600 text-xs">extern</span>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Aufgaben */}
      <section className="mb-12">
        <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Aufgaben
        </h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex gap-2 group items-start">
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-2.5 w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-colors ${
                  task.done
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-neutral-700 hover:border-neutral-500"
                }`}
              >
                {task.done && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <textarea
                value={task.text}
                onChange={(e) => {
                  updateTask(task.id, e.target.value);
                  autoResize(e.target);
                }}
                onFocus={(e) => autoResize(e.target)}
                placeholder="Aufgabe eingeben..."
                rows={1}
                className={`flex-1 bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-lg focus:outline-none focus:border-neutral-600 placeholder:text-neutral-700 resize-none overflow-hidden text-sm ${
                  task.done ? "text-neutral-600 line-through" : "text-white"
                }`}
              />
              <button
                onClick={() => removeTask(task.id)}
                className="text-neutral-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-lg px-1 mt-1.5"
                title="Entfernen"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTask}
          className="mt-3 text-neutral-600 hover:text-neutral-400 text-sm transition-colors"
        >
          + Aufgabe hinzufügen
        </button>
      </section>

      {/* Notizen */}
      <section className="mb-12">
        <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Notizen
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notizen zu diesem Projekt..."
          className="w-full h-48 bg-neutral-900 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600 resize-y"
        />
      </section>

      {/* Speichern Button */}
      <div className="flex items-center gap-3 mb-16">
        <button
          onClick={saveAll}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-neutral-200 transition-colors text-sm"
        >
          Speichern
        </button>
        {saved && (
          <span className="text-green-500 text-sm">Gespeichert</span>
        )}
      </div>

      {/* News */}
      {intel && intel.news.length > 0 && (() => {
        const filtered = intel.news
          .filter((n) => newsCategory === "alle" || n.category === newsCategory)
          .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
        const visible = showAllNews ? filtered : filtered.slice(0, 10);
        return (
          <section className="mb-12">
            <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-4">
              News & Branchenumfeld
              <span className="text-neutral-600 font-normal normal-case tracking-normal ml-2">
                ({filtered.length} Einträge)
              </span>
            </h2>

            {/* Kategorie-Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["alle", ...Array.from(new Set(intel.news.map((n) => n.category)))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setNewsCategory(cat); setShowAllNews(false); }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    newsCategory === cat
                      ? "border-white text-white bg-neutral-800"
                      : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-400"
                  }`}
                >
                  {cat === "alle" ? "Alle" : cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {visible.map((item, i) => (
                <div key={i} className="border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2 flex-1">
                      {isNew(item.addedAt) && (
                        <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                          NEW
                        </span>
                      )}
                      <p className="text-white text-sm">{item.summary}</p>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-400 text-xs shrink-0 transition-colors"
                      >
                        Link
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-neutral-600 text-xs">{item.source}</span>
                    <span className="text-neutral-700 text-xs">{item.date}</span>
                    <span className="text-neutral-700 text-xs px-2 py-0.5 border border-neutral-800 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 10 && !showAllNews && (
              <button
                onClick={() => setShowAllNews(true)}
                className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
              >
                Alle {filtered.length} News anzeigen
              </button>
            )}
            {showAllNews && filtered.length > 10 && (
              <button
                onClick={() => setShowAllNews(false)}
                className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
              >
                Weniger anzeigen
              </button>
            )}
          </section>
        );
      })()}

      {/* Social Media Monitoring */}
      {intel && intel.social.length > 0 && (() => {
        const filtered = intel.social
          .filter((s) => socialPlatform === "alle" || s.platform === socialPlatform)
          .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
        const visible = showAllSocial ? filtered : filtered.slice(0, 10);
        return (
          <section className="mb-12">
            <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Social Media Monitoring
              <span className="text-neutral-600 font-normal normal-case tracking-normal ml-2">
                ({filtered.length} Einträge)
              </span>
            </h2>
            {intel.socialSummary && (
              <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                {intel.socialSummary}
              </p>
            )}

            {/* Plattform-Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["alle", ...Array.from(new Set(intel.social.map((s) => s.platform)))].map((plat) => (
                <button
                  key={plat}
                  onClick={() => { setSocialPlatform(plat); setShowAllSocial(false); }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    socialPlatform === plat
                      ? "border-white text-white bg-neutral-800"
                      : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-400"
                  }`}
                >
                  {plat === "alle" ? "Alle" : plat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {visible.map((item, i) => (
                <div key={i} className="border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2 flex-1">
                      {isNew(item.addedAt) && (
                        <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                          NEW
                        </span>
                      )}
                      <p className="text-white text-sm">{item.description}</p>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-400 text-xs shrink-0 transition-colors"
                      >
                        Link
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-medium ${
                      item.sentiment === "positiv" ? "text-green-600" :
                      item.sentiment === "negativ" ? "text-red-500" :
                      "text-neutral-500"
                    }`}>
                      {item.sentiment}
                    </span>
                    <span className="text-neutral-600 text-xs">{item.platform}</span>
                    {item.author && (
                      <span className="text-neutral-500 text-xs">von: {item.author}</span>
                    )}
                    <span className="text-neutral-700 text-xs">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 10 && !showAllSocial && (
              <button
                onClick={() => setShowAllSocial(true)}
                className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
              >
                Alle {filtered.length} Einträge anzeigen
              </button>
            )}
            {showAllSocial && filtered.length > 10 && (
              <button
                onClick={() => setShowAllSocial(false)}
                className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
              >
                Weniger anzeigen
              </button>
            )}
          </section>
        );
      })()}
    </main>
  );
}
