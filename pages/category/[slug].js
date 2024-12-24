import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticPaths() {
  // Fetch all categories
  const response = await axios.get(`${API_URL}/categories`);
  const categories = response.data;

  // Create paths for each category
  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate pages on demand if not pre-built
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    // Fetch category details by slug
    const categoryResponse = await axios.get(`${API_URL}/categories`, {
      params: { slug },
    });

    const category = categoryResponse.data[0];

    if (!category) {
      return { notFound: true };
    }

    // Fetch posts in this category
    const postsResponse = await axios.get(`${API_URL}/posts`, {
      params: { categories: category.id, per_page: 10 },
    });

    return {
      props: {
        category,
        posts: postsResponse.data,
      },
    };
  } catch (error) {
    console.error('Error fetching category or posts:', error);
    return { notFound: true };
  }
}

const CategoryPage = ({ category, posts }) => {
  return (
    <div>
      <h2 className='text-2xl my-5 font-medium'>Category: {category.name}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className='mb-1'>
            <Link className="capitalize text-slate-600 text-base hover:text-slate-950" href={`/posts/${post.slug}`}>{post.title.rendered}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;