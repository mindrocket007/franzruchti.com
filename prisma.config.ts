import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (process.env.TURSO_DATABASE_URL || "file:./dev.db").replace("libsql://", "https://"),
  },
});
