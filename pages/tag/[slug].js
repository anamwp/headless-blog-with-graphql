import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticPaths() {
  // Fetch all tags
  const response = await axios.get(`${API_URL}/tags`);
  const tags = response.data;

  // Create paths for each tag
  const paths = tags.map((tag) => ({
    params: { slug: tag.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate pages on demand if not pre-built
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    // Fetch tag details by slug
    const tagResponse = await axios.get(`${API_URL}/tags`, {
      params: { slug },
    });

    const tag = tagResponse.data[0];

    if (!tag) {
      return { notFound: true };
    }

    // Fetch posts with this tag
    const postsResponse = await axios.get(`${API_URL}/posts`, {
      params: { tags: tag.id, per_page: process.env.NEXT_PUBLIC_POSTS_PER_PAGE, _embed: true },
    });

    return {
      props: {
        tag,
        posts: postsResponse.data,
      },
    };
  } catch (error) {
    console.error('Error fetching tag or posts:', error);
    return { notFound: true };
  }
}

const TagPage = ({ tag, posts }) => {
  return (
    <div>
      <h2 className='text-2xl my-5 font-medium'>Tag: {tag.name}</h2>
      <ul className='grid grid-cols-1 gap-7 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => {
          const featuredImage = post._embedded['wp:featuredmedia'] ? post._embedded['wp:featuredmedia'][0].source_url : null;
          return (
            <li key={post.id} className='mb-1'>
              <Link className='text-slate-600 text-base hover:text-slate-950 overflow-hidden inline-block rounded-md' href={`/posts/${post.slug}`}>
                {
                  featuredImage && <Image width={900} height={600} src={featuredImage} alt={post.title.rendered} className='w-auto h-auto object-cover rounded-md hover:scale-125 transition-all duration-300' />
                }
              </Link>
            <Link className="inline-block capitalize text-slate-600 text-base hover:text-slate-950" href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
          </li>
          )
        })}
      </ul>
    </div>
  );
};

export default TagPage;