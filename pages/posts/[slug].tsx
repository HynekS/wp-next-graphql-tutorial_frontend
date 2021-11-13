import Link from "next/link";

import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { getAllPostsWithSlug, getPost } from "../../lib/api";

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  let { title, date, content } = post ?? {};

  return (
    <div>
      <Link href="/">Back to Homepage</Link>
      <h1>{title}</h1>
      {date && <time dateTime={date}>{new Date(date).toDateString()}</time>}
      <div dangerouslySetInnerHTML={{ __html: content ?? "" }}></div>
    </div>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const slug = String(context.params?.slug);
  const post = await getPost(slug);
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const allPostsWithSlug = await getAllPostsWithSlug();
  return {
    paths: allPostsWithSlug?.nodes?.map((node) => `/posts/${node?.slug}`) ?? [],
    fallback: false,
  };
}

export default Post;
