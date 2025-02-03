import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router';

import { BlueskyIcon } from '~/components/icons/bluesky';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Skeleton } from '~/components/ui/skeleton';
import type { BlueskyPost, BlueskyReply } from '~/lib/bluesky/types';

import { Comment } from './comment';

export const CommentSkeleton = () => {
  return (
    <div className="group relative flex gap-4 py-4">
      <Avatar>
        <AvatarFallback>
          <Skeleton className="h-full w-full rounded-full" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-3 space-y-2 pb-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
    </div>
  );
};

export const CommentThread = ({ reply }: { reply: BlueskyReply }) => {
  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 first:border-t-0">
      <Comment {...reply} />
    </div>
  );
};

export const Comments = () => {
  const { blueskyPost } = useLoaderData<{ blueskyPost: Promise<BlueskyPost | null> }>();

  return (
    <Suspense
      fallback={
        <div className="mt-12 sm:mt-16 pt-0 sm:pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="mb-3">
            Join the conversation by{' '}
            <span className="font-medium text-zinc-500 dark:text-zinc-400">
              replying on Bluesky{' '}
              <BlueskyIcon
                size={18}
                className="text-zinc-400 dark:text-zinc-500 hidden sm:inline-block align-text-bottom ml-1"
              />
            </span>
          </p>

          <div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 first:border-t-0">
              <CommentSkeleton />
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800">
              <CommentSkeleton />
            </div>
          </div>
        </div>
      }>
      <Await resolve={blueskyPost}>
        {(post) => {
          if (!post?.uri) {
            return null;
          }

          return (
            <div className="mt-12 sm:mt-16 pt-0 sm:pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold">Comments</h2>
              <p className="mb-3">
                Join the conversation by{' '}
                <span>
                  <a href={post.url} target="_blank" rel="noreferrer">
                    replying on Bluesky
                  </a>{' '}
                  <BlueskyIcon
                    size={18}
                    className="text-blue-600 dark:text-blue-500 hidden sm:inline-block align-text-bottom ml-1"
                  />
                </span>
              </p>

              <div>
                {post.replies.map((reply) => (
                  <CommentThread key={reply.uri} reply={reply} />
                ))}
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
};
