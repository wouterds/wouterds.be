import { BaseCharts } from './base-charts';

const dataConfigs = [
  { dataKey: 'active', unit: 'W', label: 'power usage', scale: { min: 0.8, max: 1 } },
];

export const PowerCharts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=p1" />;
};
