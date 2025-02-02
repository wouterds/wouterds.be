import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'cpuTemp', unit: '°C', label: 'cpu temperature', scale: { min: 0.9, max: 1 } },
  { dataKey: 'cpuUsage', unit: '%', label: 'cpu usage', scale: { min: 0.85, max: 1 } },
  { dataKey: 'memoryUsage', unit: '%', label: 'memory usage', scale: { min: 0.92, max: 1 } },
  { dataKey: 'diskUsage', unit: '%', label: 'disk usage', scale: { min: 0.95, max: 1 } },
];

export const NUCCharts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=nuc" />;
};
