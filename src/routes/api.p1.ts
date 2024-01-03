import { ActionFunctionArgs, json } from '@remix-run/cloudflare';

export const action = async (args: ActionFunctionArgs) => {
  const request = args.request;
  const context = args.context as Context;

  const query = new URL(request.url).searchParams;
  if (query.get('token') !== context.env.API_AUTH_TOKEN) {
    return json({ success: false }, { status: 403 });
  }

  const body = (await request.text()) || '';
  const data = JSON.parse(`[${body.split('}{').join('},{')}]`);

  console.log(data);

  return json({ success: true, data });
};
