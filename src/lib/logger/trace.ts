import { prefixedLog } from './prefixed-log';

export const trace = (...message: unknown[]) => {
  prefixedLog('trace', ...message);
};
