"use client";

import { useParams } from "next/navigation";
import { projects } from "@/lib/projects";

export default function ProjectPageView() {
  const params = useParams();
  const slug = params.slug as string;
  const pageSlug = params.page as string;

  const project = projects.find((p) => p.slug === slug);
  const page = project?.pages.find((p) => p.slug === pageSlug);

  if (!project || !page) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-500">Seite nicht gefunden</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="bg-black border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href={`/project/${slug}`}
            className="text-neutral-600 hover:text-neutral-400 text-sm transition-colors"
          >
            &larr; {project.title}
          </a>
          <span className="text-neutral-700">|</span>
          <span className="text-white text-sm font-semibold">{page.title}</span>
        </div>
        <a
          href={page.file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-white text-xs transition-colors"
        >
          In neuem Tab öffnen
        </a>
      </div>
      <iframe
        src={page.file}
        className="w-full border-0"
        style={{ height: "calc(100vh - 49px)" }}
        title={page.title}
      />
    </main>
  );
}
