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
}

export interface BlueskyPost {
  uri: string;
  url: string;
  replies: BlueskyReply[];
}
