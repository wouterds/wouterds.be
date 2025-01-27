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
};

export const SpotifyNowPlaying = ({ data }: Props) => {
  return (
    <ExperimentCard title="Now Playing">
      <MetricItem icon={Music} value={`${data.name} - ${data.artist[0].name}`} href={data.url} />
    </ExperimentCard>
  );
};
