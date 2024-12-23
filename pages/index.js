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
      <Link href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
    </li>
  ));
}


const Home = () => {

  const [sitePosts, setSitePosts] = useState([]); // Store fetched posts
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // If more posts exist

  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getPosts(page, process.env.NEXT_PUBLIC_POSTS_PER_PAGE);
      console.log('response', response);
      const postData = response.data;
      const totalPosts = response.totalPosts;

      setSitePosts((prevPosts) => [...prevPosts, ...postData]);
      setPage((prevPage) => prevPage + 1);
      
      if( postData ){
        if (postData.length < process.env.NEXT_PUBLIC_POSTS_PER_PAGE){
          setHasMore(false);
        }else if( totalPosts == process.env.NEXT_PUBLIC_POSTS_PER_PAGE ){
          setHasMore(false)
        }
      }

    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Load initial posts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  
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