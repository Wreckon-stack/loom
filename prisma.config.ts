import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use local SQLite for migrations, runtime uses LibSQL adapter
    url: process.env["DATABASE_URL"]?.startsWith("libsql://")
      ? "file:./dev.db"
      : process.env["DATABASE_URL"],
  },
});
