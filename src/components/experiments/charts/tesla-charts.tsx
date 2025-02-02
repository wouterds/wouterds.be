import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'distance', unit: 'km', label: 'distance', scale: { min: 0.99, max: 1 } },
  {
    dataKey: 'temperatureInside',
    unit: '°C',
    label: 'cabin temperature',
    scale: { min: 0.8, max: 1 },
  },
  { dataKey: 'battery', unit: '%', label: 'battery', scale: { min: 0.8, max: 1 } },
];

export const TeslaCharts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=tesla" />;
};
