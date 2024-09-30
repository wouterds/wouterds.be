import { desc } from 'drizzle-orm';

import { db } from '~/database/connection';

import { P1HistoryRecord } from './model';

const add = async (data: P1HistoryRecord) => {
  await db.insert(P1HistoryRecord).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(P1HistoryRecord);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(P1HistoryRecord.created_at));
};

const truncate = async () => {
  await db.delete(P1HistoryRecord);
};

export const P1History = {
  add,
  getAll,
  truncate,
};
