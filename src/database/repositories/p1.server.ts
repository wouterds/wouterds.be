import { differenceInMinutes } from 'date-fns';
import { desc } from 'drizzle-orm';

import { db } from '~/database/connection.server';

import { P1Reading } from '../schema/p1.server';

const add = async (data: P1Reading) => {
  await db.insert(P1Reading).values(data);
};

const getLast = async () => {
  const rows = await db.select().from(P1Reading).orderBy(desc(P1Reading.createdAt)).limit(1);

  const row = rows[0];
  if (row && differenceInMinutes(new Date(), row.createdAt) <= 15) {
    return row;
  }

  return null;
};

const truncate = async () => {
  await db.delete(P1Reading);
};

export const P1Readings = {
  add,
  getLast,
  truncate,
};
