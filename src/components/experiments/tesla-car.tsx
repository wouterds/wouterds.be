import { Battery, BatteryFull, BatteryLow, BatteryMedium, Car } from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    battery: number;
    distance: number;
  };
};

export const TeslaCar = ({ data }: Props) => {
  const getBatteryIcon = (percentage?: number) => {
    if (percentage == null) return Battery;
    if (percentage < 15) return Battery;
    if (percentage < 30) return BatteryLow;
    if (percentage < 70) return BatteryMedium;
    return BatteryFull;
  };

  return (
    <ExperimentCard title="Car">
      <MetricItem
        icon={Car}
        value={data?.distance ? Math.ceil(data.distance) : '--'}
        unit={data?.distance != null ? 'km' : ''}
      />
      <MetricItem
        icon={getBatteryIcon(data?.battery)}
        value={data?.battery ?? '--'}
        unit={data?.battery != null ? '%' : ''}
      />
    </ExperimentCard>
  );
};
