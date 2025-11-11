import { Router } from "express";
import { pingDb } from "../services/ready";

const router = Router();

// Simple liveness check
router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Readiness check (DB connectivity). Will return 503 until DB is up.
router.get("/ready", async (_req, res) => {
  const ok = await pingDb();
  if (ok) return res.json({ ok: true });
  return res.status(503).json({
    error: { code: "SERVICE_UNAVAILABLE", message: "Database not reachable" },
  });
});

export default router;
