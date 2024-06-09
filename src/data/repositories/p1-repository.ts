import { AppLoadContext } from '@remix-run/cloudflare';

import { KVRepository } from './abstract-kv-repository';

export class P1Repository extends KVRepository {
  public static create = (context: AppLoadContext) => new P1Repository(context);

  public getAll = async () => {
    return this.get<P1Record[]>('p1').then((data) => data || []);
  };

  public getLast = async () => {
    return this.getAll().then((records) => records[records.length - 1]);
  };
}

export type P1Record = {
  active: number;
  total: number;
  time: number;
  peak_timestamp: number;
};

export type P1HistoryRecord = {
  total: number;
  peak: number;
  peakTime: number;
  time: number;
};
