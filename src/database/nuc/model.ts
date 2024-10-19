import { InferInsertModel } from 'drizzle-orm';
import { float, index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export type NUCReading = InferInsertModel<typeof NUCReading>;

export const NUCReading = mysqlTable(
  'nuc-readings',
  {
    id: int('id').autoincrement().primaryKey(),
    cpuTemp: float('cpu_temp').notNull(),
    cpuUsage: float('cpu_usage').notNull(),
    memoryUsage: float('memory_usage').notNull(),
    diskUsage: float('disk_usage').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      createdAtIdx: index('created_at_idx').on(table.createdAt),
    };
  },
);
