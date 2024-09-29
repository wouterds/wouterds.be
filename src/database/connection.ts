import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'todo',
  user: 'todo',
  password: 'todo',
  database: 'todo',
});

export const db = drizzle(connection);
