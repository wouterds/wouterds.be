import { BaseCharts } from './base-charts';

const dataConfigs = [{ dataKey: 'active', unit: 'W', label: 'power usage' }];

export const PowerCharts = () => {
  return <BaseCharts dataConfigs={dataConfigs} apiEndpoint="/api/experiments?timeseries=p1" />;
};
