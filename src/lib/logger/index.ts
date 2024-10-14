// https://github.com/vercel/next.js/blob/canary/packages/next/src/build/output/log.ts
import { error } from './error';
import { event } from './event';
import { info } from './info';
import { trace } from './trace';
import { wait } from './wait';
import { warn } from './warn';
import { warnOnce } from './warn-once';

export const logger = {
  error,
  event,
  info,
  trace,
  wait,
  warn,
  warnOnce,
};
