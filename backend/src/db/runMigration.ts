import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationPath = path.resolve(
  __dirname,
  "../../migrations/001_initial_schema.sql",
  "../../migrations/002_initial_schema.sql"
);

const runMigration = async () => {
  try {
    console.log("🔄 Running database migration...");

    const sql = fs.readFileSync(migrationPath, "utf-8");

    await pool.query(sql);

    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed");
    console.error(error);
  } finally {
    await pool.end();
  }
};

runMigration();