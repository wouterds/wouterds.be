import { prefixedLog } from './prefixed-log';

export const event = (...message: unknown[]) => {
  prefixedLog('event', ...message);
};
