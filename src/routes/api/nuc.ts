import { differenceInMinutes } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import type { LoaderFunctionArgs } from 'react-router';

import { NUCReadings } from '~/database';

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.headers.get('authorization') !== process.env.API_AUTH_TOKEN) {
    return Response.json({ success: false }, { status: StatusCodes.FORBIDDEN });
  }

  const lastPush = await NUCReadings.getLast();
  if (lastPush && differenceInMinutes(new Date(), lastPush.createdAt) <= 1) {
    return Response.json({ success: false }, { status: StatusCodes.TOO_MANY_REQUESTS });
  }

  const data = await fetch('https://nuc.wouterds.com/api').then((res) => res.json());
  if (!data) {
    return Response.json({ success: false }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  await NUCReadings.add({
    cpuTemp: data.cpu_temp,
    cpuUsage: data.cpu,
    memoryUsage: data.memory,
    diskUsage: data.disk,
  });

  return Response.json({ success: true });
};
