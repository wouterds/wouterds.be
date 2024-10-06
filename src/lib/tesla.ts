import { addSeconds, isPast } from 'date-fns';

import { AuthTokens } from '~/database/auth-tokens/repository';

export class Tesla {
  private _refreshToken?: string | null;
  private _accessToken?: string | null;
  private _vin?: string;

  public constructor(refreshToken?: string) {
    this._refreshToken = refreshToken;
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

  private get refreshToken() {
    return (async () => {
      if (this._refreshToken) {
        return this._refreshToken!;
      }

      const authToken = await AuthTokens.get('TESLA', 'REFRESH_TOKEN');
      this._refreshToken = authToken?.token || null;

      return this._refreshToken!;
    })();
  }

  private get accessToken() {
    return (async () => {
      if (this._accessToken) {
        return this._accessToken;
      }

      const authToken = await AuthTokens.get('TESLA', 'ACCESS_TOKEN');
      this._accessToken = authToken?.token || null;

      if (authToken && isPast(authToken.expiresAt!)) {
        await this.exchangeToken();
      }

      return this._accessToken!;
    })();
  }

  public async exchangeToken() {
    const data = await fetch('https://auth.tesla.com/oauth2/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: 'ownerapi',
        refresh_token: await this.refreshToken,
        scope: 'openid email offline_access vehicle_device_data',
      }),
    }).then((res) => res.json());

    await Promise.all([
      AuthTokens.upsert('TESLA', 'ACCESS_TOKEN', {
        token: data.access_token,
        expiresAt: addSeconds(new Date(), data.expires_in),
      }),
      AuthTokens.update('TESLA', 'REFRESH_TOKEN', {
        token: data.refresh_token,
      }),
    ]);

    this._accessToken = data.access_token;
    this._refreshToken = data.refresh_token;

    return this;
  }

  public async getData() {
    const response = await fetch(
      `https://owner-api.teslamotors.com/api/1/vehicles/${this.vin}/vehicle_data`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.accessToken}`,
        },
      },
    );

    return response.json() as Promise<{
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
        climate_state?: {
          inside_temp?: number;
          outside_temp?: number;
        };
      };
    }>;
  }

  public async wakeUp() {
    await fetch(`https://owner-api.teslamotors.com/api/1/vehicles/${this.vin}/wake_up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.accessToken}`,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 10_000));

    return this;
  }
}
