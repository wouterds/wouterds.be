import { AppLoadContext } from '@remix-run/node';

export abstract class KVRepository {
  private _context: AppLoadContext;
  private _cache: Record<string, unknown> = {};

  public constructor(context: AppLoadContext) {
    this._context = context;
  }

  protected get context() {
    return this._context;
  }

  private get KV() {
    return this._context.cloudflare?.env?.CACHE;
  }

  protected get = async <T = unknown>(key: string) => {
    if (this._cache[key]) return this._cache[key] as T;

    const data = await this.KV?.get<string>(key);
    if (!data) return null;

    try {
      this._cache[key] = JSON.parse(data);
    } catch {
      this._cache[key] = data;
    }

    return this._cache[key] as T;
  };

  protected put = async <T = unknown>(key: string, value: T) => {
    return this.KV?.put(key, JSON.stringify(value));
  };
}
