import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { differenceInMinutes, fromUnixTime, getUnixTime } from 'date-fns';

import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { Tesla } from '~/lib/tesla';

const SYNC_INTERVAL_MINUTES = 15; // 15 minutes
const WAKE_INTERVAL_MINUTES = 60 * 2; // 2 hours
const VIN = 'LRW3E7EKXMC324303';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const last = await TeslaRepository.create(context).getLast();
  if (differenceInMinutes(new Date(), fromUnixTime(last?.time || 0)) < SYNC_INTERVAL_MINUTES) {
    return json(last, { status: 429 });
  }

  const tesla = await Tesla.create(context).setVin(VIN).auth();

  let data = await tesla.getData();
  const isSleeping = data?.error?.includes('offline or asleep');
  const lastAwake = fromUnixTime((await TeslaRepository.create(context).getLastAwake())?.time || 0);
  if (isSleeping && differenceInMinutes(new Date(), lastAwake) > WAKE_INTERVAL_MINUTES) {
    await tesla.wakeUp();
    data = await tesla.getData();

    if (data.error) {
      return json(data.error, { status: 500 });
    }
  }

  const response = data?.response;
  const record = await TeslaRepository.create(context).add({
    battery: (response?.charge_state?.battery_level || last?.battery) as number,
    distance: parseFloat(
      (((response?.vehicle_state?.odometer || 0) * 1.60934 || last?.distance) as number).toFixed(3),
    ),
    time: getUnixTime(new Date()),
    wake: !!response,
  });

  return json(record);
};
