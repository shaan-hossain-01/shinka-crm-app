import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load backend .env
dotenv.config({ path: resolve(__dirname, '../apps/backend/.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function migrate() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add your migration logic here
    console.log('📝 Running migrations...');

    // Example: Run drizzle-kit commands
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    const { stdout, stderr } = await execPromise(
      'cd apps/backend && npm run migrate:push'
    );

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
