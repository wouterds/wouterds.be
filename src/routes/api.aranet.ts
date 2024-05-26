import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { differenceInMinutes } from 'date-fns';

import { AranetRepository } from '~/lib/repositories/aranet-repository';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.cloudflare.env.API_AUTH_TOKEN) {
    return json({ success: false }, { status: 403 });
  }

  if (differenceInMinutes(new Date(), await AranetRepository.create(context).getLastPush()) < 5) {
    return json({ success: false }, { status: 429 });
  }

  const data = await request.formData();
  await AranetRepository.create(context).add({
    time: parseInt(data.get('time') as string),
    co2: parseInt(data.get('co2') as string),
    temperature: parseFloat(data.get('temperature') as string),
    humidity: parseFloat(data.get('humidity') as string),
    pressure: parseFloat(data.get('pressure') as string),
    battery: parseInt(data.get('battery') as string),
  });

  return json({ success: true }, { status: 201 });
};
