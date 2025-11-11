import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import pinoHttp from 'pino-http';
import env from './config/env';
import healthRouter from './routes/health';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
})

const app = express();

app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({
      userId: (req as any).user?.id ?? null,
    })
  })
)


export default app;
