import { useLoaderData } from '@remix-run/react';
import { formatDistanceToNowStrict } from 'date-fns';

import { LineChart } from '~/components/charts/line-chart';
import { useTick } from '~/hooks/use-tick';

import { loader } from './route';

export const EnergyCharts = () => {
  useTick('1 second');

  const { p1AveragesLast24h, lastP1Reading } = useLoaderData<typeof loader>();
  if (!p1AveragesLast24h?.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Energy usage</h2>

      <LineChart
        data={p1AveragesLast24h}
        dataKey="active"
        unit=" Wh"
        rounding={0}
        header={`${p1AveragesLast24h[p1AveragesLast24h.length - 1].active} Wh`}
        label="power usage (last 24 hours)"
      />
      {!!lastP1Reading && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          <span>
            last updated: {formatDistanceToNowStrict(lastP1Reading.createdAt, { addSuffix: true })}
          </span>
        </p>
      )}
    </div>
  );
};
