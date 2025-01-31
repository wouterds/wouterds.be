import { Cpu, HardDrive, MemoryStick, Thermometer } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Thermometer} value={data?.cpuTemp} unit="°C" />
          </TooltipTrigger>
          <TooltipContent>
            <p>CPU temperature</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Cpu} value={data?.cpuUsage} unit="%" />
          </TooltipTrigger>
          <TooltipContent>
            <p>CPU usage</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={MemoryStick} value={data?.memoryUsage} unit="%" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Memory usage</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={HardDrive} value={data?.diskUsage} unit="%" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Disk usage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ExperimentCard>
  );
};
