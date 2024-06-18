import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/posts';
import { Post, PostRepository } from '~/data/repositories/post-repository';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const posts = await PostRepository.create(context).getPosts(100);

  return { posts };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Blog' },
    {
      name: 'description',
      content:
        'My personal blog where I write about software development, side projects, travel, and other random stuff that I find interesting.',
    },
  ];
};

export default function Blog() {
  const data = useLoaderData<typeof loader>();
  const posts = data.posts as Post[]; // Remix single fetch typing issues

  return <Posts posts={posts} />;
}
