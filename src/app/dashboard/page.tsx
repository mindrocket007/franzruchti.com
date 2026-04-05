"use client";

import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-white text-2xl md:text-3xl font-bold">Meine Projekte</h1>
        <button
          onClick={handleLogout}
          className="text-neutral-500 hover:text-white text-sm transition-colors"
        >
          Abmelden
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
