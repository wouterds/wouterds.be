import { useEffect, useState } from 'react';

import { Aranet4 } from './aranet4';
import { NUC } from './nuc';
import { Power } from './power';
import { SpotifyNowPlaying } from './spotify-now-playing';
import { Tesla } from './tesla';

type Data = {
  aranet: {
    temperature: number;
    humidity: number;
    co2: number;
    pressure: number;
    battery: number;
  };
  tesla: {
    battery: number;
    distance: number;
    temperatureInside: number;
    temperatureOutside: number;
  };
  p1: {
    active: number;
    peak: number;
  };
  nuc: {
    cpuTemp: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  spotify: {
    url: string;
    explicit: boolean;
    name: string;
    artist: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    playedAt: number;
  };
};

export const Experiments = () => {
  const [data, setData] = useState<Data | null>(null);

  const fetchData = async () => {
    const response = await fetch('/api/experiments');
    if (!response.ok) {
      return;
    }

    setData(await response.json());
  };

  useEffect(() => {
    fetchData();
    const timeout = setInterval(fetchData, 5000);
    return () => clearInterval(timeout);
  }, []);

  return (
    <div className="mt-12 flex flex-nowrap whitespace-nowrap text-nowrap bg-gradient-to-b from-gray-100 to-white text-gray-800 min-w-full px-3 sm:px-5 py-2 text-sm overflow-x-auto border-t border-gray-200">
      <Aranet4 data={data?.aranet} />
      <Tesla data={data?.tesla} />
      <Power data={data?.p1} />
      <NUC data={data?.nuc} />
      {data?.spotify && <SpotifyNowPlaying data={data.spotify} />}
    </div>
  );
};
