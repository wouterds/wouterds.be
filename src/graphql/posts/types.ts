import type { PostRepository } from './repository.server';

export type Post = NonNullable<Awaited<ReturnType<PostRepository['getPosts']>>>[number];
