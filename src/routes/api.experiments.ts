import { json } from '@remix-run/node';
import { differenceInMinutes } from 'date-fns';

import { AranetReadings } from '~/database/aranet-readings/repository';
import { TeslaData } from '~/database/tesla-data/repository';
import { Spotify, SpotifyTrack } from '~/lib/spotify';

export const loader = async () => {
  const spotify = new Spotify();

  let track: SpotifyTrack | null = await spotify.getCurrentlyPlaying();
  if (!track) {
    const recentlyPlayed = await spotify.getRecentlyPlayed(1)?.then((tracks) => tracks?.[0]);
    if (recentlyPlayed && differenceInMinutes(new Date(), recentlyPlayed.playedAt) <= 15) {
      track = recentlyPlayed;
    }
  }

  return json(
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
