import { desc, sql } from 'drizzle-orm';

import { db } from '~/database/connection.server';

import { NUCReading } from '../schema/nuc.server';

const add = async (data: NUCReading) => {
  await db.insert(NUCReading).values(data);
};

const getLast = async () => {
  const rows = await db.select().from(NUCReading).orderBy(desc(NUCReading.createdAt)).limit(1);

  return rows[0] || null;
};

const getDailyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE(${NUCReading.createdAt})`,
      cpuTemp: sql<number>`AVG(${NUCReading.cpuTemp})`,
      cpuUsage: sql<number>`AVG(${NUCReading.cpuUsage})`,
      memoryUsage: sql<number>`AVG(${NUCReading.memoryUsage})`,
      diskUsage: sql<number>`AVG(${NUCReading.diskUsage})`,
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
      cpuTemp: sql<number>`AVG(${NUCReading.cpuTemp})`,
      cpuUsage: sql<number>`AVG(${NUCReading.cpuUsage})`,
      memoryUsage: sql<number>`AVG(${NUCReading.memoryUsage})`,
      diskUsage: sql<number>`AVG(${NUCReading.diskUsage})`,
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
