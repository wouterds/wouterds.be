import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { differenceInMinutes, fromUnixTime, getUnixTime } from 'date-fns';

import { TeslaRecord } from '~/lib/kv';
import { Tesla } from '~/lib/tesla';

const SYNC_INTERVAL_MINUTES = 15; // 15 minutes
const WAKE_INTERVAL_MINUTES = 60 * 2; // 2 hours

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const raw = await context.cloudflare.env.CACHE?.get?.('tesla');
  const values: TeslaRecord[] = raw ? JSON.parse(raw) : [];
  const last = values[values.length - 1];
  const awakeValues = values.filter((v) => v.wake);
  const lastAwake = awakeValues[awakeValues.length - 1];

  // synced not too long ago
  if (last && differenceInMinutes(new Date(), fromUnixTime(last.time)) < SYNC_INTERVAL_MINUTES) {
    return json(last, { status: 429 });
  }

  // init & get auth token + refresh
  const tesla = await Tesla.create(context).setVin('LRW3E7EKXMC324303').auth();

  // get data
  let data = await tesla.getData();
  let woken = false;

  if (
    // never woken up yet
    (!lastAwake ||
      // last woken up has been some time ago
      (lastAwake &&
        differenceInMinutes(new Date(), fromUnixTime(lastAwake.time)) > WAKE_INTERVAL_MINUTES)) &&
    // and asleep right now
    data?.error?.includes('offline or asleep')
  ) {
    // try to wake
    await tesla.wakeUp();
    woken = true;

    // then try to fetch data again
    data = await tesla.getData();

    // still some other unknown error?
    if (data.error) return json(data.error, { status: 500 });
  }

  const record: TeslaRecord = {
    name: data?.response?.vehicle_state?.vehicle_name || last?.name,
    version: data?.response?.vehicle_state?.car_version || last?.version,
    battery: data?.response?.charge_state?.battery_level || last?.battery || 0,
    distance: parseFloat(
      ((data?.response?.vehicle_state?.odometer || 0) * 1.60934 || last?.distance || 0).toFixed(3),
    ),
    time: getUnixTime(new Date()),
    wake: !!data.response,
    woken,
  };

  // store in KV
  values.push(record);
  await context.cloudflare.env.CACHE?.put?.('tesla', JSON.stringify(values));

  return json(record);
};
