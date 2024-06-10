import { Buffer } from 'node:buffer';

import { AppLoadContext } from '@remix-run/cloudflare';
import { fromUnixTime, isSameDay, subDays } from 'date-fns';

import { KVRepository } from './abstract-kv-repository';

export class TeslaRepository extends KVRepository {
  public static create = (context: AppLoadContext) => new TeslaRepository(context);

  public add = async (record: TeslaRecord) => {
    return this.getAll().then(async (data) => {
      data.push(record);

      // keep max 90 days of data
      for (const record of data) {
        if (fromUnixTime(record.time) < subDays(new Date(), 90)) {
          data.shift();
        }
      }

      await this.put('tesla', data);

      return record;
    });
  };

  public getAll = async () => {
    return this.get<TeslaRecord[]>('tesla').then((data) => data || []);
  };

  // todo: move to CF env vars
  public getRefreshToken = async () => {
    return this.get<string>('tesla-refresh-token').then((data) => {
      if (!data) {
        return null;
      }

      return Buffer.from(data, 'base64').toString('utf-8');
    });
  };

  // todo: move to CF env vars
  public updateRefreshToken = async (refreshToken: string) => {
    return this.put('tesla-refresh-token', Buffer.from(refreshToken).toString('base64'));
  };

  public getLast = async () => {
    return this.getAll().then((data) => data.pop());
  };

  public getLastAwake = async () => {
    return this.getAll().then((data) => data.filter((v) => v.wake).pop());
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
  battery: number;
  distance: number;
  time: number;
  wake: boolean;
};
