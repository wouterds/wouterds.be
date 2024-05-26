import { AppLoadContext } from '@remix-run/cloudflare';
import { fromUnixTime, isSameDay, subDays } from 'date-fns';

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

  public getLastCharge = async () => {
    return this.getAll().then((data) => {
      let last = data.pop();
      let previous = data.pop();

      while (previous && last && previous?.battery >= last?.battery) {
        last = previous;
        previous = data.pop();
      }

      return last || null;
    });
  };

  public distancePerDay = async (days: number) => {
    return this.getAll().then((data) => {
      return Array.from({ length: days }, (_, index) => {
        const date = subDays(new Date(), index);

        const firstRecord = data.reduceRight((acc, record) => {
          if (isSameDay(date, fromUnixTime(record.time))) {
            return record;
          }

          return acc;
        }, {} as TeslaRecord);

        const lastRecord = data.reduce((acc, record) => {
          if (isSameDay(date, fromUnixTime(record.time))) {
            return record;
          }

          return acc;
        }, {} as TeslaRecord);

        return {
          date,
          distance:
            lastRecord?.distance && firstRecord.distance
              ? lastRecord?.distance - firstRecord.distance
              : 0,
        };
      }).reverse();
    });
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
