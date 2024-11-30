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
        syncId="tesla"
      />

      <div className="gap-1.5 grid grid-cols-2 mt-3">
        <LineChart
          data={teslaLast24h}
          dataKey="temperatureInside"
          unit="ºC"
          rounding={1}
          header={`${lastReading.temperatureInside}ºC`}
          label="interior temperature"
          scale={{ min: 0.9, max: 1 }}
          syncId="tesla"
          compact
        />
        <LineChart
          data={teslaLast24h}
          dataKey="temperatureOutside"
          unit="ºC"
          rounding={1}
          header={`${lastReading.temperatureOutside}ºC`}
          label="exterior temperature"
          scale={{ min: 0.9, max: 1 }}
          syncId="tesla"
          compact
        />
      </div>

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
