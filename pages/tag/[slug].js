import axios from 'axios';

const API_URL = 'http://anamstarter.local/wp-json/wp/v2';

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
      params: { tags: tag.id, per_page: 10 },
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
      <h1>Tag: {tag.name}</h1>
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

export default TagPage;