import { ActionFunctionArgs } from '@remix-run/cloudflare';
import { differenceInMinutes, endOfYesterday, fromUnixTime, getUnixTime } from 'date-fns';

import { P1HistoryRecord, P1Record } from '~/data/repositories/p1-repository';

export const action = async ({ request, response, context }: ActionFunctionArgs) => {
  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.cloudflare.env.API_AUTH_TOKEN) {
    response!.status = 403;
    return { success: false };
  }

  const body = (await request.text()) || '';
  if (!body) {
    response!.status = 400;
    return { success: false };
  }

  const data: Array<{
    active: number;
    total: number;
    peak: number;
    peak_timestamp: number;
  }> = JSON.parse(`[${body.split('}{').join('},{')}]`);

  const active = Math.round(data.reduce((acc, curr) => acc + curr.active, 0) / data.length);
  const total = data[data.length - 1].total;
  const peak = data[data.length - 1].peak;
  const [year, month, day, hour, minute] =
    `${data[data.length - 1].peak_timestamp}`.match(/.{1,2}/g)?.flat() || [];
  const peakTime = getUnixTime(new Date(`20${year}-${month}-${day} ${hour}:${minute}`));
  const time = getUnixTime(new Date());

  const raw = await context.cloudflare.env.CACHE.get('p1');
  const values: Omit<P1Record, 'peak_timestamp'>[] = raw ? JSON.parse(raw) : [];

  const lastPush = fromUnixTime(values[values.length - 1]?.time ?? 0);
  if (differenceInMinutes(new Date(), lastPush) < 10) {
    response!.status = 429;
    return { success: false };
  }

  values.push({ active, total, time });

  // readings are every 10 minutes, so keep 24 hours worth of data
  if (values.length > (24 * 60) / 10) {
    values.shift();
  }

  await context.cloudflare.env.CACHE.put('p1', JSON.stringify(values));

  const rawHistory = await context.cloudflare.env.CACHE.get('p1-history');
  const history: P1HistoryRecord[] = rawHistory ? JSON.parse(rawHistory) : [];
  const lastHistoryRecord = history[history.length - 1];

  const yesterday = getUnixTime(endOfYesterday());

  if (
    // if there's no history yet
    !lastHistoryRecord ||
    // or the last entry is not yesterday
    yesterday !== lastHistoryRecord.time
  ) {
    history.push({
      total,
      peak,
      peakTime,
      time: yesterday,
    });

    await context.cloudflare.env.CACHE.put('p1-history', JSON.stringify(history));
  }

  return { success: true };
};
