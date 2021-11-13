import Link from "next/link";

import type { InferGetStaticPropsType } from "next";

import { getLatestPosts } from "./../lib/api";

const Home = ({
  latestPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { nodes } = latestPosts ?? {};

  return (
    <div>
      <h1>Our Wordpress/Next app Home Page</h1>
      <ul>
        {nodes?.map((node) => (
          <div key={node?.slug}>
            <Link href={"posts/" + node?.slug}>{node?.title}</Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const latestPosts = await getLatestPosts();

  return {
    props: {
      latestPosts,
    },
  };
}

export default Home;
