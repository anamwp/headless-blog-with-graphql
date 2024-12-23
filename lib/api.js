import axios from 'axios';
// import https from 'https';

const API_URL = 'http://anamstarter.local/wp-json/wp/v2';

export const getPosts = async (pageNumber=1, perPage=10) => {
  const response = await axios.get(`${API_URL}/posts`, {
    params: { page: pageNumber, per_page: perPage },
  });
  return response.data;
};


export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const getTags = async () => {
  const response = await axios.get(`${API_URL}/tags`, {
    params: { per_page: 100 },
  });
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