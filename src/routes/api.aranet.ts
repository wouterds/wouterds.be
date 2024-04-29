import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { differenceInMinutes, fromUnixTime } from 'date-fns';

import { AranetRecord } from '~/lib/kv';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.env.API_AUTH_TOKEN) {
    return json({ success: false }, { status: 403 });
  }

  const raw = await context.env.WOUTERDSBE.get('aranet');

  const values: AranetRecord[] = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(values)) {
    return json({ success: false }, { status: 500 });
  }

  const lastPush = fromUnixTime(values[values.length - 1]?.time ?? 0);
  if (differenceInMinutes(new Date(), lastPush) < 5) {
    return json({ success: false }, { status: 429 });
  }

  const data = await request.formData();
  const time = parseInt(data.get('time') as string);
  const co2 = parseInt(data.get('co2') as string);
  const temperature = parseFloat(data.get('temperature') as string);
  const humidity = parseFloat(data.get('humidity') as string);
  const pressure = parseFloat(data.get('pressure') as string);
  const battery = parseInt(data.get('battery') as string);

  values.push({
    time,
    co2,
    temperature,
    humidity,
    pressure,
    battery,
  });

  // readings are every 5 minutes, so keep 24 hours worth of data
  if (values.length > (24 * 60) / 5) {
    values.shift();
  }

  await context.env.WOUTERDSBE.put('aranet', JSON.stringify(values));

  return json({ success: true });
};
