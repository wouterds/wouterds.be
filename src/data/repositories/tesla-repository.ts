import { Buffer } from 'node:buffer';

import { AppLoadContext } from '@remix-run/cloudflare';
import { fromUnixTime, isSameDay, startOfDay, subDays } from 'date-fns';

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

  public getAll = async (options?: { days?: number }) => {
    const data = await this.get<TeslaRecord[]>('tesla').then(
      (data) => data?.sort((a, b) => a.time - b.time) || [],
    );

    if (options?.days) {
      return data.filter((v) => fromUnixTime(v.time) > subDays(new Date(), options.days!));
    }

    return data;
  };

  public getRefreshToken = async () => {
    return this.get<string>('tokens').then((data) => {
      if (!data) {
        return null;
      }

      return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))?.tesla?.refreshToken;
    });
  };

  public updateRefreshToken = async (refreshToken: string) => {
    return this.get<string>('tokens').then((data) => {
      if (!data) {
        return this.put(
          'tokens',
          Buffer.from(JSON.stringify({ tesla: { refreshToken } })).toString('base64'),
        );
      }

      const tokens = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
      if (!tokens?.tesla) {
        tokens.tesla = {};
      }

      tokens.tesla.refreshToken = refreshToken;

      return this.put('tokens', Buffer.from(JSON.stringify(tokens)).toString('base64'));
    });
  };

  public getLast = async () => {
    return this.getAll().then((data) => data.pop());
  };

  public distancePerDay = async (options?: { days?: number }) => {
    const days = options?.days || 0;
    if (!days) {
      return [];
    }

    return this.getAll({ days }).then((data) => {
      return Array.from({ length: days }, (_, index) => {
        const date = subDays(startOfDay(new Date()), index);

        let distance = 0;
        let previous: TeslaRecord | null = null;
        for (const record of data) {
          if (!isSameDay(date, fromUnixTime(record.time))) {
            continue;
          }

          if (previous) {
            distance += record.distance - previous.distance;
          }

          previous = record;
        }

        return { date, distance };
      }).reverse();
    });
  };

  public batteryConsumptionPerDay = async (options?: { days?: number }) => {
    const days = options?.days || 0;
    if (!days) {
      return [];
    }

    return this.getAll({ days }).then((data) => {
      return Array.from({ length: days }, (_, index) => {
        const date = subDays(new Date(), index);

        let battery = 0;
        let previous: TeslaRecord | null = null;
        for (const record of data) {
          if (!isSameDay(date, fromUnixTime(record.time))) {
            continue;
          }

          if (previous && record.battery < previous?.battery) {
            battery += previous.battery - record.battery;
          }

          previous = record;
        }

        return { date, battery };
      }).reverse();
    });
  };

  public chargedPerDay = async (options?: { days?: number }) => {
    const days = options?.days || 0;
    if (!days) {
      return [];
    }

    return this.getAll({ days }).then((data) => {
      return Array.from({ length: days }, (_, index) => {
        const date = subDays(new Date(), index);

        let battery = 0;
        let previous: TeslaRecord | null = null;
        for (const record of data) {
          if (!isSameDay(date, fromUnixTime(record.time))) {
            continue;
          }

          if (previous && record.battery > previous?.battery) {
            battery += record.battery - previous.battery;
          }

          previous = record;
        }

        return { date, battery };
      }).reverse();
    });
  };

  public batteryConsumedToday = async () => {
    return this.getAll({ days: 1 }).then((data) => {
      let battery = 0;
      let previous: TeslaRecord | null = null;
      for (const record of data) {
        if (previous && record.battery < previous?.battery) {
          battery += previous.battery - record.battery;
        }

        previous = record;
      }

      return battery;
    });
  };

  public batteryChargedToday = async () => {
    return this.getAll({ days: 1 }).then((data) => {
      let battery = 0;
      let previous: TeslaRecord | null = null;
      for (const record of data) {
        if (previous && record.battery > previous?.battery) {
          battery += record.battery - previous.battery;
        }

        previous = record;
      }

      return battery;
    });
  };

  public lastCharged = async () => {
    return this.getAll({ days: 90 }).then((data) => {
      let previous: TeslaRecord | null = null;

      for (const record of data.reverse()) {
        if (previous && previous.battery > record?.battery + 1) {
          return previous;
        }

        previous = record;
      }

      return null;
    });
  };

  public getLastAwake = async () => {
    return this.getAll().then((data) => data.filter((v) => v.wake).pop());
  };
}

export type TeslaRecord = {
  battery: number;
  distance: number;
  temperature: {
    inside: number;
    outside: number;
  };
  time: number;
  wake: boolean;
};
