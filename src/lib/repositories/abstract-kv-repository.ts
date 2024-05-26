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
    try {
      const data = await this.KV.get<string>(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  };
}
