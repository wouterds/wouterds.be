import { ActionFunctionArgs, json } from '@remix-run/cloudflare';

// TODO: add some form of protection

export const action = async (args: ActionFunctionArgs) => {
  const request = args.request;
  const context = args.context as Context;

  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.env.ARANET_AUTH_TOKEN) {
    return json({ success: false }, { status: 403 });
  }

  const raw = await context.env.WOUTERDSBE.get('aranet');

  const values: AranetRecord[] = raw ? JSON.parse(raw) : [];

  if (!Array.isArray(values)) {
    return json({ success: false }, { status: 500 });
  }

  const data = await request.formData();
  const time = parseInt(data.get('time') as string);
  const co2 = parseInt(data.get('co2') as string);
  const temperature = parseFloat(data.get('temperature') as string);
  const humidity = parseFloat(data.get('humidity') as string);
  const pressure = parseFloat(data.get('pressure') as string);
  const battery = parseInt(data.get('battery') as string);

  values.push({
    time,
    co2,
    temperature,
    humidity,
    pressure,
    battery,
  });

  // readings are every 2 minutes, so keep 24 hours worth of data
  if (values.length > (24 * 60) / 2) {
    values.shift();
  }

  await context.env.WOUTERDSBE.put('aranet', JSON.stringify(values));

  return json({ success: true });
};
