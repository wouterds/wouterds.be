import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import {
  differenceInMinutes,
  endOfYesterday,
  fromUnixTime,
  getDayOfYear,
  getUnixTime,
} from 'date-fns';

export const action = async (args: ActionFunctionArgs) => {
  const request = args.request;
  const context = args.context as Context;

  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.env.API_AUTH_TOKEN) {
    return json({ success: false }, { status: 403 });
  }

  const body = (await request.text()) || '';
  const data: Array<{
    active: number;
    total: number;
    peak: number;
    peak_timestamp: number;
  }> = JSON.parse(`[${body.split('}{').join('},{')}]`);

  const active = data.reduce((acc, curr) => acc + curr.active, 0) / data.length;
  const total = data[data.length - 1].total;
  // const peak = data[data.length - 1].peak;
  // const peakTime = getUnixTime(new Date(data[data.length - 1].peak_timestamp));
  const time = getUnixTime(new Date());

  const raw = await context.env.WOUTERDSBE.get('p1');
  const values: P1Record[] = raw ? JSON.parse(raw) : [];

  const lastPush = fromUnixTime(values[values.length - 1]?.time ?? 0);
  if (differenceInMinutes(new Date(), lastPush) < 5) {
    return json({ success: false }, { status: 429 });
  }

  values.push({ active, total, time });

  // readings are every 5 minutes, so keep 24 hours worth of data
  if (values.length > (24 * 60) / 5) {
    values.shift();
  }

  await context.env.WOUTERDSBE.put('p1', JSON.stringify(values));

  const rawHistory = await context.env.WOUTERDSBE.get('p1-history');
  const history: P1HistoryRecord[] = rawHistory ? JSON.parse(rawHistory) : [];
  const lastHistoryRecord = history[history.length - 1];

  if (
    !lastHistoryRecord ||
    getDayOfYear(endOfYesterday()) !==
      getDayOfYear(fromUnixTime(lastHistoryRecord.time * 1000))
  ) {
    history.push({
      total,
      peak: total,
      peakTime: time,
      time,
    });

    await context.env.WOUTERDSBE.put('p1-history', JSON.stringify(history));
  }

  return json({ success: true });
};
