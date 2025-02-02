import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'temperature', unit: '°C', label: 'temperature', scale: { min: 0.92, max: 1 } },
  { dataKey: 'humidity', unit: '%', label: 'humidity', scale: { min: 0.8, max: 1 } },
  { dataKey: 'co2', unit: 'ppm', label: 'co₂', scale: { min: 0.8, max: 1 } },
  { dataKey: 'pressure', unit: 'hPa', label: 'pressure', scale: { min: 0.99, max: 1 } },
  { dataKey: 'battery', unit: '%', label: 'battery', scale: { min: 0.9, max: 1 } },
];

export const Aranet4Charts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=aranet" />;
};
