import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'cpuTemp', unit: '°C', label: 'cpu temperature' },
  { dataKey: 'cpuUsage', unit: '%', label: 'cpu usage' },
  { dataKey: 'memoryUsage', unit: '%', label: 'memory usage' },
  { dataKey: 'diskUsage', unit: '%', label: 'disk usage' },
];

export const NUCCharts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=nuc" />;
};
