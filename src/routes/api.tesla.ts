import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { differenceInMinutes, fromUnixTime, getUnixTime } from 'date-fns';

import { Tesla } from '~/lib/tesla';

const SYNC_INTERVAL_MINUTES = 15; // 15 minutes
const WAKE_INTERVAL_MINUTES = 60 * 2; // 2 hours
const DRAIN_RATE_DAY = 1 / 100; // 1% per day
const DRAIN_RATE_MINUTES = DRAIN_RATE_DAY / 24 / 60;
const DRAIN_RATE_SYNC_INTERVAL = 1 - DRAIN_RATE_MINUTES * SYNC_INTERVAL_MINUTES;

type TeslaRecord = {
  name?: string;
  version?: string;
  battery?: number;
  distance?: number;
  time: number;
  wake: boolean;
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.cloudflare.env.API_AUTH_TOKEN) {
    return json({ error: 'unauthorized' }, { status: 403 });
  }

  const raw = await context.cloudflare.env.CACHE?.get?.('tesla');
  const values: TeslaRecord[] = raw ? JSON.parse(raw) : [];
  const last = values[values.length - 1];
  const awakeValues = values.filter((v) => v.wake);
  const lastAwake = awakeValues[awakeValues.length - 1];

  // synced not too long ago
  if (last && differenceInMinutes(new Date(), fromUnixTime(last.time)) < SYNC_INTERVAL_MINUTES) {
    return json(last);
  }

  // init & get auth token + refresh
  const tesla = await Tesla.fromContext(context).setVin('LRW3E7EKXMC324303').auth();

  // get data
  let data = await tesla.getData();

  if (
    (!lastAwake ||
      (lastAwake &&
        differenceInMinutes(new Date(), fromUnixTime(lastAwake.time)) > WAKE_INTERVAL_MINUTES)) &&
    data?.error?.includes('offline or asleep')
  ) {
    // try to wake
    await tesla.wakeUp();

    // then try again
    data = await tesla.getData();
  }

  let wake = false;
  if (data.response) {
    wake = true;
  }

  // still some other unknown error?
  if (data.error) return json(data.error, { status: 500 });

  // format & return data
  const batteryRaw = data?.response?.charge_state?.battery_level || 0;
  const battery = wake ? batteryRaw : batteryRaw * DRAIN_RATE_SYNC_INTERVAL;
  const distanceInMiles = data?.response?.vehicle_state?.odometer || 0;
  const distance = parseFloat((distanceInMiles * 1.60934).toFixed(3));
  const name = data?.response?.vehicle_state?.vehicle_name;
  const version = data?.response?.vehicle_state?.car_version;
  const time = getUnixTime(new Date());

  // store in KV
  values.push({ name, version, battery, distance, time, wake });
  await context.cloudflare.env.CACHE?.put?.('tesla', JSON.stringify(values));

  return json({ name, version, battery, distance, time, wake });
};
