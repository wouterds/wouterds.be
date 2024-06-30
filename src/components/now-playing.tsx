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

  useInterval(fetchNowPlaying, 5_000);

  useEffect(() => {
    fetchNowPlaying();
  }, [fetchNowPlaying]);

  if (!nowPlaying) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="flex items-center gap-2 pb-2 text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-nowrap flex-nowrap w-full group relative cursor-pointer">
      <span className="inline-flex h-4 items-center gap-1.5 shrink-0">
        <style type="text/css">{`
          .sound-bars {
            position: relative;
            display: flex;
            justify-content: space-between;
            height: 12px;
            margin-top: -1px;
            gap: 1.5px;
          }

          .sound-bars span {
            width: 2.5px;
            height: 100%;
            transform-origin: bottom;
            animation: bounce 2.5s ease infinite alternate;
            content: '';
          }

          .sound-bars span:nth-of-type(2) {
            animation-delay: -2.2s;
          }

          .sound-bars span:nth-of-type(3) {
            animation-delay: -3.7s;
          }

          .sound-bars span:nth-of-type(4) {
            animation-delay: -5.2s;
          }

          @keyframes bounce {
            10% { transform: scaleY(0.3); }
            30% { transform: scaleY(1); }
            60% { transform: scaleY(0.5); }
            80% { transform: scaleY(0.75); }
            100% { transform: scaleY(0.6); }
          }
        `}</style>
        <span className="sound-bars mr-0.5 shrink-0">
          <span className="bg-zinc-400 dark:bg-zinc-500 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400" />
          <span className="bg-zinc-400 dark:bg-zinc-500 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400" />
          <span className="bg-zinc-400 dark:bg-zinc-500 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400" />
          {/* <span className="bg-zinc-400 dark:bg-zinc-500 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400" /> */}
        </span>
        {nowPlaying.explicit && <span className="font-sans text-lg leading-none">🅴</span>}
        {nowPlaying.name}
      </span>
      {' - '}
      <span className="truncate block">
        {nowPlaying.artist.map((artist, index) => (
          <Fragment key={artist.id}>
            {artist.name}
            {index < nowPlaying.artist.length - 1 ? ', ' : ''}
          </Fragment>
        ))}
      </span>
      <div className="absolute left-0 top-1.5 pt-4 z-10 hidden group-hover:block">
        <div className="bg-black/90 rounded p-3 text-xs text-white leading-relaxed relative cursor-auto">
          <div className="absolute w-0 h-0 border-4 border-transparent border-b-black/90 -top-2 left-2" />
          <p>
            Yo, this is what I&apos;m listening to right now ツ<br />
            <a
              href={nowPlaying.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-emerald-400 hover:bg-transparent">
              {nowPlaying.url}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
