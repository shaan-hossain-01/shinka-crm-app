import { env } from './config/env';
import app from './express';
import db from './db/client';

// Initialize database connection
try {
  // The database connection is established when the client is imported
  console.log('Database client initialized');
} catch (err) {
  console.error('Database connection failed:', err);
  process.exit(1);
}

app.listen(env.PORT, () => {
  console.info('Server started on port %s.', env.PORT);
});
