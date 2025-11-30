import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import crypto from 'crypto';

// Load backend .env
dotenv.config({ path: resolve(__dirname, '../apps/backend/.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

function makeSalt(): string {
  return Math.round(new Date().valueOf() * Math.random()) + '';
}

function encryptPassword(password: string, salt: string): string {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
}

async function seed() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    console.log('🌱 Seeding database...');

    // Test user data
    const testUsers = [
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
      },
    ];

    console.log(`📝 Creating ${testUsers.length} test users...`);

    for (const user of testUsers) {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (existingUser.rows.length > 0) {
        console.log(`⏭️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Create password hash using the same method as backend
      const salt = makeSalt();
      const hashedPassword = encryptPassword(user.password, salt);

      // Insert user
      await client.query(
        `INSERT INTO users (name, email, hashed_password, salt, created, updated)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [user.name, user.email, hashedPassword, salt]
      );

      console.log(`✅ Created user: ${user.email}`);
    }

    // Create user profile for test user
    const testUserResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['test@example.com']
    );

    if (testUserResult.rows.length > 0) {
      const userId = testUserResult.rows[0].id;

      try {
        const existingProfile = await client.query(
          'SELECT id FROM user_profiles WHERE user_id = $1',
          [userId]
        );

        if (existingProfile.rows.length === 0) {
          await client.query(
            `INSERT INTO user_profiles (user_id, bio, location, website, created, updated)
             VALUES ($1, $2, $3, $4, NOW(), NOW())`,
            [userId, 'This is a test user account', 'Earth', 'https://example.com']
          );
          console.log(`✅ Created profile for test user`);
        }
      } catch (err: any) {
        if (err.code === '42P01') {
          console.log('⏭️  user_profiles table does not exist yet, skipping profile creation');
        } else {
          throw err;
        }
      }
    }

    console.log('\n✅ Database seeded successfully');
    console.log('\n🔐 Login Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();

