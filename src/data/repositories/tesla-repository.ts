import { AppLoadContext } from '@remix-run/cloudflare';

import { KVRepository } from './abstract-kv-repository';

export class TeslaRepository extends KVRepository {
  public static create = (context: AppLoadContext) => new TeslaRepository(context);

  public add = async (record: TeslaRecord) => {
    return this.getAll().then(async (data) => {
      data.push(record);

      await this.put('tesla', data);

      return record;
    });
  };

  public getAll = async () => {
    return this.get<TeslaRecord[]>('tesla').then((data) => data || []);
  };

  public getLast = async () => {
    return this.getAll().then((data) => data.pop());
  };

  public getLastAwake = async () => {
    return this.getAll().then((data) => data.filter((v) => v.wake).pop());
  };
}

export type TeslaRecord = {
  name: string;
  version: string;
  battery: number;
  distance: number;
  time: number;
  wake: boolean;
  woken: boolean;
};
