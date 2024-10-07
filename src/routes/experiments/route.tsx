import { MetaFunction } from '@remix-run/node';
import { useRevalidator } from '@remix-run/react';
import ms from 'ms';
import { useEffect } from 'react';

import { AranetReadings } from '~/database/aranet-readings/repository';
import { P1Readings } from '~/database/p1-readings/repository';

import { AranetCharts } from './aranet-charts';
import { EnergyCharts } from './energy-charts';

export const loader = async () => {
  return {
    aranetAveragesLast24h: await AranetReadings.getLast24h({ sort: 'asc' }),
    lastAranetReading: await AranetReadings.getLast(),
    p1AveragesLast24h: await P1Readings.getLast24h({ sort: 'asc' }),
  };

  // return json({
  //   teslaBatteryConsumedToday: await teslaRepository.batteryConsumedToday(),
  //   teslaBatteryChargedToday: await teslaRepository.batteryChargedToday(),
  //   teslaLastCharged: await teslaRepository.lastCharged(),
  //   teslaLast24h: await teslaRepository.getAll({ days: 1 }),
  //   teslaDistance: await teslaRepository.distancePerDay({ days: 90 }),
  //   teslaChargedPerDay: await teslaRepository.chargedPerDay({ days: 90 }),
  //   teslaBatteryConsumptionPerDay: await teslaRepository.batteryConsumptionPerDay({ days: 90 }),
  // });
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    { name: 'description', content: 'Playground with random experiments, not much to see here!' },
  ];
};

export default function Experiments() {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    const interval = setInterval(() => {
      revalidate();
    }, ms('30 seconds'));

    return () => clearInterval(interval);
  }, [revalidate]);

  return (
    <>
      <h1 className="text-xl font-medium mb-6">Experiments</h1>
      <div className="flex flex-col w-full gap-6">
        <AranetCharts />
        <EnergyCharts />
      </div>
    </>
  );

  //   const lastAranetUpdate = useTimeAgo(
  //     getUnixTime(new Date(aranet[aranet.length - 1]?.created_at || 0)),
  //   );
  //   const lastTeslaUpdate = useTimeAgo(teslaLast24h[teslaLast24h.length - 1]?.time);
  //   const teslaLongestDistanceDay = useMemo(() => {
  //     return teslaDistance?.reduce(
  //       (acc, record) => {
  //         if (record.distance > acc.distance) {
  //           return record;
  //         }
  //         return acc;
  //       },
  //       { distance: 0 } as { date: string; distance: number },
  //     );
  //   }, [teslaDistance]);
  //   const mostChargedDay = useMemo(() => {
  //     return teslaChargedPerDay?.reduce(
  //       (acc, record) => {
  //         if (record.battery > acc.battery) {
  //           return record;
  //         }
  //         return acc;
  //       },
  //       { battery: 0 } as { date: string; battery: number },
  //     );
  //   }, [teslaChargedPerDay]);
  //   const p1Peak = useMemo(() => {
  //     return p1.reduce(
  //       (acc, record) => {
  //         if (record.active > acc.active) {
  //           return record;
  //         }
  //         return acc;
  //       },
  //       { active: 0 } as { time: number; active: number },
  //     );
  //   }, [p1]);
  //   const p1HistoryPeak = useMemo(() => {
  //     return p1History.reduce(
  //       (acc, record) => {
  //         if (record.usage > acc.usage) {
  //           return record;
  //         }
  //         return acc;
  //       },
  //       { usage: 0 } as { time: number; usage: number },
  //     );
  //   }, [p1History]);
  //
  //       <h2 className="text-lg font-medium mb-2 mt-4">Tesla data</h2>
  //       {teslaLast24h[teslaLast24h.length - 1] && (
  //         <LineChart
  //           data={teslaLast24h}
  //           dataKey="battery"
  //           unit="%"
  //           rounding={0}
  //           header={`${teslaLast24h[teslaLast24h.length - 1].battery.toFixed(0)}%`}
  //           label="battery capacity (last 24 hours)"
  //           scale={{ min: 0.99, max: 1.01 }}
  //           footer={[
  //             lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
  //             teslaLastCharged && (
  //               <span>
  //                 consumed last 24h: {teslaBatteryConsumedToday.toFixed(0)}%
  //                 {teslaBatteryChargedToday > 1
  //                   ? `, charged last 24h: ${teslaBatteryChargedToday.toFixed(0)}%`
  //                   : ''}
  //               </span>
  //             ),
  //           ]}
  //         />
  //       )}
  //       {teslaBatteryConsumptionPerDay.length > 0 && (
  //         <BarChart
  //           syncId="tesla"
  //           data={teslaBatteryConsumptionPerDay}
  //           dataKey="battery"
  //           unit="%"
  //           rounding={0}
  //           label="battery consumption (last 90 days)"
  //           className="mt-4"
  //           footer={[
  //             lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
  //             teslaLastCharged && (
  //               <span>
  //                 last charged to: {teslaLastCharged?.battery?.toFixed(0)}% @{' '}
  //                 {format(fromUnixTime(teslaLastCharged?.time || 0), 'dd.MM.yyyy, HH:mm')}
  //               </span>
  //             ),
  //           ]}
  //         />
  //       )}
  //       {teslaChargedPerDay.length > 0 && (
  //         <BarChart
  //           syncId="tesla"
  //           data={teslaChargedPerDay}
  //           dataKey="battery"
  //           unit="%"
  //           rounding={0}
  //           label="battery charging (last 90 days)"
  //           className="mt-4"
  //           footer={[
  //             lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
  //             mostChargedDay && (
  //               <span>
  //                 most charging: {mostChargedDay.battery.toFixed(0)}% @{' '}
  //                 {format(mostChargedDay?.date, 'dd.MM.yyyy')}
  //               </span>
  //             ),
  //           ]}
  //         />
  //       )}
  //       {teslaDistance.length > 0 && (
  //         <BarChart
  //           syncId="tesla"
  //           data={teslaDistance}
  //           dataKey="distance"
  //           unit=" km"
  //           label="distance driven (last 90 days)"
  //           className="mt-4"
  //           footer={[
  //             lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
  //             teslaLongestDistanceDay?.distance && teslaLongestDistanceDay?.date && (
  //               <span>
  //                 longest distance: {teslaLongestDistanceDay.distance.toFixed(2)} km @{' '}
  //                 {format(teslaLongestDistanceDay.date, 'dd.MM.yyyy')}
  //               </span>
  //             ),
  //           ]}
  //         />
  //       )}
  //     </>
  //   );
}
