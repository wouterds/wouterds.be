import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

import * as schema from './schema';

const connection = mysql.createConnection({
  host: process.env.DB_HOST!,
  port: 3306,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  decimalNumbers: true,
  dateStrings: false,
  typeCast: function (field, next) {
    if (field.type === 'DECIMAL' || field.type === 'NEWDECIMAL') {
      const value = field.string();
      return value === null ? null : Number(value);
    }
    return next();
  },
});

export const db = drizzle(connection, { schema, mode: 'default' });
