import { AppLoadContext } from '@remix-run/cloudflare';

export class TurnstileValidator {
  private _context: AppLoadContext;
  private _ip?: string;

  public constructor(context: AppLoadContext) {
    this._context = context;
  }

  public static create(context: AppLoadContext) {
    return new TurnstileValidator(context);
  }

  private get apiSecret() {
    return this._context.cloudflare.env.CLOUDFLARE_TURNSTILE_SECRET;
  }

  public setIp(ip: string) {
    this._ip = ip;

    return this;
  }

  private get ip() {
    if (!this._ip) {
      throw new Error('IP is missing');
    }

    return this._ip;
  }

  public async validate(value?: string) {
    if (!value) {
      return false;
    }

    try {
      const payload = new FormData();
      payload.append('secret', this.apiSecret);
      payload.append('response', value);
      payload.append('remoteip', this.ip);

      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: payload,
      }).then((response) => response.json<{ success: boolean }>());

      if (!response.success) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}
