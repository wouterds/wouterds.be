import { subHours } from 'date-fns';
import { asc, desc, eq, gte } from 'drizzle-orm';

import { db } from '~/database/connection';

import { TeslaDataRecord } from './model';

const add = async (data: TeslaDataRecord) => {
  await db.insert(TeslaDataRecord).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(TeslaDataRecord);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(TeslaDataRecord.createdAt));
};

const getLast24h = async (options?: { sort: 'asc' | 'desc' }) => {
  const sort = options?.sort ?? 'desc';

  const rows = await db
    .select()
    .from(TeslaDataRecord)
    .where(gte(TeslaDataRecord.createdAt, subHours(new Date(), 24)))
    .orderBy(sort === 'desc' ? desc(TeslaDataRecord.createdAt) : asc(TeslaDataRecord.createdAt));

  return rows;
};

const getLast = async () => {
  const rows = await db
    .select()
    .from(TeslaDataRecord)
    .orderBy(desc(TeslaDataRecord.createdAt))
    .limit(1);

  return rows[0] || null;
};

const getLastAwake = async () => {
  const rows = await db
    .select()
    .from(TeslaDataRecord)
    .where(eq(TeslaDataRecord.wake, true))
    .orderBy(desc(TeslaDataRecord.createdAt))
    .limit(1);

  return rows[0] || null;
};

const truncate = async () => {
  await db.delete(TeslaDataRecord);
};

export const TeslaData = {
  add,
  getAll,
  getLast24h,
  getLast,
  getLastAwake,
  truncate,
};
