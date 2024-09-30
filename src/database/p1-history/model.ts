import { InferInsertModel } from 'drizzle-orm';
import { float, index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export type P1HistoryRecord = InferInsertModel<typeof P1HistoryRecord>;

export const P1HistoryRecord = mysqlTable(
  'p1-history',
  {
    id: int('id').autoincrement().primaryKey(),
    total: float('total').notNull(),
    peak: int('peak').notNull(),
    peakTime: timestamp('peak_time').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      createdAtIdx: index('created_at_idx').on(table.created_at),
    };
  },
);
