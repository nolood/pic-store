import { schema } from './schemas/schema';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { env } from '../env';

const sqLite = new Database(env.dbUrl);

export const db = drizzle(sqLite, { schema: schema });
