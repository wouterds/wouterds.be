import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Droplets,
  Gauge,
  Thermometer,
  Wind,
} from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    temperature: number;
    humidity: number;
    co2: number;
    pressure: number;
    battery: number;
  };
};

const getBatteryIcon = (percentage?: number) => {
  if (percentage == null) return Battery;
  if (percentage < 15) return Battery;
  if (percentage < 30) return BatteryLow;
  if (percentage < 70) return BatteryMedium;
  return BatteryFull;
};

export const Aranet4 = ({ data }: Props) => {
  return (
    <ExperimentCard title="Aranet4">
      <MetricItem icon={Thermometer} value={data?.temperature} unit="°C" />
      <MetricItem icon={Droplets} value={data?.humidity} unit="%" />
      <MetricItem icon={Wind} value={data?.co2} unit="ppm" />
      <MetricItem icon={Gauge} value={data?.pressure} unit="hPa" />
      <MetricItem icon={getBatteryIcon(data?.battery)} value={data?.battery} unit="%" />
    </ExperimentCard>
  );
};
