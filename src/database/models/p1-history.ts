import { float, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export const P1HistoryModel = mysqlTable('p1-history', {
  id: int('id').autoincrement().primaryKey(),
  total: float('total').notNull(),
  peak: int('peak').notNull(),
  peakTime: timestamp('peak_time').notNull(),
  created_at: timestamp('created_at').notNull(),
});
