import { db } from '~/database/connection';

import { P1Reading } from './model';

const add = async (data: P1Reading) => {
  await db.insert(P1Reading).values(data);
};

const getAll = async () => {
  return db.select().from(P1Reading);
};

const truncate = async () => {
  await db.delete(P1Reading);
};

export const P1Readings = {
  add,
  getAll,
  truncate,
};
