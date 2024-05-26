import { AppLoadContext } from '@remix-run/cloudflare';

export abstract class KVRepository {
  private _context: AppLoadContext;

  public constructor(context: AppLoadContext) {
    this._context = context;
  }

  private get KV() {
    return this._context.cloudflare.env.CACHE;
  }

  protected get = async <T = unknown>(key: string) => {
    const data = await this.KV.get<string>(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  };

  protected put = async <T = unknown>(key: string, value: T) => {
    return this.KV.put(key, JSON.stringify(value));
  };
}
