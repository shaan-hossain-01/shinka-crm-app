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
    .default(3000)
  ,

  HOST: z.string().default('localhost')
  ,


})
