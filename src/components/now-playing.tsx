import { Fragment, useCallback, useEffect, useState } from 'react';

import { useInterval } from '~/hooks/use-interval';
import { SpotifyTrack } from '~/lib/spotify';

export const NowPlaying = () => {
  const [nowPlaying, setNowPlaying] = useState<SpotifyTrack | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    const response = await fetch('/api/experiments');
    if (!response.ok) {
      return;
    }

    const data = await response.json<{ spotify: SpotifyTrack | null }>();
    setNowPlaying(data.spotify);
  }, []);

  useInterval(fetchNowPlaying, 10_000);

  useEffect(() => {
    fetchNowPlaying();
  }, [fetchNowPlaying]);

  if (!nowPlaying) {
    return null;
  }

  return (
    <div aria-hidden className="border-t border-dashed border-zinc-900 dark:border-zinc-100 py-3">
      <span className="font-medium">Now playing: </span>
      <div className="inline-flex items-center relative">
        <a key={nowPlaying.id} href={nowPlaying.url} target="_blank" rel="noreferrer">
          {nowPlaying.name}
        </a>
        {nowPlaying.explicit && (
          <span className="inline-flex font-sans text-lg leading-none ml-1 items-center justify-center max-h-4">
            🅴
          </span>
        )}
      </div>{' '}
      -{' '}
      {nowPlaying.artist.map((artist, index) => (
        <Fragment key={artist.id}>
          <a target="_blank" rel="noreferrer" href={artist.url}>
            {artist.name}
          </a>
          {index < nowPlaying.artist.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
    </div>
  );
};
