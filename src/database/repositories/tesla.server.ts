import { differenceInMinutes } from 'date-fns';
import { desc, eq, sql } from 'drizzle-orm';

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

  const row = rows[0];
  if (row && differenceInMinutes(new Date(), row.createdAt) <= 15) {
    return row;
  }

  return null;
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

const getDailyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE(${TeslaDataRecord.createdAt})`,
      battery: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.battery}), 2) AS DECIMAL(10,2))`,
      distance: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.distance}), 2) AS DECIMAL(10,2))`,
      temperatureInside: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.temperatureInside}), 2) AS DECIMAL(10,2))`,
      temperatureOutside: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.temperatureOutside}), 2) AS DECIMAL(10,2))`,
    })
    .from(TeslaDataRecord)
    .groupBy(sql`DATE(${TeslaDataRecord.createdAt})`)
    .orderBy(desc(sql`DATE(${TeslaDataRecord.createdAt})`))
    .limit(limit);

  return rows.reverse();
};

const getHourlyAverages = async (limit: number) => {
  const rows = await db
    .select({
      date: sql<string>`DATE_FORMAT(${TeslaDataRecord.createdAt}, '%Y-%m-%d %H:00:00')`,
      battery: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.battery}), 2) AS DECIMAL(10,2))`,
      distance: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.distance}), 2) AS DECIMAL(10,2))`,
      temperatureInside: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.temperatureInside}), 2) AS DECIMAL(10,2))`,
      temperatureOutside: sql<number>`CAST(ROUND(AVG(${TeslaDataRecord.temperatureOutside}), 2) AS DECIMAL(10,2))`,
    })
    .from(TeslaDataRecord)
    .groupBy(sql`DATE(${TeslaDataRecord.createdAt}), HOUR(${TeslaDataRecord.createdAt})`)
    .orderBy(desc(sql`${TeslaDataRecord.createdAt}`))
    .limit(limit);

  return rows.reverse();
};

const truncate = async () => {
  await db.delete(TeslaDataRecord);
};

export const TeslaData = {
  add,
  getLast,
  getLastAwake,
  getDailyAverages,
  getHourlyAverages,
  truncate,
};
