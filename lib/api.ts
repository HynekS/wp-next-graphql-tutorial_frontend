import type {
  LatestPostsQueryVariables,
  LatestPostsQuery,
  AllPostsWithSlugQueryVariables,
  AllPostsWithSlugQuery,
  PostQueryVariables,
  PostQuery,
} from "../generated/graphql";

type Query = LatestPostsQuery | AllPostsWithSlugQuery | PostQuery;

type Options = {
  variables?:
    | LatestPostsQueryVariables
    | AllPostsWithSlugQueryVariables
    | PostQueryVariables;
};

const API_URL = "http://127.0.0.1/wp/graphql";

export async function fetchAPI<T extends Query>(
  query: string,
  { variables }: Options = {}
): Promise<T> {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.log(json.errors);
    console.log("error details", query, variables);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getLatestPosts() {
  const data = await fetchAPI<LatestPostsQuery>(/* GraphQL */ `
    query LatestPosts {
      posts {
        nodes {
          title
          slug
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPostsWithSlug() {
  const data: AllPostsWithSlugQuery =
    await fetchAPI<AllPostsWithSlugQuery>(/* GraphQL */ `
      query AllPostsWithSlug {
        posts(first: 100) {
          nodes {
            slug
          }
        }
      }
    `);
  return data?.posts;
}

export async function getPost(slug: PostQueryVariables["id"]) {
  const data: PostQuery = await fetchAPI<PostQuery>(
    /* GraphQL */ `
      query Post($id: ID!) {
        post(id: $id, idType: SLUG) {
          content
          date
          title
        }
      }
    `,
    {
      variables: {
        id: slug,
      },
    }
  );

  return data?.post;
}
