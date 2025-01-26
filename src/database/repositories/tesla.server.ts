import { desc, eq } from 'drizzle-orm';

import { db } from '~/database/connection.server';

import { TeslaDataRecord } from '../schema/tesla.server';

const add = async (data: TeslaDataRecord) => {
  await db.insert(TeslaDataRecord).values(data);
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
  getLast,
  getLastAwake,
  truncate,
};
