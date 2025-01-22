import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const humanReadableSize = (size?: number) => {
  if (typeof size !== 'number') {
    return null;
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(1)} ${units[i]}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
