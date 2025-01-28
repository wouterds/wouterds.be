import { differenceInMinutes } from 'date-fns';
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

  const row = rows[0];
  if (row && differenceInMinutes(new Date(), row.createdAt) <= 15) {
    return row;
  }

  return null;
};

const getDailyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE(${AranetReading.createdAt})`,
      temperature: sql<number>`CAST(ROUND(AVG(${AranetReading.temperature}), 2) AS DECIMAL(10,2))`,
      humidity: sql<number>`CAST(ROUND(AVG(${AranetReading.humidity}), 2) AS DECIMAL(10,2))`,
      co2: sql<number>`CAST(ROUND(AVG(${AranetReading.co2}), 2) AS DECIMAL(10,2))`,
      pressure: sql<number>`CAST(ROUND(AVG(${AranetReading.pressure}), 2) AS DECIMAL(10,2))`,
      battery: sql<number>`CAST(ROUND(AVG(${AranetReading.battery}), 2) AS DECIMAL(10,2))`,
    })
    .from(AranetReading)
    .groupBy(sql`DATE(${AranetReading.createdAt})`)
    .orderBy(desc(sql`DATE(${AranetReading.createdAt})`))
    .limit(limit);

  console.log({ rows });

  return rows.reverse();
};

export const getHourlyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE_FORMAT(${AranetReading.createdAt}, '%Y-%m-%d %H:00:00')`,
      temperature: sql<number>`CAST(ROUND(AVG(${AranetReading.temperature}), 2) AS DECIMAL(10,2))`,
      humidity: sql<number>`CAST(ROUND(AVG(${AranetReading.humidity}), 2) AS DECIMAL(10,2))`,
      co2: sql<number>`CAST(ROUND(AVG(${AranetReading.co2}), 2) AS DECIMAL(10,2))`,
      pressure: sql<number>`CAST(ROUND(AVG(${AranetReading.pressure}), 2) AS DECIMAL(10,2))`,
      battery: sql<number>`CAST(ROUND(AVG(${AranetReading.battery}), 2) AS DECIMAL(10,2))`,
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
