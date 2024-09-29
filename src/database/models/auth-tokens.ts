import { index, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const AuthTokensModel = mysqlTable(
  'auth-tokens',
  {
    id: int('id').autoincrement().primaryKey(),
    type: varchar('type', { length: 32 }).notNull(),
    access_token: varchar('access_token', { length: 255 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }).notNull(),
    expiry: timestamp('expiry').notNull(),
    created_at: timestamp('created_at').notNull(),
  },
  (table) => ({
    typeIdx: index('type_idx').on(table.type),
  }),
);
