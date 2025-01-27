import { Cpu, HardDrive, MemoryStick, Thermometer } from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    cpuTemp: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
};

export const NucServer = ({ data }: Props) => {
  return (
    <ExperimentCard title="Server">
      <MetricItem
        icon={Thermometer}
        value={data?.cpuTemp ?? '--'}
        unit={data?.cpuTemp != null ? '°C' : ''}
      />
      <MetricItem
        icon={Cpu}
        value={data?.cpuUsage ?? '--'}
        unit={data?.cpuUsage != null ? '%' : ''}
      />
      <MetricItem
        icon={MemoryStick}
        value={data?.memoryUsage ?? '--'}
        unit={data?.memoryUsage != null ? '%' : ''}
      />
      <MetricItem
        icon={HardDrive}
        value={data?.diskUsage ?? '--'}
        unit={data?.diskUsage != null ? '%' : ''}
      />
    </ExperimentCard>
  );
};
