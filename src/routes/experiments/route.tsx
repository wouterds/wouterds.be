import { MetaFunction } from '@remix-run/node';
import { useRevalidator } from '@remix-run/react';
import ms from 'ms';
import { useEffect } from 'react';

import { AranetReadings } from '~/database/aranet-readings/repository';
import { P1Readings } from '~/database/p1-readings/repository';
import { TeslaData } from '~/database/tesla-data/repository';

import { AranetCharts } from './aranet-charts';
import { EnergyCharts } from './energy-charts';
import { TeslaCharts } from './tesla-charts';

export const loader = async () => {
  const [aranetAveragesLast24h, lastAranetReading, p1AveragesLast24h, lastP1Reading, teslaLast24h] =
    await Promise.all([
      AranetReadings.getLast24h({ sort: 'asc' }),
      AranetReadings.getLast(),
      P1Readings.getLast24h({ sort: 'asc' }),
      P1Readings.getLast(),
      TeslaData.getLast24h({ sort: 'asc' }),
    ]);

  return {
    aranetAveragesLast24h,
    lastAranetReading,
    p1AveragesLast24h,
    lastP1Reading,
    teslaLast24h,
  };
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
        <TeslaCharts />
      </div>
    </>
  );
}
