import { z } from 'zod';
import dotenv from 'dotenv';

//Determine application stage 
process.env.APP_STAGE = process.env.APP_STAGE || 'dev';

const isProduction = process.env.APP_STAGE === 'production';
const isDevelopment = process.env.APP_STAGE === 'dev';
const isTest = process.env.APP_STAGE === 'test';

//Loading .env files based on environment
if (isDevelopment) {
  dotenv.config({ path: '.env' });
} else if (isTest) {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config();
}

//Define validation schema with zod
const envSchema = z.object({
  //Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
  ,
  APP_STAGE: z
    .enum(['dev', 'production', 'test'])
    .default('dev')
  ,

  //Server Configuration
  PORT: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(4000)
  ,

  HOST: z.string().default('localhost')
  ,

  //Database Configuration
  DATABASE_URL: z
    .string()
    .startsWith('postgresql://')
  ,
  DATABASE_POOL_MIN: z
    .coerce
    .number()
    .min(0)
    .default(2)
  ,
  DATABASE_POOL_MAX: z
    .coerce
    .number()
    .positive()
    .default(10)
  ,


  //JWT Authentication 
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long')
  ,
  JWT_EXPIRES_IN: z
    .string()
    .default('7d')
  ,
  REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .default('30d')
  ,
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters long')
    .optional()
  ,

  //BCrypt Configuration
  BCRYPT_ROUNDS: z
    .coerce
    .number()
    .int()
    .min(10)
    .max(20)
    .default(12)
  ,


  // CORS origin for your Next.js frontend. Add more later if needed.
  CORS_ORIGIN: z
    .string()
    .or(z
      .array(z.string()))
    .transform((val) => {
      if (typeof val === 'string') {
        return val.split(',').map((origin).trim())
      }
      return val
    })
    .default()
  ,
})

//Type inference from schema
export type Env = z.infer<typeof envSchema>

//Parse and validate envSchema
let env: Env;

env = envSchema.safeParse(process.env);


if (!env.success) {
  console.error("❌ Invalid environment variables");
  console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));

  env.error.errors.forEach((issue) => {
    const path = issue.path.join(".");
    console.error(`${path}: ${issue.message}`);
  });

  process.exit(1);
}
