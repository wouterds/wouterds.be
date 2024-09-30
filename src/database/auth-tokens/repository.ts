import { and, desc, eq } from 'drizzle-orm';

import { db } from '~/database/connection';
import { decrypt, encrypt } from '~/lib/encryption';

import { AuthToken } from './model';

const add = async (
  vendor: AuthToken['vendor'],
  type: AuthToken['type'],
  token: Omit<AuthToken, 'vendor' | 'type'>,
) => {
  await db.insert(AuthToken).values({
    ...token,
    vendor,
    type,
    token: encrypt(token.token, process.env.ENCRYPTION_SECRET!),
  });
};

const get = async (vendor: AuthToken['vendor'], type: AuthToken['type']) => {
  const tokens = await db
    .select()
    .from(AuthToken)
    .where(and(eq(AuthToken.vendor, vendor), eq(AuthToken.type, type)))
    .orderBy(desc(AuthToken.id))
    .limit(1);

  const token = tokens[0];
  if (!token) {
    return null;
  }

  return {
    ...token,
    token: decrypt(token.token, process.env.ENCRYPTION_SECRET!),
  };
};

const update = async (
  vendor: AuthToken['vendor'],
  type: AuthToken['type'],
  token: Omit<AuthToken, 'vendor' | 'type'>,
) => {
  await db
    .update(AuthToken)
    .set({
      ...token,
      token: encrypt(token.token, process.env.ENCRYPTION_SECRET!),
    })
    .where(and(eq(AuthToken.vendor, vendor), eq(AuthToken.type, type)));
};

const upsert = async (
  vendor: AuthToken['vendor'],
  type: AuthToken['type'],
  token: Omit<AuthToken, 'vendor' | 'type'>,
) => {
  await db
    .insert(AuthToken)
    .values({
      ...token,
      vendor,
      type,
      token: encrypt(token.token, process.env.ENCRYPTION_SECRET!),
    })
    .onDuplicateKeyUpdate({
      set: {
        ...token,
        vendor,
        type,
        token: encrypt(token.token, process.env.ENCRYPTION_SECRET!),
      },
    });
};

const truncate = async () => {
  await db.delete(AuthToken);
};

export const AuthTokens = {
  add,
  get,
  update,
  upsert, // Add this to the exported object
  truncate,
};
