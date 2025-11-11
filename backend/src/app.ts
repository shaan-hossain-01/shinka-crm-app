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


app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (env.CORS_ORIGIN.includes(origin)) return callback(null, true);

    return callback(new Error("CORS origin not allowed"), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1", healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
