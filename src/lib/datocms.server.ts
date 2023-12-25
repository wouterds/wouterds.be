const DATOCMS_API_ENDPOINT = 'https://graphql.datocms.com/';

type Post = {
  id: string;
  title: string;
  slug: string;
  body: any;
  published_at: string;
};

const GET_POSTS = `
  query {
    _allPostsMeta {
      count
    }
    allPosts {
      id
      title
      slug
      body {
        value
        blocks {
          id
          ... on PostGalleryRecord {
            images { width, height, blurhash, id, url }
          }
        }
      }
      date
    }
  }
`;

export const fetchPosts = async (apiKey: string) => {
  try {
    const response = await fetch(DATOCMS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: GET_POSTS,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const { data } = (await response.json()) as { data: { allPosts: Post[] } };
    console.log(data);

    return data.allPosts || [];
  } catch (e) {
    console.error(e);
  }

  return [];
};
