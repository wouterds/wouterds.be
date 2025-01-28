import { differenceInMinutes } from 'date-fns';
import { desc } from 'drizzle-orm';

import { db } from '~/database/connection.server';

import { NUCReading } from '../schema/nuc.server';

const add = async (data: NUCReading) => {
  await db.insert(NUCReading).values(data);
};

const getLast = async () => {
  const rows = await db.select().from(NUCReading).orderBy(desc(NUCReading.createdAt)).limit(1);

  const row = rows[0];
  if (row && differenceInMinutes(new Date(), row.createdAt) <= 15) {
    return row;
  }

  return null;
};

const truncate = async () => {
  await db.delete(NUCReading);
};

export const NUCReadings = {
  add,
  getLast,
  truncate,
};
