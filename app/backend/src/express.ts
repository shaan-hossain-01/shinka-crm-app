import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import Template from './template';
import userRoutes from './users/user.routes';
import authRoutes from './auth/auth.routes';

const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// Serve HTML template at root URL
app.get('/', (req, res) => {
  res.status(200).send(Template());
});

// Mount routes
app.use('/', userRoutes);
app.use('/', authRoutes);

// Auth error handling for express-jwt
// Catch UnauthorizedError and return 401
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

export default app;
