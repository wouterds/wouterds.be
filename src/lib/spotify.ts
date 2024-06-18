import { Buffer } from 'node:buffer';

import { AppLoadContext } from '@remix-run/cloudflare';

export class Spotify {
  private _context: AppLoadContext;
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;

  public constructor(context: AppLoadContext) {
    this._context = context;
  }

  public static create(context: AppLoadContext) {
    return new Spotify(context);
  }

  private get clientId() {
    return this._context.cloudflare.env.SPOTIFY_CLIENT_ID;
  }

  private get clientSecret() {
    return this._context.cloudflare.env.SPOTIFY_CLIENT_SECRET;
  }

  public get accessToken() {
    return this._accessToken;
  }

  public get refreshToken() {
    return this._refreshToken;
  }

  public set accessToken(value: string | null) {
    this._accessToken = value;
  }

  public set refreshToken(value: string | null) {
    this._refreshToken = value;
  }

  public authorizeUrl(redirectUri: string) {
    return new URL(
      `/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: redirectUri,
        scope: 'user-read-recently-played user-read-currently-playing',
      })}`,
      'https://accounts.spotify.com',
    ).toString();
  }

  public async authorize(code: string, redirectUri: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
          'base64',
        )}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json<{ access_token: string; refresh_token: string }>();

    this._accessToken = data.access_token;
    this._refreshToken = data.refresh_token;

    return data;
  }

  public async getMe() {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
      },
    });

    const data = await response.json<{
      id: string;
      display_name: string;
    }>();

    return {
      id: data.id,
      name: data.display_name,
    };
  }

  public async getCurrentlyPlaying() {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
      },
    });

    if (response.status === 204) {
      return null;
    }

    return response.json<{ item: SpotifySong }>().then(({ item }) => mapSong(item));
  }

  public async getRecentlyPlayed(tracks = 3) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${tracks}`,
      {
        headers: {
          Authorization: `Bearer ${this._accessToken}`,
        },
      },
    );

    return response
      .json<{ items: Array<{ track: SpotifySong }> }>()
      .then((songs) => songs.items.map(({ track }) => mapSong(track)));
  }
}

type SpotifySong = {
  id: string;
  name: string;
  explicit: boolean;
  external_urls: { spotify: string };
  artists: {
    id: string;
    name: string;
    external_urls: { spotify: string };
  }[];
};

const mapSong = (data: SpotifySong) => {
  return {
    id: data.id,
    url: data.external_urls.spotify,
    explicit: data.explicit,
    name: data.name,
    artist: data.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      url: artist.external_urls.spotify,
    })),
  };
};
