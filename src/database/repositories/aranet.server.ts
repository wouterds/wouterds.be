import { differenceInMinutes } from 'date-fns';
import { desc } from 'drizzle-orm';

import { db } from '~/database/connection.server';

import { AranetReading } from '../schema/aranet.server';

const add = async (data: AranetReading) => {
  await db.insert(AranetReading).values(data);
};

const getLast = async () => {
  const rows = await db
    .select()
    .from(AranetReading)
    .orderBy(desc(AranetReading.createdAt))
    .limit(1);

  const row = rows[0];
  if (row && differenceInMinutes(new Date(), row.createdAt) <= 15) {
    return row;
  }

  return null;
};

const truncate = async () => {
  await db.delete(AranetReading);
};

export const AranetReadings = {
  add,
  getLast,
  truncate,
};
