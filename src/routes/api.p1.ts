import { ActionFunctionArgs, json } from '@remix-run/node';
import { differenceInMinutes } from 'date-fns';
import { StatusCodes } from 'http-status-codes';

import { P1Readings } from '~/database/p1-readings/repository';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.headers.get('authorization') !== process.env.API_AUTH_TOKEN) {
    return json({ success: false }, { status: StatusCodes.FORBIDDEN });
  }

  const data = await request.json().catch(() => null);
  if (!data) {
    return json({ success: false }, { status: StatusCodes.BAD_REQUEST });
  }

  const lastPush = await P1Readings.getLast();
  if (lastPush && differenceInMinutes(new Date(), lastPush.createdAt) < 1) {
    return json({ success: false }, { status: StatusCodes.TOO_MANY_REQUESTS });
  }

  const active = data.active_power_w;
  const total = data.total_power_import_kwh;
  const peak = data.montly_power_peak_w;
  const time = `${data.montly_power_peak_timestamp}`.match(/.{1,2}/g)?.flat() || [];
  if (time?.length < 5) {
    return json({ success: false }, { status: StatusCodes.BAD_REQUEST });
  }
  const peakedAt = new Date(`20${time[0]}-${time[1]}-${time[2]} ${time[3]}:${time[4]}`);

  await P1Readings.add({
    active,
    total,
    peak,
    peakedAt,
  });

  return { success: true };
};
