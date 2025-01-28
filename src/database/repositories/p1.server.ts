import { differenceInMinutes } from 'date-fns';
import { desc, sql } from 'drizzle-orm';

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

const getDailyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE(${P1Reading.createdAt})`,
      active: sql<number>`CAST(ROUND(AVG(${P1Reading.active}), 2) AS DECIMAL(10,2))`,
      total: sql<number>`CAST(ROUND(AVG(${P1Reading.total}), 2) AS DECIMAL(10,2))`,
      peak: sql<number>`CAST(ROUND(AVG(${P1Reading.peak}), 2) AS DECIMAL(10,2))`,
    })
    .from(P1Reading)
    .groupBy(sql`DATE(${P1Reading.createdAt})`)
    .orderBy(desc(sql`DATE(${P1Reading.createdAt})`))
    .limit(limit);

  return rows.reverse();
};

const getHourlyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE_FORMAT(${P1Reading.createdAt}, '%Y-%m-%d %H:00:00')`,
      active: sql<number>`CAST(ROUND(AVG(${P1Reading.active}), 2) AS DECIMAL(10,2))`,
      total: sql<number>`CAST(ROUND(AVG(${P1Reading.total}), 2) AS DECIMAL(10,2))`,
      peak: sql<number>`CAST(ROUND(AVG(${P1Reading.peak}), 2) AS DECIMAL(10,2))`,
    })
    .from(P1Reading)
    .groupBy(sql`DATE(${P1Reading.createdAt}), HOUR(${P1Reading.createdAt})`)
    .orderBy(desc(sql`${P1Reading.createdAt}`))
    .limit(limit);

  return rows.reverse();
};

const truncate = async () => {
  await db.delete(P1Reading);
};

export const P1Readings = {
  add,
  getLast,
  getDailyAverages,
  getHourlyAverages,
  truncate,
};
