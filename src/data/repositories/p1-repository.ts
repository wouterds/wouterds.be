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

  public getHistory = async (limit?: number) => {
    return this.get<P1HistoryRecord[]>('p1-history').then((data) => {
      const records =
        data?.map((record, index) => ({
          usage: index === 0 ? 0 : record.total - data[index - 1].total,
          time: record.time,
        })) || [];

      if (limit) {
        return records.slice(-limit);
      }

      return records;
    });
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
