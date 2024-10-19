import { desc } from 'drizzle-orm';

import { db } from '~/database/connection';

import { NUCReading } from './model';

const add = async (data: NUCReading) => {
  await db.insert(NUCReading).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(NUCReading);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(NUCReading.createdAt));
};

const getLast = async () => {
  const rows = await db.select().from(NUCReading).orderBy(desc(NUCReading.createdAt)).limit(1);

  return rows[0] || null;
};

const truncate = async () => {
  await db.delete(NUCReading);
};

export const NUCReadings = {
  add,
  getAll,
  getLast,
  truncate,
};
