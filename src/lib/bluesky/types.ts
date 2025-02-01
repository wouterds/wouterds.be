export interface BlueskyAPIAuthor {
  avatar: string;
  displayName: string;
  handle: string;
}

export interface BlueskyAPIRecord {
  createdAt: string;
  text: string;
}

export interface BlueskyAPIPost {
  post: {
    uri: string;
    author: BlueskyAPIAuthor;
    record: BlueskyAPIRecord;
    replyCount: number;
    repostCount: number;
    likeCount: number;
    quoteCount: number;
  };
}

export interface BlueskyAPIReply extends BlueskyAPIPost {
  replies: BlueskyAPIReply[];
}

export interface BlueskyAuthor {
  avatarUrl: string;
  displayName: string;
  handle: string;
}

export interface BlueskyReply {
  url: string;
  uri: string;
  author: BlueskyAuthor;
  date: string;
  text: string;
  replies: BlueskyReply[];
  counts: {
    replies: number;
    reposts: number;
    likes: number;
    quotes: number;
  };
}

export interface BlueskyPost {
  uri: string;
  url: string;
  replies: BlueskyReply[];
  counts: {
    replies: number;
    reposts: number;
    likes: number;
    quotes: number;
  };
}
