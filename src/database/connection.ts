import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST!,
  port: 3306,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});

export const db = drizzle(connection);
