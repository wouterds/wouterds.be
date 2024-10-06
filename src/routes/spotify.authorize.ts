import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { Spotify } from '~/lib/spotify';

const redirectUri = 'https://wouterds.be/spotify/authorize';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const spotify = new Spotify();

  const code = new URLSearchParams(new URL(request.url).search).get('code');
  if (!code) {
    throw redirect(spotify.authorizeUrl(redirectUri));
  }

  await spotify.authorize(code, redirectUri, { noStore: true });
  const user = await spotify.getMe();
  if (user.id !== 'wouterds') {
    throw new Response(getReasonPhrase(StatusCodes.FORBIDDEN), { status: StatusCodes.FORBIDDEN });
  }

  return new Response(getReasonPhrase(StatusCodes.OK), { status: StatusCodes.OK });
};
