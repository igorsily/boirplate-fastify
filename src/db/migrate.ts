import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { env } from '@/config/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 1,
});

const db = drizzle(pool);

console.log('🔄 Running migrations...');

try {
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  await pool.end();
}
