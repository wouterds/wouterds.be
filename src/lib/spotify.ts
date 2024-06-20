import { Buffer } from 'node:buffer';

import { AppLoadContext } from '@remix-run/cloudflare';
import { addSeconds, getUnixTime, isPast } from 'date-fns';

import { KVRepository } from '~/data/repositories/abstract-kv-repository';

export class Spotify extends KVRepository {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;
  private _expiry: Date | null = null;

  public static create(context: AppLoadContext) {
    return new Spotify(context);
  }

  private get clientId() {
    return this.context.cloudflare.env.SPOTIFY_CLIENT_ID;
  }

  private get clientSecret() {
    return this.context.cloudflare.env.SPOTIFY_CLIENT_SECRET;
  }

  public async loadTokens() {
    const data = await this.get<string>('tokens');
    if (!data) {
      return;
    }

    const tokens = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))?.spotify;
    if (!tokens) {
      return;
    }

    this._accessToken = tokens.accessToken || null;
    this._refreshToken = tokens.refreshToken || null;
    this._expiry = new Date(tokens.expiry) || null;
  }

  public async storeTokens() {
    const data = await this.get<string>('tokens');
    const tokens = JSON.parse(Buffer.from(data!, 'base64').toString('utf-8'));
    if (!tokens?.spotify) {
      tokens.spotify = {};
    }

    tokens.spotify.accessToken = this._accessToken;
    tokens.spotify.refreshToken = this._refreshToken;
    tokens.spotify.expiry = this._expiry;

    return this.put('tokens', Buffer.from(JSON.stringify(tokens)).toString('base64'));
  }

  public authorizeUrl(redirectUri: string) {
    const scopes = ['user-read-recently-played', 'user-read-currently-playing'];

    return new URL(
      `/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
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

    const data = await response.json<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>();

    this._accessToken = data.access_token;
    this._refreshToken = data.refresh_token;
    this._expiry = addSeconds(new Date(), data.expires_in);
  }

  public async refreshAccessToken() {
    if (!this._refreshToken) {
      await this.loadTokens();

      if (!this._refreshToken) {
        return;
      }
    }

    // not expired yet?
    if (!isPast(this._expiry!)) {
      return;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
          'base64',
        )}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this._refreshToken,
      }),
    });

    const data = await response.json<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>();

    this._accessToken = data.access_token;
    this._refreshToken = data.refresh_token;
    this._expiry = addSeconds(new Date(), data.expires_in);

    await this.storeTokens();
  }

  public async getMe() {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${this._accessToken}` },
    });

    const data = await response.json<{ id: string; display_name: string }>();

    return {
      id: data.id,
      name: data.display_name,
    };
  }

  public async getCurrentlyPlaying() {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${this._accessToken}` },
    });

    if (response.status === 204) {
      return null;
    }

    return response.json<{ item: SpotifyRawDataTrack }>().then(({ item }) => mapSong(item));
  }

  public async getRecentlyPlayed(tracks = 3) {
    const params = new URLSearchParams({});
    if (tracks) params.append('limit', tracks.toString());

    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?${params}`, {
      headers: { Authorization: `Bearer ${this._accessToken}` },
    });

    return response
      .json<{ items: Array<{ track: SpotifyRawDataTrack }> }>()
      .then((songs) => songs.items.map(({ track }) => mapSong(track)));
  }
}

type SpotifyRawDataTrack = {
  id: string;
  name: string;
  explicit: boolean;
  external_urls: { spotify: string };
  artists: {
    id: string;
    name: string;
    external_urls: { spotify: string };
  }[];
  played_at: string;
};

const mapSong = (data: SpotifyRawDataTrack) => {
  if (!data?.id) {
    return null;
  }

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
    playedAt: getUnixTime(data?.played_at || new Date()),
  };
};

export type SpotifyTrack = ReturnType<typeof mapSong>;
