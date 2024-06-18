import { AppLoadContext } from '@remix-run/cloudflare';

import { TeslaRepository } from '~/data/repositories/tesla-repository';

export class Tesla {
  private _context: AppLoadContext;
  private _accessToken?: string;
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

  private get vin() {
    if (!this._vin) {
      throw new Error('Tesla VIN not set');
    }

    return this._vin;
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
        refresh_token: await TeslaRepository.create(this._context).getRefreshToken(),
        scope: 'openid email offline_access vehicle_device_data',
      }),
    });

    const data = await response.json<{ access_token: string; refresh_token: string }>();
    if (!data.access_token) {
      throw new Error('Tesla auth failed');
    }

    this._accessToken = data.access_token;
    await TeslaRepository.create(this._context).updateRefreshToken(data.refresh_token);

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
