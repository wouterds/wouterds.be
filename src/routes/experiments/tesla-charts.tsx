import { useLoaderData } from '@remix-run/react';
import { format, formatDistanceToNowStrict } from 'date-fns';

import { LineChart } from '~/components/charts/line-chart';
import { useTick } from '~/hooks/use-tick';

import { loader } from './route';

export const TeslaCharts = () => {
  useTick('1 second');

  const { teslaLast24h, lastTeslaCharged } = useLoaderData<typeof loader>();

  const lastReading = teslaLast24h[teslaLast24h.length - 1];

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Tesla Battery</h2>

      <LineChart
        data={teslaLast24h}
        dataKey="battery"
        unit="%"
        rounding={0}
        header={`${lastReading.battery}%`}
        scale={{
          min: 0.98,
          max: 1.02,
        }}
        label="battery level (last 24 hours)"
      />
      {!!lastReading && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          <span>
            last updated: {formatDistanceToNowStrict(lastReading.createdAt, { addSuffix: true })}
          </span>
          {lastTeslaCharged && (
            <span>
              last charged: {lastTeslaCharged.battery.toFixed(0)}% @{' '}
              {format(lastTeslaCharged.createdAt!, 'dd.MM.yyyy, HH:mm')}
            </span>
          )}
        </p>
      )}
    </div>
  );
};
