import { subHours } from 'date-fns';
import { desc, gte } from 'drizzle-orm';

import { db } from '~/database/connection';

import { AranetReading } from './model';

const add = async (data: AranetReading) => {
  await db.insert(AranetReading).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(AranetReading);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(AranetReading.createdAt));
};

const getLast24h = async () => {
  const rows = await db
    .select()
    .from(AranetReading)
    .where(gte(AranetReading.createdAt, subHours(new Date(), 24)))
    .orderBy(desc(AranetReading.createdAt));

  return rows;
};

const getLast = async () => {
  const rows = await db
    .select()
    .from(AranetReading)
    .orderBy(desc(AranetReading.createdAt))
    .limit(1);

  return rows[0] || null;
};

const truncate = async () => {
  await db.delete(AranetReading);
};

export const AranetReadings = {
  add,
  getAll,
  getLast24h,
  getLast,
  truncate,
};
