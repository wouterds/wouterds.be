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

export const NUC = ({ data }: Props) => {
  return (
    <ExperimentCard title="Server">
      <MetricItem icon={Thermometer} value={data?.cpuTemp} unit="°C" />
      <MetricItem icon={Cpu} value={data?.cpuUsage} unit="%" />
      <MetricItem icon={MemoryStick} value={data?.memoryUsage} unit="%" />
      <MetricItem icon={HardDrive} value={data?.diskUsage} unit="%" />
    </ExperimentCard>
  );
};
