import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Doc {
  id: number;
  filename: string;
  path: string;
  type: string;
  size: number;
  content: string;
}

interface Corpus {
  generated_at: string;
  count: number;
  total_chars: number;
  docs: Doc[];
}

let corpusCache: Corpus | null = null;

function loadCorpus(): Corpus {
  if (corpusCache) return corpusCache;
  const base = path.join(process.cwd(), "public", "siz-knowledge");
  const docs: Doc[] = [];

  const p1 = path.join(base, "corpus.json");
  if (fs.existsSync(p1)) {
    const raw = JSON.parse(fs.readFileSync(p1, "utf8"));
    (raw.docs || []).forEach((d: Doc) => {
      docs.push({ ...d, id: docs.length + 1, source: "google-drive" } as Doc & { source?: string });
    });
  }

  const p2 = path.join(base, "corpus-web.json");
  if (fs.existsSync(p2)) {
    const raw = JSON.parse(fs.readFileSync(p2, "utf8"));
    (raw.docs || []).forEach((d: Doc & { url?: string }) => {
      docs.push({ ...d, id: docs.length + 1 } as Doc);
    });
  }

  corpusCache = {
    generated_at: new Date().toISOString().slice(0, 10),
    count: docs.length,
    total_chars: docs.reduce((s, d) => s + (d.content?.length || 0), 0),
    docs,
  };
  return corpusCache!;
}

async function fetchUrlText(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "SIZ-Bot/1.0 (Franz Ruchti Internal)" },
    });
    clearTimeout(t);
    if (!res.ok) return JSON.stringify({ error: `HTTP ${res.status}` });
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("html")) {
      const html = await res.text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&[a-z]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 25000);
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : url;
      return JSON.stringify({ url, title, content: text });
    }
    if (ct.includes("application/json") || ct.includes("text/")) {
      const text = (await res.text()).slice(0, 25000);
      return JSON.stringify({ url, content: text });
    }
    return JSON.stringify({ error: `Content-Type ${ct} nicht unterstützt` });
  } catch (e) {
    return JSON.stringify({ error: e instanceof Error ? e.message : "Fetch-Fehler" });
  }
}

