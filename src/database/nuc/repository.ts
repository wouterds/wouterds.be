import { subHours } from 'date-fns';
import { asc, desc, gte, sql } from 'drizzle-orm';

import { db } from '~/database/connection';

import { NUCReading } from './model';

const add = async (data: NUCReading) => {
  await db.insert(NUCReading).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(NUCReading);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(NUCReading.createdAt));
};

const getLast = async () => {
  const rows = await db.select().from(NUCReading).orderBy(desc(NUCReading.createdAt)).limit(1);

  return rows[0] || null;
};

const getLast24h = async (options?: { sort: 'asc' | 'desc' }) => {
  const sort = options?.sort ?? 'desc';

  const rows = await db
    .select({
      timeGroup: sql<string>`
        DATE_FORMAT(
          DATE_SUB(
            ${NUCReading.createdAt},
            INTERVAL MINUTE(${NUCReading.createdAt}) % 5 MINUTE
          ),
          '%Y-%m-%d %H:%i:00'
        )
      `.as('timeGroup'),
      avgCpuTemp: sql<string>`ROUND(AVG(${NUCReading.cpuTemp}), 1)`,
      avgCpuUsage: sql<string>`ROUND(AVG(${NUCReading.cpuUsage}), 1)`,
      avgMemoryUsage: sql<string>`ROUND(AVG(${NUCReading.memoryUsage}), 1)`,
      avgDiskUsage: sql<string>`ROUND(AVG(${NUCReading.diskUsage}), 1)`,
    })
    .from(NUCReading)
    .where(gte(NUCReading.createdAt, subHours(new Date(), 24)))
    .groupBy(sql`timeGroup`)
    .orderBy(sort === 'desc' ? desc(sql`timeGroup`) : asc(sql`timeGroup`));

  return rows.map((row) => ({
    cpuTemp: parseFloat(row.avgCpuTemp),
    cpuUsage: parseFloat(row.avgCpuUsage),
    memoryUsage: parseFloat(row.avgMemoryUsage),
    diskUsage: parseFloat(row.avgDiskUsage),
    timestamp: new Date(row.timeGroup),
  }));
};

const truncate = async () => {
  await db.delete(NUCReading);
};

export const NUCReadings = {
  add,
  getAll,
  getLast,
  getLast24h,
  truncate,
};
