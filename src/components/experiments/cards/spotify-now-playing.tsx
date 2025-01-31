import { Music } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data: {
    url: string;
    name: string;
    artist: Array<{
      name: string;
    }>;
  };
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

export const SpotifyNowPlaying = ({ data, onHoverIn, onHoverOut }: Props) => {
  return (
    <ExperimentCard title="Now Playing" onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MetricItem
              icon={Music}
              value={`${data.name} - ${data.artist[0].name}`}
              href={data.url}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Currently playing on Spotify</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ExperimentCard>
  );
};
