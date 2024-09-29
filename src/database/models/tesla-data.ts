import { boolean, float, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export const TeslaDataModel = mysqlTable('tesla-data', {
  id: int('id').autoincrement().primaryKey(),
  battery: int('battery').notNull(),
  distance: float('distance').notNull(),
  wake: boolean('wake').notNull(),
  created_at: timestamp('created_at').notNull(),
});
