import { differenceInMinutes } from 'date-fns';

import { AranetReadings, NUCReadings, P1Readings, TeslaData } from '~/database';
import { Spotify } from '~/lib/spotify.server';

export const loader = async () => {
  const [aranet, tesla, p1, nuc, spotify] = await Promise.all([
    AranetReadings.getLast(),
    TeslaData.getLast(),
    P1Readings.getLast(),
    NUCReadings.getLast(),
    getLastSpotifyTrack(),
  ]);

  return Response.json(
    { aranet, tesla, p1, nuc, spotify },
    { headers: { 'Access-Control-Allow-Origin': '*' } },
  );
};

const getLastSpotifyTrack = async () => {
  const spotify = new Spotify();

  let track = await spotify.getCurrentlyPlaying();
  if (!track) {
    const recentlyPlayed = await spotify.getRecentlyPlayed(1)?.then((tracks) => tracks?.[0]);
    if (recentlyPlayed && differenceInMinutes(new Date(), recentlyPlayed.playedAt) <= 15) {
      track = recentlyPlayed;
    }
  }

  return track;
};
