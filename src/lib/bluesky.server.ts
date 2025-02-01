import { Cache } from './cache.server';
import { md5 } from './crypto.server';

const author = 'wouterds.com';
const CACHE_TTL = 5; // minutes

type BlueskyThreadReply = {
  uri: string;
  post: {
    author: {
      avatar: string;
      displayName: string;
      handle: string;
    };
    record: {
      createdAt: string;
      text: string;
    };
  };
};

type BlueskyPost = {
  uri: string;
  url: string;
  replies: {
    uri: string;
    author: {
      avatarUrl: string;
      displayName: string;
      handle: string;
    };
    date: string;
    text: string;
  }[];
};

const getPost = async (url: string): Promise<BlueskyPost | null> => {
  // Try to get from cache first
  const cacheKey = md5(`bluesky:post:${url}`);
  const cached = await Cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?${new URLSearchParams({
      q: '*',
      url,
      author,
      sort: 'top',
    })}`,
  );

  return response.json().then(async (data) => {
    if (data?.posts?.[0]) {
      const [, , did, , rkey] = data.posts[0].uri.split('/');

      const replies = await getThread(data.posts[0].uri);
      const result: BlueskyPost = {
        uri: data.posts[0].uri.toString(),
        url: `https://bsky.app/profile/${did}/post/${rkey}`,
        replies: replies.map((reply: BlueskyThreadReply) => ({
          uri: reply.uri,
          author: {
            avatarUrl: reply.post.author.avatar,
            displayName: reply.post.author.displayName,
            handle: reply.post.author.handle,
          },
          date: reply.post.record.createdAt,
          text: reply.post.record.text,
        })),
      };

      // Cache the result
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + CACHE_TTL);
      await Cache.set(cacheKey, result, expiryDate);

      return result;
    }

    return null;
  });
};

const getThread = async (atUri: string): Promise<BlueskyThreadReply[]> => {
  // Try to get from cache first
  const cacheKey = md5(`bluesky:thread:${atUri}`);
  const cached = await Cache.get(cacheKey);
  if (cached) {
    return cached;
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

  const result = data.thread.replies as BlueskyThreadReply[];

  // Cache the result
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + CACHE_TTL);
  await Cache.set(cacheKey, result, expiryDate);

  return result;
};

export const Bluesky = {
  getPost,
  getThread,
};
