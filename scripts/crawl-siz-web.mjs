// Crawlt siz.ch + Subdomains und fügt die Inhalte in die Wissensbasis ein
// Ausgabe: public/siz-knowledge/corpus-web.json
//
// Ausführen: node scripts/crawl-siz-web.mjs

import fs from "fs";
import path from "path";

const START_URLS = [
  "https://siz.ch/",
  "https://siz.ch/ueber-uns/",
  "https://siz.ch/angebot/",
  "https://siz.ch/partner/",
  "https://siz.ch/news/",
  "https://siz.ch/kontakt/",
];
const ALLOWED_HOSTS = ["siz.ch", "www.siz.ch", "exam.siz.ch", "mysiz.siz.ch"];
const MAX_PAGES = 80;
const MAX_DEPTH = 3;
const OUTPUT = "public/siz-knowledge/corpus-web.json";
const TIMEOUT_MS = 12000;

function stripHtml(html) {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractLinks(html, baseUrl) {
  const links = new Set();
  const re = /<a[^>]+href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const u = new URL(m[1], baseUrl);
      if (ALLOWED_HOSTS.includes(u.hostname)) {
        u.hash = "";
        const s = u.toString();
        if (!s.match(/\.(pdf|jpg|jpeg|png|gif|svg|zip|mp4|mp3|docx|xlsx)$/i)) {
          links.add(s);
        }
      }
    } catch {}
  }
  return Array.from(links);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "SIZ-Bot/1.0 (Franz Ruchti Internal Crawl)" },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("html")) return null;
    return await res.text();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function crawl() {
  const queue = START_URLS.map((u) => ({ url: u, depth: 0 }));
  const visited = new Set();
  const docs = [];

  while (queue.length > 0 && docs.length < MAX_PAGES) {
    const { url, depth } = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    console.log(`  [${docs.length + 1}] (d${depth}) ${url}`);
    const html = await fetchWithTimeout(url);
    if (!html) {
      console.log(`    -> übersprungen (kein HTML / Fehler)`);
      continue;
    }

    const title = extractTitle(html);
    const text = stripHtml(html).slice(0, 50000);
    if (text.length > 100) {
      docs.push({
        id: docs.length + 1,
        filename: title || url,
        url,
        type: "web",
        source: "siz.ch-crawl",
        content: text,
      });
    }

    if (depth < MAX_DEPTH) {
      const links = extractLinks(html, url);
      for (const l of links) {
        if (!visited.has(l)) queue.push({ url: l, depth: depth + 1 });
      }
    }
  }

  return docs;
}

async function main() {
  console.log("Crawle siz.ch + Subdomains ...\n");
  const start = Date.now();
  const docs = await crawl();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n${docs.length} Seiten gecrawlt in ${elapsed}s.`);

  const totalChars = docs.reduce((s, d) => s + d.content.length, 0);
  console.log(`Total Zeichen: ${totalChars.toLocaleString("de-CH")}`);

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: docs.length,
        total_chars: totalChars,
        docs,
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`Gespeichert: ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
