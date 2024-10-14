import { prefixedLog } from './prefixed-log';

export const error = (...message: unknown[]) => {
  prefixedLog('error', ...message);
};
