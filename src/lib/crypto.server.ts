import { createHash } from 'crypto';

export const md5 = (value: string) => {
  return createHash('md5').update(value).digest('hex');
};
