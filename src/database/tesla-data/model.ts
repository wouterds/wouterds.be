import { InferInsertModel } from 'drizzle-orm';
import { boolean, float, index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export type TeslaDataRecord = InferInsertModel<typeof TeslaDataRecord>;

export const TeslaDataRecord = mysqlTable(
  'tesla-data',
  {
    id: int('id').autoincrement().primaryKey(),
    battery: int('battery').notNull(),
    distance: float('distance').notNull(),
    temperature_inside: float('temperature_inside'),
    temperature_outside: float('temperature_outside'),
    wake: boolean('wake').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      createdAtIdx: index('created_at_idx').on(table.created_at),
      wakeIdx: index('wake_idx').on(table.wake),
    };
  },
);
