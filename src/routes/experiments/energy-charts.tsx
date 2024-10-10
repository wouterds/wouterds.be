import { useLoaderData } from '@remix-run/react';

import { LineChart } from '~/components/charts/line-chart';

import { loader } from './route';

export const EnergyCharts = () => {
  const { p1AveragesLast24h } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Energy usage</h2>

      <LineChart
        data={p1AveragesLast24h}
        dataKey="active"
        unit=" Wh"
        rounding={0}
        header={`${p1AveragesLast24h[p1AveragesLast24h.length - 1].active} Wh`}
        label="power usage (last 24 hours)"
      />
    </div>
  );
};
