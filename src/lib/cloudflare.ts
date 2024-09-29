export class CloudflareTurnstileValidator {
  private _ip?: string;

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
      payload.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET!);
      payload.append('response', value);
      payload.append('remoteip', this.ip);

      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: payload,
      }).then((response) => response.json() as Promise<{ success: boolean }>);

      if (!response.success) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}
