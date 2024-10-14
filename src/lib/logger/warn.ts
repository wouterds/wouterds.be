import { prefixedLog } from './prefixed-log';

export const warn = (...message: unknown[]) => {
  prefixedLog('warn', ...message);
};