function rankDocs(docs: Doc[], query: string, limit = 5): Doc[] {
  const terms = query
    .toLowerCase()
    .replace(/[^a-zäöüß0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
  if (terms.length === 0) return docs.slice(0, limit);
  const scored = docs.map((d) => {
    const hay = (d.filename + " " + d.content).toLowerCase();
    let score = 0;
    for (const t of terms) {
      const m = hay.match(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"));
      if (m) score += m.length;
    }
    return { doc: d, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.doc);
}

function snippetFromContent(content: string, query: string, window = 1200): string {
  const lower = content.toLowerCase();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);
  let bestIdx = -1;
  for (const t of terms) {
    const idx = lower.indexOf(t);
    if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx;
  }
  if (bestIdx === -1) return content.slice(0, window);
  const start = Math.max(0, bestIdx - 200);
  return content.slice(start, start + window);
}

const TOOLS = [
  {
    name: "search_siz_docs",
    description:
      "Sucht in den SIZ-Dokumenten (Google Drive Ordner SIZ). Liefert die relevantesten Dokumente mit Name, Pfad und Text-Ausschnitt. Nutze dies IMMER wenn der User nach SIZ-Inhalten, Partnerschulen, Meetings, Berichten, Preisen, Diplomen, Prüfungen, Statistiken, Kontakten, KI-Modulen, Einführungsprogramm, Reporting etc. fragt.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Suchbegriff oder Frage" },
        limit: { type: "number", description: "Max. Anzahl Treffer (1-8)" },
      },
      required: ["query"],
    },
  },
  {
    name: "list_siz_docs",
    description: "Listet alle verfügbaren SIZ-Dokumente (Name, Pfad, Typ). Keine Inhalte.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "read_siz_doc",
    description: "Liest ein konkretes SIZ-Dokument vollständig. Nutze dies, wenn search_siz_docs einen relevanten Treffer zeigte und du mehr Kontext brauchst.",
    input_schema: {
      type: "object",
      properties: {
        filename: { type: "string", description: "Exakter Dateiname (aus search_siz_docs)" },
      },
      required: ["filename"],
    },
  },
  {
    name: "fetch_url",
    description: "Ruft eine beliebige URL ab und liefert den Textinhalt. Nutze dies, wenn der User nach aktuellen Infos fragt, die möglicherweise nicht in den gecrawlten SIZ-Dokumenten stehen – z.B. aktuelle siz.ch-Newsflashes, Konkurrenz-Websites wie digicomp.ch / ecdl.ch, Bildungspolitik-News (admin.ch, sbfi.admin.ch). Max. 25'000 Zeichen Text zurück.",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Vollständige URL (https://...)" },
      },
      required: ["url"],
    },
  },
];

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const corpus = loadCorpus();
  if (name === "fetch_url") {
    const url = String(input.url || "");
    if (!/^https?:\/\//.test(url)) return JSON.stringify({ error: "URL muss mit http:// oder https:// beginnen" });
    return await fetchUrlText(url);
  }
  if (name === "search_siz_docs") {
    const q = String(input.query || "");
    const limit = Math.min(8, Math.max(1, Number(input.limit) || 5));
    const hits = rankDocs(corpus.docs, q, limit);
    if (hits.length === 0) {
      return JSON.stringify({
        hits: 0,
        hint: "Keine Treffer. Versuche andere Begriffe oder list_siz_docs.",
      });
    }
    return JSON.stringify({
      hits: hits.length,
      docs: hits.map((d) => ({
        filename: d.filename,
        path: d.path,
        type: d.type,
        snippet: snippetFromContent(d.content, q),
      })),
    });
  }
  if (name === "list_siz_docs") {
    return JSON.stringify({
      count: corpus.docs.length,
      docs: corpus.docs.map((d) => ({ filename: d.filename, path: d.path, type: d.type })),
    });
  }
  if (name === "read_siz_doc") {
    const fn = String(input.filename || "");
    const doc = corpus.docs.find((d) => d.filename === fn);
    if (!doc) return JSON.stringify({ error: `Dokument '${fn}' nicht gefunden.` });
    return JSON.stringify({
      filename: doc.filename,
      path: doc.path,
      type: doc.type,
      content: doc.content,
    });
  }
  return JSON.stringify({ error: `Unbekanntes Tool: ${name}` });
}

