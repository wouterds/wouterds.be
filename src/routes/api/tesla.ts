import { differenceInMinutes } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import type { LoaderFunctionArgs } from 'react-router';

import { TeslaData } from '~/database/tesla-data/repository.server';
import { Tesla } from '~/lib/tesla.server';

const SYNC_INTERVAL_MINUTES = 15; // 15 minutes
const WAKE_INTERVAL_MINUTES = 60 * 2; // 2 hours
const VIN = process.env.TESLA_VIN!;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.headers.get('authorization') !== process.env.API_AUTH_TOKEN) {
    return Response.json({ success: false }, { status: StatusCodes.FORBIDDEN });
  }

  const last = await TeslaData.getLast();
  if (last && differenceInMinutes(new Date(), last.createdAt) < SYNC_INTERVAL_MINUTES) {
    return Response.json(last, { status: StatusCodes.TOO_MANY_REQUESTS });
  }

  const tesla = new Tesla().setVin(VIN);

  let data = await tesla.getData();
  const isSleeping = data?.error?.includes('offline or asleep');
  const lastAwake = (await TeslaData.getLastAwake()).createdAt || new Date(0);
  if (isSleeping && differenceInMinutes(new Date(), lastAwake) > WAKE_INTERVAL_MINUTES) {
    await tesla.wakeUp();
    data = await tesla.getData();

    if (data.error) {
      return Response.json(data.error, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  const response = data?.response;
  const record = await TeslaData.add({
    battery: (response?.charge_state?.battery_level || last?.battery) as number,
    distance: parseFloat(
      (((response?.vehicle_state?.odometer || 0) * 1.60934 || last?.distance) as number).toFixed(3),
    ),
    temperatureInside: response?.climate_state?.inside_temp || last?.temperatureInside,
    temperatureOutside: response?.climate_state?.outside_temp || last?.temperatureOutside,
    wake: !!response,
  });

  return Response.json(record, { status: StatusCodes.CREATED });
};
