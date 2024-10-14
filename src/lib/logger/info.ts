import { prefixedLog } from './prefixed-log';

export const info = (...message: unknown[]) => {
  prefixedLog('info', ...message);
};