function systemPrompt(corpus: Corpus) {
  const heute = new Date().toLocaleDateString("de-CH");
  return `Du bist der SIZ-Assistent – der persönliche KI-Helfer von Franz Ruchti (Leiter Markt & Partner bei der SIZ AG, seit 01.04.2026). Du hast Zugriff auf alle SIZ-Dokumente in Google Drive (Ordner SIZ).

## Kontext
- Heute: ${heute}
- Du sprichst mit Franz. Duze ihn.
- Wissensbasis: ${corpus.count} Dokumente, Stand ${corpus.generated_at.slice(0, 10)}.

## Dein Wissen über SIZ
- SIZ AG = führende neutrale ICT-Prüfungsorganisation der Schweiz (seit 1991)
- Getragen von kfmv (Kaufmännischer Verband) und Swico
- 250'000+ Absolventen, ~7'800 Prüfungen/Jahr, ~80 aktive Partnerschulen
- CEO: Wolfram Schmidt
- Diplome: Smart-User (3 Module), Advanced-User (4 Module), Power-User Data&Tech / Systems&Network, ICT Professional S&N
- Hauptkonkurrenten: ECDL/ICDL, Digicomp, Microsoft MOS, Google IT Certificates
- Geschäftsmodell B2B2C: SIZ → Partnerschulen → Prüflinge

## Dein Ton
- Deutsch, direkt, kurz, klar
- Schweizer Deutsch-Usage (CHF, Wochenschluss statt Wochenende wenn es passt)
- Umlaute ausschreiben (ä, ö, ü)
- Keine Emojis, keine langen Einleitungen

## Tools-Nutzung (WICHTIG)
- Bei JEDER Sachfrage zu Zahlen, Personen, Meetings, Partnerschulen, Berichten, Dokumenten → nutze search_siz_docs.
- Gib immer an, aus welchem Dokument die Antwort kommt (Dateiname bei Google-Drive-Docs, URL bei Web-Seiten).
- Die Wissensbasis enthält BEIDES: Google-Drive-SIZ-Dokumente UND gecrawlte siz.ch + exam.siz.ch + mysiz.siz.ch Seiten.
- Für Inhalte NICHT in der Wissensbasis (aktuelle News, Konkurrenz-Websites, admin.ch, sbfi.admin.ch, digicomp.ch, ecdl.ch etc.) → nutze fetch_url mit der konkreten URL.
- Wenn du dir unsicher bist, rate nicht – sage "Das finde ich nicht in den Dokumenten" oder nutze list_siz_docs.
- Max. 5 Tool-Calls pro Frage, dann antworten.

## Format
- Kurze Antworten mit konkreten Zahlen/Fakten
- Bei Listen: max 5-7 Items
- Quellenangabe in Klammern am Ende: (Quelle: DATEINAME.ext)`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY fehlt." }, { status: 500 });
    }

    const body = await req.json();
    const messages: Message[] = body.messages || [];
    if (messages.length === 0) {
      return NextResponse.json({ error: "Keine Nachrichten." }, { status: 400 });
    }

    const corpus = loadCorpus();
    const sys = systemPrompt(corpus);

    type Content =
      | string
      | Array<{
          type: string;
          text?: string;
          tool_use_id?: string;
          content?: string;
          name?: string;
          input?: unknown;
          id?: string;
        }>;
    const claudeMessages: Array<{ role: "user" | "assistant"; content: Content }> = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const keyStr: string = apiKey;
    async function callClaude() {
      // Retry bei 429 / 529 (überlastet) mit exponentiellem Backoff
      const delays = [0, 1500, 4000];
      let lastErr = "";
      for (const d of delays) {
        if (d > 0) await new Promise((r) => setTimeout(r, d));
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": keyStr,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 2048,
            system: sys,
            tools: TOOLS,
            messages: claudeMessages,
          }),
        });
        if (res.ok) return res;
        const txt = await res.text();
        lastErr = `${res.status}: ${txt}`;
        // Retry nur bei transienten Fehlern
        if (res.status !== 429 && res.status !== 529 && res.status < 500) {
          throw new Error(lastErr);
        }
      }
      throw new Error(lastErr);
    }

    for (let i = 0; i < 6; i++) {
      let res: Response;
      try {
        res = await callClaude();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const userMsg = msg.includes("529") || msg.includes("overloaded")
          ? "Claude ist momentan überlastet. Bitte in 30-60 Sekunden nochmal probieren."
          : `Anthropic API ${msg}`;
        return NextResponse.json({ error: userMsg }, { status: 503 });
      }

      const data = await res.json();

      if (data.stop_reason === "end_turn") {
        const textBlock = data.content.find((c: { type: string }) => c.type === "text");
        return NextResponse.json({ response: textBlock?.text || "Keine Antwort." });
      }

      if (data.stop_reason === "tool_use") {
        claudeMessages.push({ role: "assistant", content: data.content });
        const toolResults: Array<{ type: string; tool_use_id: string; content: string }> = [];
        for (const block of data.content) {
          if (block.type === "tool_use") {
            const result = await executeTool(block.name, block.input as Record<string, unknown>);
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
          }
        }
        claudeMessages.push({ role: "user", content: toolResults });
        continue;
      }

      const textBlock = data.content.find((c: { type: string }) => c.type === "text");
      return NextResponse.json({ response: textBlock?.text || "Keine Antwort." });
    }

    return NextResponse.json({ response: "Die Anfrage war zu komplex. Bitte versuche es einfacher." });
  } catch (err) {
    console.error("siz-chat error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}
