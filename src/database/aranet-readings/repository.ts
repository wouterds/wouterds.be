import { desc } from 'drizzle-orm';

import { db } from '~/database/connection';

import { AranetReading } from './model';

const add = async (data: AranetReading) => {
  await db.insert(AranetReading).values(data);
};

const getAll = async () => {
  return db.select().from(AranetReading).orderBy(desc(AranetReading.createdAt));
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
  getLast,
  truncate,
};
