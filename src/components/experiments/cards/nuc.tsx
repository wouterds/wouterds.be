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
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

export const NUC = ({ data, onHoverIn, onHoverOut }: Props) => {
  return (
    <ExperimentCard title="NUC" onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
      <MetricItem icon={Thermometer} value={data?.cpuTemp} unit="°C" />
      <MetricItem icon={Cpu} value={data?.cpuUsage} unit="%" />
      <MetricItem icon={MemoryStick} value={data?.memoryUsage} unit="%" />
      <MetricItem icon={HardDrive} value={data?.diskUsage} unit="%" />
    </ExperimentCard>
  );
};
