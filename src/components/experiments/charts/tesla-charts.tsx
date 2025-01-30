import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'distance', unit: 'km', label: 'distance' },
  { dataKey: 'temperatureInside', unit: '°C', label: 'cabin temperature' },
  { dataKey: 'battery', unit: '%', label: 'battery' },
];

export const TeslaCharts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=tesla" />;
};
