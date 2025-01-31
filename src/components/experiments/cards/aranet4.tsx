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

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Thermometer} value={data?.temperature} unit="°C" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Indoor temperature</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Droplets} value={data?.humidity} unit="%" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Relative humidity</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Wind} value={data?.co2} unit="ppm" />
          </TooltipTrigger>
          <TooltipContent>
            <p>CO₂ concentration</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Gauge} value={data?.pressure} unit="hPa" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Atmospheric pressure</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={getBatteryIcon(data?.battery)} value={data?.battery} unit="%" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Battery level</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ExperimentCard>
  );
};
