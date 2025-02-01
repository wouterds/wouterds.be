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
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
    </div>
  );
};

export const CommentThread = ({ reply }: { reply: BlueskyReply }) => {
  return (
    <div className="border-t border-gray-200 first:border-t-0">
      <Comment {...reply} />
    </div>
  );
};

export const Comments = () => {
  const { blueskyPost } = useLoaderData<{ blueskyPost: Promise<BlueskyPost | null> }>();

  return (
    <Suspense
      fallback={
        <div className="mt-16 border-t border-gray-200 pt-4">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="mb-6">
            Join the conversation by{' '}
            <span className="inline-flex items-center gap-2">
              <span className="text-gray-500">replying on Bluesky</span>
              <BlueskyIcon size={18} className="text-gray-400" />
            </span>
          </p>

          <div>
            <div className="border-t border-gray-200 first:border-t-0">
              <CommentSkeleton />
            </div>
            <div className="border-t border-gray-200">
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
            <div className="mt-16 border-t border-gray-200 pt-4">
              <h2 className="text-2xl font-bold">Comments</h2>
              <p className="mb-6">
                Join the conversation by{' '}
                <span className="inline-flex items-center gap-2">
                  <a href={post.url} target="_blank" rel="noreferrer">
                    replying on Bluesky
                  </a>
                  <BlueskyIcon size={18} className="text-blue-600" />
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
