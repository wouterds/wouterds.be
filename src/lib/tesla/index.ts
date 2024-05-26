import { Buffer } from 'node:buffer';

import { AppLoadContext } from '@remix-run/cloudflare';

export class Tesla {
  private _context: AppLoadContext;
  private _accessToken?: string;
  private _refreshToken?: string;
  private _vin?: string;

  public constructor(context: AppLoadContext) {
    this._context = context;
  }

  public static create(context: AppLoadContext) {
    return new Tesla(context);
  }

  public setVin(vin: string) {
    this._vin = vin;
    return this;
  }

  public setRefreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
    return this;
  }

  private get vin() {
    if (!this._vin) {
      throw new Error('Tesla VIN not set');
    }

    return this._vin;
  }

  private get refreshToken() {
    if (this._refreshToken) {
      return this._refreshToken;
    }

    // todo: store somewhere else? safer?
    return this._context.cloudflare.env.CACHE?.get?.('tesla-refresh-token').then((data) => {
      if (!data) {
        throw new Error('Tesla refresh token not set');
      }

      return Buffer.from(data, 'base64').toString('utf-8');
    });
  }

  private get accessToken() {
    if (!this._accessToken) {
      throw new Error('Tesla access token not set');
    }

    return this._accessToken;
  }

  public async auth() {
    const response = await fetch('https://auth.tesla.com/oauth2/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: 'ownerapi',
        refresh_token: await this.refreshToken,
        scope: 'openid email offline_access vehicle_device_data',
      }),
    });

    const data = await response.json<{ access_token: string; refresh_token: string }>();
    if (!data.access_token) {
      throw new Error('Tesla auth failed');
    }

    this._accessToken = data.access_token;
    this._context.cloudflare.env.CACHE?.put?.(
      'tesla-refresh-token',
      Buffer.from(data.refresh_token).toString('base64'),
    );

    return this;
  }

  public async getData() {
    const response = await fetch(
      `https://owner-api.teslamotors.com/api/1/vehicles/${this.vin}/vehicle_data`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );

    return response.json<{
      error?: string;
      response?: {
        charge_state?: {
          battery_level?: number;
        };
        vehicle_state?: {
          odometer?: number;
          vehicle_name?: string;
          car_version?: string;
        };
      };
    }>();
  }

  public async wakeUp() {
    await fetch(`https://owner-api.teslamotors.com/api/1/vehicles/${this.vin}/wake_up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 10_000));

    return this;
  }
}
