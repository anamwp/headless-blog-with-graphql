import axios from 'axios';
// import https from 'https';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPosts = async (pageNumber=1, perPage=process.env.NEXT_PUBLIC_POSTS_PER_PAGE) => {
  const response = await axios.get(`${API_URL}/posts`, {
    params: { page: pageNumber, per_page: perPage, _embed: true },
  });
  // Extract total posts from the headers
  const totalPosts = parseInt(response.headers['x-wp-total']);
  // console.log('Total Posts:', totalPosts);
  // console.log('response', response);
  return {
    'totalPosts': totalPosts,
    'data': response.data
  };
};


export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const getTags = async () => {
  const response = await axios.get(`${API_URL}/tags`);
  return response.data;
};

export const getPostBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/posts?slug=${slug}`);
    // WordPress REST API returns an array, so get the first item
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};