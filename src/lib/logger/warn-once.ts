import { warn } from './warn';

const warnOnceMessages = new Set();
export const warnOnce = (...message: unknown[]) => {
  if (!warnOnceMessages.has(message[0])) {
    warnOnceMessages.add(message.join(' '));

    warn(...message);
  }
};
