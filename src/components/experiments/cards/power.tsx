import { Zap } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Zap} value={data?.active} unit="W" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Active power consumption</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ExperimentCard>
  );
};
