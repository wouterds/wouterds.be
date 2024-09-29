import { float, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export const AranetModel = mysqlTable('aranet-readings', {
  id: int('id').autoincrement().primaryKey(),
  temperature: float('temperature').notNull(),
  humidity: int('humidity').notNull(),
  co2: int('co2').notNull(),
  pressure: float('pressure').notNull(),
  battery: int('battery').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
