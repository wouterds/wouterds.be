import { createClient, RedisClientType } from '@redis/client';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';

class RedisCache {
  private _client: RedisClientType;

  public constructor() {
    this._client = createClient({
      url: `redis://${REDIS_HOST}:6379`,
    });
  }

  private get client() {
    if (!this._client.isOpen) {
      this._client.connect();
    }

    return this._client;
  }

  public get = async (key: string) => {
    const value = await this.client.get(key);
    if (value) {
      console.log('cache hit', key);

      return JSON.parse(value);
    }

    console.log('cache miss', key);

    return null;
  };

  public set = async <T = unknown>(key: string, value: T, expiry?: Date) => {
    console.log('cache set', key);

    return this.client.set(key, JSON.stringify(value), {
      EX: expiry ? Math.floor((expiry.getTime() - Date.now()) / 1000) : undefined,
    });
  };
}

export const Cache = new RedisCache();
