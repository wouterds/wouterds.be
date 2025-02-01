import { Cache } from '~/lib/cache.server';
import { md5 } from '~/lib/crypto.server';

import type { BlueskyAPIReply, BlueskyPost, BlueskyReply } from './types';

const CACHE_TTL = 2; // minutes
const BLUESKY_AUTHOR = 'wouterds.com';

const mapReply = (reply: BlueskyAPIReply, depth: number = 0): BlueskyReply => {
  const [, , did, , rkey] = reply.post.uri.split('/');

  return {
    url: `https://bsky.app/profile/${did}/post/${rkey}`,
    uri: reply.post.uri,
    author: {
      avatarUrl: reply.post.author.avatar,
      displayName: reply.post.author.displayName,
      handle: reply.post.author.handle,
    },
    date: reply.post.record.createdAt,
    text: reply.post.record.text,
    replies: depth < 2 ? reply.replies.map((r) => mapReply(r, depth + 1)) : [],
    counts: {
      replies: reply.post.replyCount,
      reposts: reply.post.repostCount,
      likes: reply.post.likeCount,
      quotes: reply.post.quoteCount,
    },
  };
};

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
      const [, , did, , rkey] = data.posts[0].uri.split('/');

      const replies = await getPostReplies(data.posts[0].uri);
      const result: BlueskyPost = {
        uri: data.posts[0].uri.toString(),
        url: `https://bsky.app/profile/${did}/post/${rkey}`,
        replies: replies.map((r) => mapReply(r, 0)),
        counts: {
          replies: data.posts[0].replyCount,
          reposts: data.posts[0].repostCount,
          likes: data.posts[0].likeCount,
          quotes: data.posts[0].quoteCount,
        },
      };

      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + CACHE_TTL);
      await Cache.set(cacheKey, result, expiryDate);

      return result;
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
