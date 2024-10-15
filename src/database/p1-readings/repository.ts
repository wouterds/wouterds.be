import { subHours } from 'date-fns';
import { asc, desc, gte, sql } from 'drizzle-orm';

import { db } from '~/database/connection';

import { P1Reading } from './model';

const add = async (data: P1Reading) => {
  await db.insert(P1Reading).values(data);
};

const getAll = async (limit?: number) => {
  const query = db.select().from(P1Reading);
  if (limit) {
    query.limit(limit);
  }

  return query.orderBy(desc(P1Reading.createdAt));
};

const getLast24h = async (options?: { sort: 'asc' | 'desc' }) => {
  const sort = options?.sort ?? 'desc';

  const rows = await db
    .select({
      timeGroup: sql<string>`
      DATE_FORMAT(
        DATE_SUB(
          ${P1Reading.createdAt},
          INTERVAL MINUTE(${P1Reading.createdAt}) % 10 MINUTE
        ),
        '%Y-%m-%d %H:%i:00'
      )
    `.as('timeGroup'),
      avgActive: sql<string>`ROUND(AVG(${P1Reading.active}), 0)`,
      avgTotal: sql<string>`ROUND(AVG(${P1Reading.total}), 1)`,
    })
    .from(P1Reading)
    .where(gte(P1Reading.createdAt, subHours(new Date(), 24)))
    .groupBy(sql`timeGroup`)
    .orderBy(sort === 'desc' ? desc(sql`timeGroup`) : asc(sql`timeGroup`));

  return rows.map((row) => ({
    active: parseFloat(row.avgActive),
    total: parseFloat(row.avgTotal),
    timestamp: new Date(row.timeGroup),
  }));
};

const getLast = async () => {
  const rows = await db.select().from(P1Reading).orderBy(desc(P1Reading.createdAt)).limit(1);

  return rows[0] || null;
};

const truncate = async () => {
  await db.delete(P1Reading);
};

export const P1Readings = {
  add,
  getAll,
  getLast24h,
  getLast,
  truncate,
};
