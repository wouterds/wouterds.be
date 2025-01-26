import clsx from 'clsx';
import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Car,
  Cpu,
  Droplets,
  Gauge,
  HardDrive,
  MemoryStick,
  Music,
  Thermometer,
  Wind,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

  const getBatteryIcon = (percentage: number) => {
    if (percentage >= 75) return <BatteryFull size={16} />;
    if (percentage >= 50) return <BatteryMedium size={16} />;
    if (percentage >= 25) return <BatteryLow size={16} />;
    return <Battery size={16} />;
  };

  const fetchData = async () => {
    const response = await fetch('/api/experiments');
    if (!response.ok) {
      return;
    }

    setData(await response.json());
  };

  useEffect(() => {
    fetchData();

    const timeout = setTimeout(fetchData, 10_000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={clsx(
        'mt-12 flex bg-gray-900 text-white w-full max-w-full px-0 sm:px-2 py-2 text-sm overflow-x-auto snap-x transition-opacity duration-300',
        {
          'opacity-100': !!data,
          'opacity-0': !data,
        },
      )}>
      {data && (
        <>
          <div className="flex flex-col gap-1 px-6 border-r border-gray-700 min-w-fit snap-start">
            <div className="text-gray-500 text-xs uppercase font-medium">Indoor Climate</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Thermometer size={16} />
                <span>{data.aranet.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets size={16} />
                <span>{data.aranet.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind size={16} />
                <span>{data.aranet.co2}ppm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gauge size={16} />
                <span>{data.aranet.pressure}hPa</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 px-6 border-r border-gray-700 min-w-fit snap-start">
            <div className="text-gray-500 text-xs uppercase font-medium">Car</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Car size={16} />
                <span>{Math.ceil(data.tesla.distance)}km</span>
              </div>
              <div className="flex items-center gap-1.5">
                {getBatteryIcon(data.tesla.battery)}
                <span>{data.tesla.battery}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-r border-gray-700 px-6 min-w-fit snap-start">
            <div className="text-gray-500 text-xs uppercase font-medium">Power</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Zap size={16} />
                <span>{data.p1.active}W</span>
              </div>
            </div>
          </div>

          <div
            className={clsx('flex flex-col gap-1 px-6 min-w-fit snap-start', {
              'border-r border-gray-700': !!data?.spotify,
            })}>
            <div className="text-gray-500 text-xs uppercase font-medium">NUC-Server</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Thermometer size={16} />
                <span>{data.nuc.cpuTemp}°C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu size={16} />
                <span>{data.nuc.cpuUsage}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MemoryStick size={16} />
                <span>{data.nuc.memoryUsage}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive size={16} />
                <span>{data.nuc.diskUsage}%</span>
              </div>
            </div>
          </div>

          {data.spotify && (
            <div className="flex flex-col gap-1 px-6 min-w-fit snap-start">
              <div className="text-gray-500 text-xs uppercase font-medium">Now Playing</div>
              <div className="flex items-center gap-1.5">
                <Music size={16} />
                <a href={data.spotify.url} target="_blank" rel="noopener noreferrer">
                  {data.spotify.name} - {data.spotify.artist[0].name}
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
