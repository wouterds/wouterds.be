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
    <div
      aria-hidden
      className="items-center gap-2 pb-2 text-zinc-400 dark:text-zinc-500 hidden md:flex"
      title="Yo, this is what I'm listening to right now ツ">
      <span className="inline-flex overflow-hidden h-4 items-center gap-1.5">
        <style type="text/css">{`
          .sound-bars {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 13px;
            height: 12px;
            margin-top: -2px;
          }

          .sound-bars span {
            width: 3px;
            height: 100%;
            border-radius: 2px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            transform-origin: bottom;
            animation: bounce 2.2s ease infinite alternate;
            content: '';
          }

          .sound-bars span:nth-of-type(2) {
            animation-delay: -2.2s;
          }

          .sound-bars span:nth-of-type(3) {
            animation-delay: -3.7s;
          }

          @keyframes bounce {
            10% { transform: scaleY(0.3); }
            30% { transform: scaleY(1); }
            60% { transform: scaleY(0.5); }
            80% { transform: scaleY(0.75); }
            100% { transform: scaleY(0.6); }
          }
        `}</style>
        <span className="sound-bars mr-0.5">
          <span className="bg-zinc-400 dark:bg-zinc-500" />
          <span className="bg-zinc-400 dark:bg-zinc-500" />
          <span className="bg-zinc-400 dark:bg-zinc-500" />
        </span>
        {nowPlaying.explicit && <span className="font-sans text-lg leading-none">🅴</span>}
        {nowPlaying.name}
      </span>
      {' - '}
      {nowPlaying.artist.map((artist, index) => (
        <Fragment key={artist.id}>
          {artist.name}
          {index < nowPlaying.artist.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
    </div>
  );
};
