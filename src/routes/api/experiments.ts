import { differenceInMinutes } from 'date-fns';

import { AranetReadings, TeslaData } from '~/database';
import { Spotify } from '~/lib/spotify.server';

export const loader = async () => {
  const spotify = new Spotify();

  let track = await spotify.getCurrentlyPlaying();
  if (!track) {
    const recentlyPlayed = await spotify.getRecentlyPlayed(1)?.then((tracks) => tracks?.[0]);
    if (recentlyPlayed && differenceInMinutes(new Date(), recentlyPlayed.playedAt) <= 15) {
      track = recentlyPlayed;
    }
  }

  return Response.json(
    {
      aranet: await AranetReadings.getLast(),
      tesla: await TeslaData.getLast(),
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
