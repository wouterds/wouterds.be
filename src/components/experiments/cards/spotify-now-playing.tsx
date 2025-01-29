import { Music } from 'lucide-react';

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
      <MetricItem icon={Music} value={`${data.name} - ${data.artist[0].name}`} href={data.url} />
    </ExperimentCard>
  );
};
