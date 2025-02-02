import type { BlueskyAPIPost, BlueskyAPIReply, BlueskyPost, BlueskyReply } from './types';

export const transformReply = (reply: BlueskyAPIReply, depth: number = 0): BlueskyReply => {
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
    replies: depth < 2 ? reply.replies.map((r) => transformReply(r, depth + 1)) : [],
    counts: {
      replies: reply.post.replyCount,
      reposts: reply.post.repostCount,
      likes: reply.post.likeCount,
      quotes: reply.post.quoteCount,
    },
  };
};

export const transformPost = (
  post: BlueskyAPIPost['post'],
  replies: BlueskyAPIReply[] = [],
): BlueskyPost => {
  const [, , did, , rkey] = post.uri.split('/');

  return {
    uri: post.uri,
    url: `https://bsky.app/profile/${did}/post/${rkey}`,
    replies: replies.map((r) => transformReply(r, 0)),
    counts: {
      replies: post.replyCount,
      reposts: post.repostCount,
      likes: post.likeCount,
      quotes: post.quoteCount,
    },
  };
};
