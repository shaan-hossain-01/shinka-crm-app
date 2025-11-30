import { z } from "zod";
import dotenv from "dotenv";

const APP_STAGE = process.env.APP_STAGE ?? "dev";
if (APP_STAGE === "dev") dotenv.config({ path: ".env" });
if (APP_STAGE === "test") dotenv.config({ path: ".env.test" });

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_STAGE: z.enum(["dev", "production", "test"]).default("dev"),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET >= 32 chars"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string().min(32, "REFRESH_TOKEN_SECRET >= 32 chars").optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),

  CORS_ORIGIN: z.preprocess(
    (val) => typeof val === "string" ? val.split(",").map(s => s.trim()).filter(Boolean) : ["http://localhost:3000"],
    z.array(z.string().url()).min(1)
  ),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(20).default(12),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid ENV", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;