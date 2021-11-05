// @ts-nocheck
import Link from "next/link";

import { getAllPostsWithSlug, getPost } from "../../lib/api";

const Post = ({ post }) => {
  return (
    <div>
      <Link href="/">Back to Homepage</Link>
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{new Date(post.date).toDateString()}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  );
};

export async function getStaticProps(context) {
  const { slug } = context.params;
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
    // map over a list of fetched slugs and return a relative url that will be recognized by Next
    paths: allPostsWithSlug.nodes.map((node) => `/posts/${node.slug}`) || [],
    fallback: false,
  };
}

export default Post;
