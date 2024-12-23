import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticPaths() {
  console.log('getStaticPaths');
  // const response = await axios.get(`${API_URL}/posts`, {
  //   params: { per_page: 10 }, // Adjust as needed for large sites
  // });

  // // response.data.map( post => {
  // //   // console.log('post', post.title.rendered);
  // // } )

  // const paths = response.data.map((post) => ({
  //   params: { slug: post.slug },
  // }));
  // console.log('paths', paths);

  return { paths: [], fallback: 'blocking' }; // Generate pages on-demand if not pre-built
  // return { paths, fallback: 'true' }; // Generate pages on-demand if not pre-built
}

export async function getStaticProps(context) {
  console.log('static context', context);
  const { params } = context;
  console.log('params of static props', params);

  const siteSettings = {
    siteTitle: 'My Awesome Blog',
    siteDescription: 'A blog about awesome things.',
  };

  const response = await axios.get(`${API_URL}/posts`, {
    params: { slug: params.slug },
  });

  if (response.data.length === 0) {
    return { notFound: true }; // 404 if the post doesn't exist
  }
  const post = response.data[0];

  // const categoriesResponse = await axios.get(`${API_URL}/categories`);
  const relatedPostsResponse = await axios.get(`${API_URL}/posts`, {
    params: { categories: post.categories[0], exclude: post.id, per_page: 3 },
  });

  // Fetch categories and tags details
  const categoriesResponse = await axios.get(`${API_URL}/categories`, {
    params: { include: post.categories.join(',') }, // Include only the post's categories
  });
  // console.log( 'categoriesResponse', categoriesResponse.data );

  const tagsResponse = await axios.get(`${API_URL}/tags`, {
    params: { include: post.tags.join(',') }, // Include only the post's tags
  });
  // console.log( 'tagsResponse', tagsResponse.data );
  // console.log('relatedPostsResponse', relatedPostsResponse);

  // console.log('post', post);

  return {
    props: {
      post: post,
      relatedPosts: relatedPostsResponse.data,
      siteSettings: siteSettings,
      categories: categoriesResponse.data,
      tags: tagsResponse.data,
    },
    revalidate: 10, // Revalidate every 10 seconds
  };
}

const PostPage = ({ post, relatedPosts, categories, tags }) => (
  <div>
    <Link href="/">Back</Link>
    <h1>{post.title.rendered}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

    <h2>Categories</h2>
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`/category/${category.slug}`}>
            {category.name}
          </Link>
        </li>
      ))}
    </ul>

    <h2>Tags</h2>
    <ul>
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link href={`/tag/${tag.slug}`}>
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>

    <h2>Related Posts</h2>
    <ul>
      {relatedPosts.map((relatedPost) => (
        <li key={relatedPost.id}>
          <a href={`/posts/${relatedPost.slug}`}>{relatedPost.title.rendered}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default PostPage;