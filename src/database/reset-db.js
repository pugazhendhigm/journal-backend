import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  process.env.SUPABASE_POSTGRES_URL;

if (!connectionString) {
  console.error(
    'Missing database connection string. Set SUPABASE_DB_URL, DATABASE_URL, or SUPABASE_POSTGRES_URL in your .env file.',
  );
  process.exit(1);
}

const resetSql = `
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.journals CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
`;

async function loadSqlFile(fileName) {
  const filePath = path.join(__dirname, fileName);
  return readFile(filePath, 'utf8');
}

async function resetDatabase() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const schemaSql = await loadSqlFile('schema.sql');
    const functionsSql = await loadSqlFile('functions.sql');

    await client.query('BEGIN');
    await client.query(resetSql);
    await client.query(schemaSql);
    await client.query(functionsSql);
    await client.query('COMMIT');

    console.log('Supabase database reset completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Failed to reset Supabase database.');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

resetDatabase();
