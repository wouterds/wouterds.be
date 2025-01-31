import { Zap } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

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
