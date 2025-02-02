import { Cache } from '~/lib/cache.server';
import { md5 } from '~/lib/crypto.server';

import { transformPost, transformReply } from './transformers';
import type { BlueskyAPIReply, BlueskyPost } from './types';

const CACHE_TTL = 2; // minutes
const BLUESKY_AUTHOR = 'wouterds.com';

const getPostReplies = async (atUri: string): Promise<BlueskyAPIReply[]> => {
  const cacheKey = `bluesky.post.replies:${md5(atUri)}`;
  const cached = await Cache.get(cacheKey);
  if (cached) {
    return cached as BlueskyAPIReply[];
  }

  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${new URLSearchParams({
      uri: atUri,
    })}`,
  );

  const data = await response.json();
  if (!Array.isArray(data?.thread?.replies)) {
    return [];
  }

  const result = data.thread.replies as BlueskyAPIReply[];

  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + CACHE_TTL);
  await Cache.set(cacheKey, result, expiryDate);

  return result;
};

const getPost = async (url: string): Promise<BlueskyPost | null> => {
  const cacheKey = `bluesky.post:${md5(url)}`;
  const cached = await Cache.get(cacheKey);
  if (cached) {
    return cached as BlueskyPost;
  }

  const startTime = Date.now();

  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?${new URLSearchParams({
      q: '*',
      url,
      author: BLUESKY_AUTHOR,
      sort: 'top',
    })}`,
  );

  const result = await response.json().then(async (data) => {
    if (data?.posts?.[0]) {
      const replies = await getPostReplies(data.posts[0].uri);
      const post = transformPost(data.posts[0], replies);

      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + CACHE_TTL);
      await Cache.set(cacheKey, post, expiryDate);

      return post;
    }

    return null;
  });

  const elapsed = Date.now() - startTime;
  if (elapsed < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
  }

  return result;
};

export const Bluesky = {
  getPost,
  getPostReplies,
};
