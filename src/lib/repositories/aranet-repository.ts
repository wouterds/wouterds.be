import { AppLoadContext } from '@remix-run/cloudflare';

import { KVRepository } from './abstract-kv-repository';

export class AranetRepository extends KVRepository {
  public static create = (context: AppLoadContext) => new AranetRepository(context);

  public getAll = async () => {
    return this.get<AranetRecord[]>('aranet').then((data) => data || []);
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
