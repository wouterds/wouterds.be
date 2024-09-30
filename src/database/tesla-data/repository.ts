import { desc } from 'drizzle-orm';

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

  return query.orderBy(desc(TeslaDataRecord.created_at));
};

const truncate = async () => {
  await db.delete(TeslaDataRecord);
};

export const TeslaData = {
  add,
  getAll,
  truncate,
};
