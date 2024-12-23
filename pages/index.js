import { getPosts } from '@/lib/api';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export async function getStaticProps() {
  const posts = await getPosts(1, 10);
  // console.warn('get static props', posts);
  return { props: { posts } };
}

const RenderData = ( posts ) => {
  return posts.data.map((post) => (
    <li key={post.id}>
      <Link href={`/posts/${post.slug}`}> {post.id} -  {post.title.rendered}</Link>
    </li>
  ));
}


const Home = ({ posts }) => {

  const [sitePosts, setSitePosts] = useState([]); // Store fetched posts
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // If more posts exist

  useEffect(() => {
    fetchPosts(); // Load initial posts
    // setSitePosts((prevPosts) => [...prevPosts, ...response.data]);
  }, []);
  
  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      console.log('page', page);
      const response = await getPosts(page, 50);
      console.log('response.data', response);
      setSitePosts((prevPosts) => [...prevPosts, ...response]);
      setPage((prevPage) => prevPage + 1);
      if( response ){
        if (response.length < 50) setHasMore(false); // If less than 5 posts, no more to load
      }
      // console.log('sitePosts', sitePosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }
  console.log('sitePosts', sitePosts);
  // console.log('get static props', sitePosts);
  // sitePosts.map((post) => {
  //   console.log('post', post.title.rendered);
  // })
  return (
    <div>
      <h1>Blog Posts</h1>
      <p>Posts will be rendered here</p>
      <RenderData data={sitePosts} />
      {/* <ul>
        {sitePosts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
          </li>
        ))}
      </ul> */}
      {hasMore && (
        <button onClick={fetchPosts} disabled={loading}>
          {loading ? 'Loading...' : 'Show more posts'}
        </button>
      )}
      {!hasMore && <p>No more posts to load.</p>}
    </div>
  )
};

export default Home;