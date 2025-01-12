import { differenceInMinutes, fromUnixTime } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import type { ActionFunctionArgs } from 'react-router';

import { AranetReadings } from '~/database';

export const action = async ({ request }: ActionFunctionArgs) => {
  const query = new URL(request.url).searchParams;
  if (query.get('token') !== process.env.API_AUTH_TOKEN) {
    return Response.json({ success: false }, { status: StatusCodes.FORBIDDEN });
  }

  const lastPush = await AranetReadings.getLast();
  if (differenceInMinutes(new Date(), lastPush?.createdAt || new Date()) < 5) {
    return Response.json({ success: false }, { status: StatusCodes.TOO_MANY_REQUESTS });
  }

  const data = await request.formData();
  await AranetReadings.add({
    createdAt: fromUnixTime(parseInt(data.get('time') as string)),
    co2: parseInt(data.get('co2') as string),
    temperature: parseFloat(data.get('temperature') as string),
    humidity: parseFloat(data.get('humidity') as string),
    pressure: parseFloat(data.get('pressure') as string),
    battery: parseInt(data.get('battery') as string),
  });

  return Response.json({ success: true }, { status: StatusCodes.CREATED });
};
