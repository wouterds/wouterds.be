import { subHours } from 'date-fns';
import { desc, gte, sql } from 'drizzle-orm';

import { db } from '~/database/connection';

import { AranetReading } from './model';

const add = async (data: AranetReading) => {
  await db.insert(AranetReading).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(AranetReading);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(AranetReading.createdAt));
};

const getLast24h = async () => {
  const rows = await db
    .select({
      timeGroup: sql<string>`
        DATE_FORMAT(
          DATE_SUB(
            ${AranetReading.createdAt},
            INTERVAL MINUTE(${AranetReading.createdAt}) % 10 MINUTE
          ),
          '%Y-%m-%d %H:%i:00'
        )
      `.as('timeGroup'),
      avgCo2: sql<string>`ROUND(AVG(${AranetReading.co2}), 0)`,
      avgTemperature: sql<string>`ROUND(AVG(${AranetReading.temperature}), 1)`,
      avgHumidity: sql<string>`ROUND(AVG(${AranetReading.humidity}), 1)`,
      avgPressure: sql<string>`ROUND(AVG(${AranetReading.pressure}), 1)`,
    })
    .from(AranetReading)
    .where(gte(AranetReading.createdAt, subHours(new Date(), 24)))
    .groupBy(sql`timeGroup`)
    .orderBy(desc(sql`timeGroup`));

  return rows.map((row) => ({
    co2: parseFloat(row.avgCo2),
    temperature: parseFloat(row.avgTemperature),
    humidity: parseFloat(row.avgHumidity),
    pressure: parseFloat(row.avgPressure),
    timestamp: new Date(row.timeGroup),
  }));
};

const getLast = async () => {
  const rows = await db
    .select()
    .from(AranetReading)
    .orderBy(desc(AranetReading.createdAt))
    .limit(1);

  return rows[0] || null;
};

const truncate = async () => {
  await db.delete(AranetReading);
};

export const AranetReadings = {
  add,
  getAll,
  getLast24h,
  getLast,
  truncate,
};
