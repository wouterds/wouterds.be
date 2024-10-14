import { createClient, RedisClientType } from '@redis/client';

export class Cache {
  private static _client: RedisClientType = createClient({
    url: 'redis://redis:6379',
  });

  public static get = async (key: string) => {
    const value = await this._client.get(key);
    if (value) {
      console.log('cache hit', key);

      return JSON.parse(value);
    }

    console.log('cache miss', key);

    return null;
  };

  public static set = async <T = unknown>(key: string, value: T, expiry?: Date) => {
    console.log('cache set', key);

    return this._client.set(key, JSON.stringify(value), {
      EX: expiry ? Math.floor((expiry.getTime() - Date.now()) / 1000) : undefined,
    });
  };
}
