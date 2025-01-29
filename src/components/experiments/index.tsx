import { useEffect, useState } from 'react';

import { Aranet4 } from './cards/aranet4';
import { NUC } from './cards/nuc';
import { Power } from './cards/power';
import { SpotifyNowPlaying } from './cards/spotify-now-playing';
import { Tesla } from './cards/tesla';
import { Aranet4Charts } from './charts/aranet4-charts';
import { NUCCharts } from './charts/nuc-charts';
import { PowerCharts } from './charts/power-charts';
import { TeslaCharts } from './charts/tesla-charts';

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
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

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
    <div className="mt-12 text-gray-800">
      {activeExperiment === 'aranet' && <Aranet4Charts />}
      {activeExperiment === 'tesla' && <TeslaCharts />}
      {activeExperiment === 'p1' && <PowerCharts />}
      {activeExperiment === 'nuc' && <NUCCharts />}

      <div className="flex flex-nowrap whitespace-nowrap text-nowrap bg-gradient-to-b from-gray-100 to-white min-w-full px-3 sm:px-5 py-2 text-sm overflow-x-auto border-t border-gray-200">
        <div
          onMouseEnter={() => setActiveExperiment('aranet')}
          onMouseLeave={() => setActiveExperiment(null)}>
          <Aranet4 data={data?.aranet} />
        </div>
        <div
          onMouseEnter={() => setActiveExperiment('tesla')}
          onMouseLeave={() => setActiveExperiment(null)}>
          <Tesla data={data?.tesla} />
        </div>
        <div
          onMouseEnter={() => setActiveExperiment('p1')}
          onMouseLeave={() => setActiveExperiment(null)}>
          <Power data={data?.p1} />
        </div>
        <div
          onMouseEnter={() => setActiveExperiment('nuc')}
          onMouseLeave={() => setActiveExperiment(null)}>
          <NUC data={data?.nuc} />
        </div>
        {data?.spotify && (
          <div
            onMouseEnter={() => setActiveExperiment('spotify')}
            onMouseLeave={() => setActiveExperiment(null)}>
            <SpotifyNowPlaying data={data.spotify} />
          </div>
        )}
      </div>
    </div>
  );
};
