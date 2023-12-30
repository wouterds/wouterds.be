import { Env } from './env';

declare global {
  export type Context = {
    env: Env;
    url: string;
  };
}
