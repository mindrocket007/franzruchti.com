import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });

const ddl = [
  `CREATE TABLE IF NOT EXISTS "ProjectData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "goals" TEXT NOT NULL DEFAULT '[]',
    "tasks" TEXT NOT NULL DEFAULT '[]',
    "accesses" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ProjectData_userId_slug_key" ON "ProjectData"("userId", "slug")`,
  `CREATE INDEX IF NOT EXISTS "ProjectData_userId_idx" ON "ProjectData"("userId")`,
];

for (const stmt of ddl) {
  console.log("Running:", stmt.split("\n")[0]);
  await client.execute(stmt);
}

const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ProjectData'");
console.log("Verify:", result.rows);

console.log("Done.");
process.exit(0);
