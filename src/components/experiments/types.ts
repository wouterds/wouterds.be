import type { LucideIcon } from 'lucide-react';

export type MetricProps = {
  icon: LucideIcon;
  value: string | number;
  unit?: string;
  href?: string;
};
