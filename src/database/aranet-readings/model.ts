import { InferInsertModel } from 'drizzle-orm';
import { float, index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export type AranetReading = InferInsertModel<typeof AranetReading>;

export const AranetReading = mysqlTable(
  'aranet-readings',
  {
    id: int('id').autoincrement().primaryKey(),
    temperature: float('temperature').notNull(),
    humidity: int('humidity').notNull(),
    co2: int('co2').notNull(),
    pressure: float('pressure').notNull(),
    battery: int('battery').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      createdAtIdx: index('created_at_idx').on(table.createdAt),
    };
  },
);
