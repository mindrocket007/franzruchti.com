// Crawlt alle SIZ-Dokumente auf Google Drive und extrahiert den Text in eine JSON-Wissensbasis
// Unterstützte Formate: PDF, DOCX, XLSX, TXT, MD, HTML, CSV
// Ausgabe: public/siz-knowledge/corpus.json
//
// Ausführen: node scripts/crawl-siz-docs.mjs
//
// Erforderlich: npm install pdf-parse mammoth xlsx

import fs from "fs";
import path from "path";

const SIZ_ROOT = "G:/Meine Ablage/SIZ";
const OUTPUT = "public/siz-knowledge/corpus.json";
const SKIP_DIRS = new Set([".tmp.drivedownload", ".tmp.driveupload"]);
const MAX_CHARS_PER_DOC = 80000; // Limit pro Dokument
const SUPPORTED = new Set([".pdf", ".docx", ".xlsx", ".txt", ".md", ".html", ".csv"]);

async function extractPdf(filePath) {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const buf = fs.readFileSync(filePath);
    const data = await pdfParse(buf);
    return data.text || "";
  } catch (e) {
    return `[PDF-Extraktion fehlgeschlagen: ${e.message}]`;
  }
}

async function extractDocx(filePath) {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  } catch (e) {
    return `[DOCX-Extraktion fehlgeschlagen: ${e.message}]`;
  }
}

async function extractXlsx(filePath) {
  try {
    const xlsx = await import("xlsx");
    const wb = xlsx.readFile(filePath);
    const out = [];
    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const csv = xlsx.utils.sheet_to_csv(ws);
      out.push(`=== Sheet: ${sheetName} ===\n${csv}`);
    }
    return out.join("\n\n");
  } catch (e) {
    return `[XLSX-Extraktion fehlgeschlagen: ${e.message}]`;
  }
}

async function extractText(filePath, ext) {
  if (ext === ".pdf") return extractPdf(filePath);
  if (ext === ".docx") return extractDocx(filePath);
  if (ext === ".xlsx") return extractXlsx(filePath);
  if (ext === ".txt" || ext === ".md" || ext === ".html" || ext === ".csv") {
    return fs.readFileSync(filePath, "utf8");
  }
  return "";
}

async function walk(dir, docs = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("~$")) continue; // Office-Lock-Files
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(full, docs);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SUPPORTED.has(ext)) continue;
      console.log(`  [${docs.length + 1}] ${path.relative(SIZ_ROOT, full)}`);
      const text = await extractText(full, ext);
      const trimmed = text.trim().slice(0, MAX_CHARS_PER_DOC);
      if (trimmed.length > 20) {
        docs.push({
          id: docs.length + 1,
          filename: entry.name,
          path: path.relative(SIZ_ROOT, full).replace(/\\/g, "/"),
          type: ext.slice(1),
          size: fs.statSync(full).size,
          content: trimmed,
        });
      }
    }
  }
  return docs;
}

async function main() {
  console.log("Crawle SIZ-Ordner:", SIZ_ROOT);
  const start = Date.now();
  const docs = await walk(SIZ_ROOT);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n${docs.length} Dokumente extrahiert in ${elapsed}s.`);

  const totalChars = docs.reduce((s, d) => s + d.content.length, 0);
  console.log(`Total Zeichen: ${totalChars.toLocaleString("de-CH")}`);

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const corpus = {
    generated_at: new Date().toISOString(),
    source: SIZ_ROOT,
    count: docs.length,
    total_chars: totalChars,
    docs,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(corpus, null, 2), "utf8");
  console.log(`\nGespeichert: ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
