import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticPaths() {
  /**
   * Fetch all posts to generate static pages
   */
  const response = await axios.get(`${API_URL}/posts`, {
    params: { per_page: 10 }, // Adjust as needed for large sites
  });
  /**
   * Generate paths for each post
   */
  const paths = response.data.map((post) => ({
    params: { 
      slug: post.slug,
      id: post.id.toString()
    },
  }));
  debugger;
  /**
   * Return the paths, and set fallback to false to return a 404 if the post doesn't exist
   */
  return { paths, fallback: 'blocking' }; // Generate pages on-demand if not pre-built
}

export async function getStaticProps({params}) {

  console.log('static params', params);
  // console.log('static context', context);
  const { slug } = params;
  // console.log('params of static props', id);
  // console.log('ID of single post', id);

  const siteSettings = {
    siteTitle: 'My Awesome Blog',
    siteDescription: 'A blog about awesome things.',
  };

  const response = await axios.get(`${API_URL}/posts`, {
    params: { slug: slug, _embed: true},
  });

  if (response.data.length === 0) {
    return { notFound: true }; // 404 if the post doesn't exist
  }
  const post = response.data[0];
  const id = post.id;

  // const categoriesResponse = await axios.get(`${API_URL}/categories`);
  const relatedPostsResponse = await axios.get(`${API_URL}/posts`, {
    params: { categories: post.categories[0], exclude: post.id, per_page: 3, _embed: true },
  });
  const relatedPosts = relatedPostsResponse.data;

  // Fetch categories and tags details
  const categoriesResponse = await axios.get(`${API_URL}/categories`, {
    params: { include: post.categories.join(',') }, // Include only the post's categories
  });
  // console.log( 'categoriesResponse', categoriesResponse.data );

  const tagsResponse = await axios.get(`${API_URL}/tags`, {
    params: { include: post.tags.join(',') }, // Include only the post's tags
  });
  // console.log( 'tagsResponse', tagsResponse.data );
  // console.log('relatedPostsResponse', relatedPostsResponse.data);

  // console.log('post', post);

    // Fetch comments for the post
    const commentsResponse = await axios.get(`${API_URL}/comments`, {
      params: { post: id }, // Fetch comments by post ID
    });
    const comments = commentsResponse.data;
    // console.log('comments', comments);

  return {
    props: {
      post: post,
      relatedPosts: relatedPosts,
      siteSettings: siteSettings,
      categories: categoriesResponse.data,
      tags: tagsResponse.data,
      comments: comments,
    },
    revalidate: 10, // Revalidate every 10 seconds
  };
}

const PostPage = ({ post, relatedPosts, categories, tags, comments }) => {
  // console.log('postsssss', post._embedded);
  // console.log('relatedPosts', relatedPosts);
  const featuredImage = post._embedded['wp:featuredmedia'] ? post._embedded['wp:featuredmedia'][0].source_url : null;
  // const relatedFeaturedImage = relatedPosts._embedded['wp:featuredmedia'] ? relatedPosts._embedded['wp:featuredmedia'][0].source_url : null;
  // console.log('comments', comments);

  const Comment = ({ comment, comments }) => {
    // filter rootCommnets and find out children comments
    const childComments = comments.filter(c => c.parent === comment.id);
    // console.log( 'singleComment', comment );
    // console.log( 'childComments', childComments );
  
    return (
      <div style={{ marginLeft: comment.parent ? '20px' : '0px', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
        <div>
          <strong>{comment.author_name}</strong>: 
          <div dangerouslySetInnerHTML={{__html: comment.content.rendered}} />
        </div>
        {childComments.length > 0 && (
          <div>
            {childComments.map(childComment => (
              <Comment key={childComment.id} comment={childComment} comments={comments} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const Comments = ({ comments }) => {
    // Find out parent comments
    const rootComments = comments.filter(comment => comment.parent === 0);
    // console.log( 'rootComments', rootComments );
  
    return (
      <div>
        <h2>Comments</h2>
        {/* Loop through parent comment and show accordingly */}
        {rootComments.map(comment => (
          <Comment key={comment.id} comment={comment} comments={comments} />
        ))}
      </div>
    );
  };


  return (
    <div className="container max-w-screen-md mx-auto my-10 inline-block">
      <Link className='inline-block px-5 py-2 mb-5 border-2 border-slate-500 rounded-sm hover:bg-black hover:text-white hover:border-black transition-all' href="/">Back</Link>
      <h2 className='text-2xl my-5 font-medium mb-2'>{post.title.rendered}</h2>
      <div className="meta flex align-middle justify-between">
          {/* author */}
          <span className='text-sm text-slate-600'>By {post._embedded.author[0].name}</span>
          {/* date */}
          <span className='text-sm text-slate-600'>Published on {new Date(post.date).toDateString()}</span>
      </div>
      {/* <p className='text-sm text-slate-600'>Published on {new Date(post.date).toDateString()}</p> */}
      {/* show featured image */}
      {
        featuredImage && <Image width={900} height={600} src={featuredImage} alt={post.title.rendered} className='mt-7 w-full h-auto mb-5 object-cover rounded-md' />
      }
      <div className='flex flex-col gap-5' dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
  
      <h2 className='text-2xl my-5 font-medium mt-10'>Categories</h2>
      <ul className='flex flex-wrap gap-2'>
        {categories.map((category) => (
          <li key={category.id}>
            <Link className='bg-slate-200 px-3 py-1 rounded-md hover:bg-slate-300 transition-all capitalize text-sm' href={`/category/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
  
      <h2 className='text-2xl my-5 font-medium mt-10'>Tags</h2>
      <ul className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link className='bg-slate-200 px-3 py-1 rounded-md hover:bg-slate-300 transition-all capitalize text-sm' href={`/tag/${tag.slug}`}>
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <Comments comments={comments} />
      </div>
      { relatedPosts.length > 0 &&
      <div className='mt-10'>
        <h2 className='text-2xl my-5 font-medium'>Related Posts</h2>
        <ul className='grid grid-cols-3 gap-5'>
          {relatedPosts.map((relatedPost) => {
            const relatedFeaturedImage = relatedPost._embedded['wp:featuredmedia'] ? relatedPost._embedded['wp:featuredmedia'][0].source_url : null;
            return (
              <li key={relatedPost.id} className='mb-1'>
                <Link className='overflow-hidden inline-block rounded-md' href={`/posts/${relatedPost.slug}`}>
                {
                  relatedFeaturedImage && <Image width={900} height={600} src={relatedFeaturedImage} alt={relatedPost.title.rendered} className='w-auto h-auto object-cover rounded-md hover:scale-125 transition-all duration-300' />
                }
                </Link>
                <Link className='text-lg mt-3 inline-block leading-tight text-slate-600 text-base hover:text-slate-950' href={`/posts/${relatedPost.slug}`}>{relatedPost.title.rendered}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      }
  
    </div>
  );
}

export default PostPage;