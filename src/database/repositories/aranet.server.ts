import { desc, sql } from 'drizzle-orm';

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

  return rows[0] || null;
};

const getDailyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE(${AranetReading.createdAt})`,
      temperature: sql<number>`AVG(${AranetReading.temperature})`,
      humidity: sql<number>`AVG(${AranetReading.humidity})`,
      co2: sql<number>`AVG(${AranetReading.co2})`,
      pressure: sql<number>`AVG(${AranetReading.pressure})`,
      battery: sql<number>`AVG(${AranetReading.battery})`,
    })
    .from(AranetReading)
    .groupBy(sql`DATE(${AranetReading.createdAt})`)
    .orderBy(desc(sql`DATE(${AranetReading.createdAt})`))
    .limit(limit);

  return rows.reverse();
};

const getHourlyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE_FORMAT(${AranetReading.createdAt}, '%Y-%m-%d %H:00:00')`,
      temperature: sql<number>`AVG(${AranetReading.temperature})`,
      humidity: sql<number>`AVG(${AranetReading.humidity})`,
      co2: sql<number>`AVG(${AranetReading.co2})`,
      pressure: sql<number>`AVG(${AranetReading.pressure})`,
      battery: sql<number>`AVG(${AranetReading.battery})`,
    })
    .from(AranetReading)
    .groupBy(sql`DATE(${AranetReading.createdAt}), HOUR(${AranetReading.createdAt})`)
    .orderBy(desc(sql`${AranetReading.createdAt}`))
    .limit(limit);

  return rows.reverse();
};

const truncate = async () => {
  await db.delete(AranetReading);
};

export const AranetReadings = {
  add,
  getLast,
  getDailyAverages,
  getHourlyAverages,
  truncate,
};
