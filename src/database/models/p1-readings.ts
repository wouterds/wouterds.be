import { float, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export const P1ReadingsModel = mysqlTable('p1-readings', {
  id: int('id').autoincrement().primaryKey(),
  active: int('active').notNull(),
  total: float('total').notNull(),
  created_at: timestamp('created_at').notNull(),
});
