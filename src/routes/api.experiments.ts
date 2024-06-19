import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { subMinutes } from 'date-fns';

import { AranetRepository } from '~/data/repositories/aranet-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { Spotify } from '~/lib/spotify';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tesla = TeslaRepository.create(context);
  const aranet = AranetRepository.create(context);
  const spotify = Spotify.create(context);

  const [lastSong, recentlyPlayed] = await Promise.all([
    spotify.getCurrentlyPlaying().catch(() => null),
    spotify
      .getRecentlyPlayed(1, subMinutes(new Date(), 5))
      .then((tracks) => tracks?.[0])
      .catch(() => null),
  ]);

  return json(
    {
      aranet: await aranet.getLast(),
      tesla: await tesla.getLast(),
      spotify: lastSong || recentlyPlayed || null,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, must-revalidate',
      },
    },
  );
};
