import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';

import { Spotify } from '~/lib/spotify';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const redirectUri = `${url.protocol}//${url.host}${url.pathname}`;
  const searchParams = new URLSearchParams(url.search);

  const spotify = Spotify.create(context);

  const code = searchParams.get('code');
  if (!code) {
    return redirect(spotify.authorizeUrl(redirectUri));
  }

  await spotify.authorize(code, redirectUri);
  const user = await spotify.getMe();
  if (user.id !== 'wouterds') {
    return json({ error: 'You are not allowed to access this application' }, { status: 403 });
  }

  await spotify.storeTokens();

  return json({ message: 'Authorized Spotify' });
};
