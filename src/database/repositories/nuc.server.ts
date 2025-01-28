import { differenceInMinutes } from 'date-fns';
import { desc, sql } from 'drizzle-orm';

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

const getDailyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE(${NUCReading.createdAt})`,
      cpuTemp: sql<number>`CAST(ROUND(AVG(${NUCReading.cpuTemp}), 2) AS DECIMAL(10,2))`,
      cpuUsage: sql<number>`CAST(ROUND(AVG(${NUCReading.cpuUsage}), 2) AS DECIMAL(10,2))`,
      memoryUsage: sql<number>`CAST(ROUND(AVG(${NUCReading.memoryUsage}), 2) AS DECIMAL(10,2))`,
      diskUsage: sql<number>`CAST(ROUND(AVG(${NUCReading.diskUsage}), 2) AS DECIMAL(10,2))`,
    })
    .from(NUCReading)
    .groupBy(sql`DATE(${NUCReading.createdAt})`)
    .orderBy(desc(sql`DATE(${NUCReading.createdAt})`))
    .limit(limit);

  return rows.reverse();
};

const getHourlyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE_FORMAT(${NUCReading.createdAt}, '%Y-%m-%d %H:00:00')`,
      cpuTemp: sql<number>`CAST(ROUND(AVG(${NUCReading.cpuTemp}), 2) AS DECIMAL(10,2))`,
      cpuUsage: sql<number>`CAST(ROUND(AVG(${NUCReading.cpuUsage}), 2) AS DECIMAL(10,2))`,
      memoryUsage: sql<number>`CAST(ROUND(AVG(${NUCReading.memoryUsage}), 2) AS DECIMAL(10,2))`,
      diskUsage: sql<number>`CAST(ROUND(AVG(${NUCReading.diskUsage}), 2) AS DECIMAL(10,2))`,
    })
    .from(NUCReading)
    .groupBy(sql`DATE(${NUCReading.createdAt}), HOUR(${NUCReading.createdAt})`)
    .orderBy(desc(sql`${NUCReading.createdAt}`))
    .limit(limit);

  return rows.reverse();
};

const truncate = async () => {
  await db.delete(NUCReading);
};

export const NUCReadings = {
  add,
  getLast,
  getDailyAverages,
  getHourlyAverages,
  truncate,
};
