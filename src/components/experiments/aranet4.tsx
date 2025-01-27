import { Droplets, Gauge, Thermometer, Wind } from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    temperature: number;
    humidity: number;
    co2: number;
    pressure: number;
  };
};

export const Aranet4 = ({ data }: Props) => {
  return (
    <ExperimentCard title="Aranet4">
      <MetricItem
        icon={Thermometer}
        value={data?.temperature ?? '--'}
        unit={data?.temperature != null ? '°C' : ''}
      />
      <MetricItem
        icon={Droplets}
        value={data?.humidity ?? '--'}
        unit={data?.humidity != null ? '%' : ''}
      />
      <MetricItem icon={Wind} value={data?.co2 ?? '--'} unit={data?.co2 != null ? 'ppm' : ''} />
      <MetricItem
        icon={Gauge}
        value={data?.pressure ?? '--'}
        unit={data?.pressure != null ? 'hPa' : ''}
      />
    </ExperimentCard>
  );
};
