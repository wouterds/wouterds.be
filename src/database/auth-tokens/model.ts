import { InferInsertModel } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, timestamp, unique, varchar } from 'drizzle-orm/mysql-core';

export type AuthToken = InferInsertModel<typeof AuthToken>;

export const AuthToken = mysqlTable(
  'auth-tokens',
  {
    id: int('id').autoincrement().primaryKey(),
    vendor: mysqlEnum('vendor', ['SPOTIFY', 'TESLA']).notNull(),
    type: mysqlEnum('type', ['ACCESS_TOKEN', 'REFRESH_TOKEN']).notNull(),
    token: varchar('token', { length: 2048 }).notNull(),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    vendorTypeIdx: unique('vendor_type_idx').on(table.vendor, table.type),
  }),
);
