import { Env } from './env';

export * from '@remix-run/node';

declare module '@remix-run/node' {
  export interface AppLoadContext extends Record<string, string> {
    env: Env;
    url: string;
    ray: string | null;
  }
}
