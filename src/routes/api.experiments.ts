import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { differenceInMinutes } from 'date-fns';

import { AranetRepository } from '~/data/repositories/aranet-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { Spotify, SpotifyTrack } from '~/lib/spotify';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tesla = TeslaRepository.create(context);
  const aranet = AranetRepository.create(context);
  const spotify = Spotify.create(context);

  await spotify.refreshAccessToken();

  let track: SpotifyTrack | null = await spotify.getCurrentlyPlaying();
  if (!track) {
    const recentlyPlayed = await spotify.getRecentlyPlayed(1)?.then((tracks) => tracks?.[0]);
    if (recentlyPlayed && differenceInMinutes(new Date(), recentlyPlayed.playedAt) <= 15) {
      track = recentlyPlayed;
    }
  }

  return json(
    {
      aranet: await aranet.getLast(),
      tesla: await tesla.getLast(),
      spotify: track,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};
