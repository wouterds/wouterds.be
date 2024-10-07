import { useLoaderData } from '@remix-run/react';

import { LineChart } from '~/components/charts/line-chart';

import { loader } from './route';

export const EnergyCharts = () => {
  const { p1AveragesLast24h } = useLoaderData<typeof loader>();

  //       {p1History[p1History.length - 1] && (
  //         <BarChart
  //           data={p1History}
  //           dataKey="usage"
  //           unit=" kWh"
  //           header={`${p1History[p1History.length - 1].usage.toFixed(2)} kWh`}
  //           label="power usage (last 90 days)"
  //           className="mt-4"
  //           footer={[
  //             lastP1HistoryUpdate && <span>last updated: {lastP1HistoryUpdate}</span>,
  //             p1HistoryPeak && (
  //               <span>
  //                 peak usage: {p1HistoryPeak.usage.toFixed(2)} kWh @{' '}
  //                 {format(fromUnixTime(p1HistoryPeak.time), 'dd.MM.yyyy')}
  //               </span>
  //             ),
  //           ]}
  //         />
  //       )}

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
        footer={
          [
            // lastP1Update && <span>last updated: {lastP1Update}</span>,
            // p1Peak && (
            //   <span>
            //     peak usage: {p1Peak.active} Wh @ {format(fromUnixTime(p1Peak.time), 'HH:mm')}
            //   </span>
            // ),
          ]
        }
      />
    </div>
  );
};
