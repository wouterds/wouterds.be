import { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/posts';
import { PostRepository } from '~/graphql/posts/repository';

export const loader = async () => {
  const posts = await new PostRepository().getPosts(100);

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

  return <Posts posts={data.posts} />;
}
