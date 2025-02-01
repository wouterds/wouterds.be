import clsx from 'clsx';
import { format } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import type { BlueskyReply } from '~/lib/bluesky/types';

export type CommentProps = BlueskyReply & {
  level?: number;
  uri: string;
};

export const Comment = ({ author, date, text, replies, level = 0, uri }: CommentProps) => {
  return (
    <>
      <div
        className={clsx('group relative flex gap-4 py-4', {
          'pt-0': level > 0,
          'pl-8': level === 1,
          'pl-16': level === 2,
        })}>
        <Avatar>
          <AvatarImage src={author.avatarUrl} alt={author.displayName} />
          <AvatarFallback>{author.displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 leading-tight">
            <span className="font-medium text-gray-900">{author.displayName}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={`https://bsky.app/profile/${author.handle}/post/${uri.split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal text-gray-500 no-underline hover:underline">
                    {format(date, 'MMM d, yyyy')}
                  </a>
                </TooltipTrigger>
                <TooltipContent>{format(date, 'MMMM do yyyy, HH:mm')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="mt-1 text-gray-700">{text}</p>
        </div>
      </div>
      {replies.map((reply) => (
        <Comment key={reply.uri} {...reply} level={level + 1} />
      ))}
    </>
  );
};
