import { AppLoadContext } from '@remix-run/cloudflare';

import { KVRepository } from './abstract-kv-repository';

export class AranetRepository extends KVRepository {
  public static create = (context: AppLoadContext) => new AranetRepository(context);

  public add = async (record: AranetRecord) => {
    return this.getAll().then(async (records) => {
      records.push(record);
      if (records.length > (24 * 60) / 5) {
        records.shift();
      }

      await this.put('aranet', records);

      return record;
    });
  };

  public getAll = async () => {
    return this.get<AranetRecord[]>('aranet').then((data) => data || []);
  };

  public getLast = async () => {
    return this.getAll().then((records) => records[records.length - 1]);
  };
}

export type AranetRecord = {
  time: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressure: number;
  battery: number;
};
