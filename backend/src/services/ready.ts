import { Pool } from "pg";
import env from "../config/env";

// A tiny connection pool for readiness checks
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: 0,
  max: Math.min(2, env.DATABASE_POOL_MAX),
});

export async function pingDb(): Promise<boolean> {
  try {
    // Fast, harmless query
    await pool.query("SELECT 1");
    return true;
  } catch (_e) {
    return false;
  }
}
