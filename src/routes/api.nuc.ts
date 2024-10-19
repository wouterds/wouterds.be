import { json, LoaderFunctionArgs } from '@remix-run/node';
import { differenceInMinutes } from 'date-fns';
import { StatusCodes } from 'http-status-codes';

import { NUCReadings } from '~/database/nuc/repository';

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.headers.get('authorization') !== process.env.API_AUTH_TOKEN) {
    return json({ success: false }, { status: StatusCodes.FORBIDDEN });
  }

  const lastPush = await NUCReadings.getLast();
  if (lastPush && differenceInMinutes(new Date(), lastPush.createdAt) < 1) {
    return json({ success: false }, { status: StatusCodes.TOO_MANY_REQUESTS });
  }

  const data = await fetch('https://nuc.wouterds.be/api').then((res) => res.json());
  if (!data) {
    return json({ success: false }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  await NUCReadings.add({
    cpuTemp: data.cpu_temp,
    cpuUsage: data.cpu,
    memoryUsage: data.memory,
    diskUsage: data.disk,
  });

  return json({ success: true });
};
