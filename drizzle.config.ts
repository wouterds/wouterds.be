import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/database/models',
  out: './src/database/migrations',
  dbCredentials: {
    host: 'todo',
    port: 3306,
    user: 'todo',
    password: 'todo',
    database: 'todo',
  },
});
