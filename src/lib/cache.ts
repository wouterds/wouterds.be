import { createClient, RedisClientType } from '@redis/client';
import { formatDistanceStrict, formatDistanceToNowStrict } from 'date-fns';

import { logger } from './logger';

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
    logger.wait(`[${key}]`, 'checking cache');

    const value = await this.client.get(key);
    if (value) {
      const ttl = await this.client.ttl(key);
      const expiresIn = ttl > 0 ? formatDistanceStrict(0, ttl * 1000) : null;

      logger.event(`[${key}]`, `cache hit${expiresIn ? `, expires in ${expiresIn}` : ''}`);

      return JSON.parse(value);
    }

    logger.warn(`[${key}]`, 'cache miss');

    return null;
  };

  public set = async <T = unknown>(key: string, value: T, expiry?: Date) => {
    const diff = expiry ? formatDistanceToNowStrict(expiry) : null;

    logger.event(`[${key}]`, `cache set${diff ? `, expires in ${diff}` : ''}`);

    return this.client.set(key, JSON.stringify(value), {
      EX: expiry ? Math.floor((expiry.getTime() - Date.now()) / 1000) : undefined,
    });
  };
}

export const Cache = new RedisCache();
