import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'temperature', unit: '°C', label: 'temperature' },
  { dataKey: 'humidity', unit: '%', label: 'humidity' },
  { dataKey: 'co2', unit: 'ppm', label: 'co₂' },
  { dataKey: 'pressure', unit: 'hPa', label: 'pressure' },
  { dataKey: 'battery', unit: '%', label: 'battery' },
];

export const Aranet4Charts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=aranet" />;
};
