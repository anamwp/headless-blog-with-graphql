import { getPosts, getPostBySlug } from '@/lib/api';
import Link from 'next/link';

export async function getStaticPaths() {
  console.log('getStaticPaths');
  const posts = await getPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('params', params);
  const post = await getPostBySlug(params.slug);
  return { props: { post } };
}

const PostPage = ({ post }) => (
  <div>
    <Link href="/">Back</Link>
    <h1>{post.title.rendered}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
  </div>
);

export default PostPage;