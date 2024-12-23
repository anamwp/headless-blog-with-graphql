import axios from 'axios';

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
      <h1>Category: {category.name}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/posts/${post.slug}`}>{post.title.rendered}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;