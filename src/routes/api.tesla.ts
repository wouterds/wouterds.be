import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';

import { Tesla } from '~/lib/tesla';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // init & get auth token + refresh
  const tesla = await Tesla.fromContext(context).setVin('LRW3E7EKXMC324303').auth();

  // get data
  let data = await tesla.getData();

  // sleeping?
  if (data?.error?.includes('offline or asleep')) {
    // try to wake
    await tesla.wakeUp();

    // then try again
    data = await tesla.getData();
  }

  // still some other unknown error?
  if (data.error) return json(data.error, { status: 500 });

  // format & return data
  const battery = data?.response?.charge_state?.battery_level || 0;
  const distanceInMiles = data?.response?.vehicle_state?.odometer || 0;
  const distance = parseFloat((distanceInMiles * 1.60934).toFixed(3));
  const name = data?.response?.vehicle_state?.vehicle_name;
  const version = data?.response?.vehicle_state?.car_version;
  const time = Math.round(new Date().getTime() / 1000);

  return json({ name, version, battery, distance, time });
};
