import { prefixedLog } from './prefixed-log';

export const wait = (...message: unknown[]) => {
  prefixedLog('wait', ...message);
};
