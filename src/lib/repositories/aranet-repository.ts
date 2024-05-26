import { AppLoadContext } from '@remix-run/cloudflare';
import { fromUnixTime } from 'date-fns';

import { KVRepository } from './abstract-kv-repository';

export class AranetRepository extends KVRepository {
  public static create = (context: AppLoadContext) => new AranetRepository(context);

  public add = async (record: AranetRecord) => {
    return this.getAll().then((records) => {
      records.push(record);
      if (records.length > (24 * 60) / 5) {
        records.shift();
      }

      return this.put<AranetRecord[]>('aranet', records);
    });
  };

  public getAll = async () => {
    return this.get<AranetRecord[]>('aranet').then((data) => data || []);
  };

  public getLastPush = async () => {
    return this.getAll().then((records) => fromUnixTime(records[records.length - 1]?.time ?? 0));
  };
}

type AranetRecord = {
  time: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressure: number;
  battery: number;
};
