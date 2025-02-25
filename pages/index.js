import { getPosts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export async function getStaticProps() {
  const posts = await getPosts(9, null);
  // console.warn('get static props', posts);
  return { props: { posts } };
}

const RenderData = ( posts ) => {
  // console.log('featured image', featuredImage);
  return posts.data.map((post) => {
    const featuredImage = post.featuredImage ? post.featuredImage.node.sourceUrl : null;
    // console.log('featured image', featuredImage);
    return (
      <li key={post.postId} className='mb-2'>
      <Link className='text-slate-600 text-base hover:text-slate-950 overflow-hidden inline-block rounded-md' href={`/posts/${post.slug}`}>
        {
          featuredImage && <Image priority={true} width={900} height={600} src={featuredImage} alt={post.title} className='w-auto h-auto object-cover rounded-md hover:scale-125 transition-all duration-300' />
        }
      </Link>
      <Link className='text-lg mt-3 inline-block leading-tight text-slate-600 text-base hover:text-slate-950' href={`/posts/${post.slug}`}>{post.title}</Link>
    </li>
    )
  });
}


const Home = () => {

  const [sitePosts, setSitePosts] = useState([]); // Store fetched posts
  // const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // If more posts exist
  const [endCursor, setEndCursor] = useState(null);

  const fetchPosts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await getPosts(100, endCursor);  
      console.log('response', response);
      const postData = response.data;
      // const totalPosts = response.totalPosts;

      setSitePosts((prevPosts) => [...prevPosts, ...postData]);
      // setPage((prevPage) => prevPage + 1);
      setEndCursor(response.pageInfo.endCursor);

      
      if( postData ){
        // if (postData.length < process.env.NEXT_PUBLIC_POSTS_PER_PAGE){
        //   setHasMore(false);
        // }else if( totalPosts == process.env.NEXT_PUBLIC_POSTS_PER_PAGE ){
        //   setHasMore(false)
        // }
        if( response.pageInfo.hasNextPage === true ){
          setHasMore(true);
        }else{
          setHasMore(false);
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
  
  
  // console.log('sitePosts', sitePosts);
  // console.log('get static props', sitePosts);
  // sitePosts.map((post) => {
  //   console.log('post', post.title);
  // })
  return (
    <div>
      <h1 className='text-xl font-medium mb-5'>Blog Posts</h1>
      <ul className='grid grid-cols-1 gap-7 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '>
        <RenderData data={sitePosts} />
      </ul>
      {/* <ul>
        {sitePosts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul> */}
      {hasMore && (
        <div className='mt-10 text-center'>
          <button className="px-5 py-2 border-2 border-slate-500 rounded-sm hover:bg-black hover:text-white hover:border-black transition-all" onClick={fetchPosts} disabled={loading}>
            {loading ? 'Loading...' : 'Show more posts'}
          </button>
        </div>
      )}
      {!hasMore && <p>No more posts to load.</p>}
    </div>
  )
};

export default Home;