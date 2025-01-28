import { Battery, BatteryFull, BatteryLow, BatteryMedium, Car, Thermometer } from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    battery: number;
    distance: number;
    temperatureInside: number;
    temperatureOutside: number;
  };
};

const getBatteryIcon = (percentage?: number) => {
  if (percentage == null) return Battery;
  if (percentage < 15) return Battery;
  if (percentage < 30) return BatteryLow;
  if (percentage < 70) return BatteryMedium;
  return BatteryFull;
};

export const Tesla = ({ data }: Props) => {
  return (
    <ExperimentCard title="Car">
      <MetricItem
        icon={Car}
        value={data?.distance ? Math.ceil(data.distance) : undefined}
        unit="km"
      />
      <MetricItem icon={Thermometer} value={data?.temperatureInside} unit="°C" />
      <MetricItem icon={getBatteryIcon(data?.battery)} value={data?.battery} unit="%" />
    </ExperimentCard>
  );
};
