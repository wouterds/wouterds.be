import { Zap } from 'lucide-react';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    active: number;
    peak: number;
  };
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

export const Power = ({ data, onHoverIn, onHoverOut }: Props) => {
  return (
    <ExperimentCard title="Power" onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
      <MetricItem icon={Zap} value={data?.active} unit="W" />
    </ExperimentCard>
  );
};
