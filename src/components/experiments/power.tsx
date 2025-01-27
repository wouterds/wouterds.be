import { Zap } from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    active: number;
    peak: number;
  };
};

export const Power = ({ data }: Props) => {
  return (
    <ExperimentCard title="Power">
      <MetricItem icon={Zap} value={data?.active} unit="W" />
    </ExperimentCard>
  );
};
