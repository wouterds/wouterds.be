import { type InferInsertModel } from 'drizzle-orm';
import { float, index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export type P1Reading = InferInsertModel<typeof P1Reading>;

export const P1Reading = mysqlTable(
  'p1-readings',
  {
    id: int('id').autoincrement().primaryKey(),
    active: int('active').notNull(),
    total: float('total').notNull(),
    peak: int('peak').notNull(),
    peakedAt: timestamp('peaked_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      createdAtIdx: index('created_at_idx').on(table.createdAt),
    };
  },
);
