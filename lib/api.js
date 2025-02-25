import axios from 'axios';
// import https from 'https';
import { GraphQLClient, gql } from 'graphql-request';


// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = 'https://anamstarter.local/graphql';
const POSTS_PER_PAGE = 9;
// Initialize GraphQL Client
const graphQLClient = new GraphQLClient(API_URL);

// export const getPosts = async (pageNumber=1, perPage=process.env.NEXT_PUBLIC_POSTS_PER_PAGE) => {
//   // const response = await axios.get(`${API_URL}/posts`, {
//   //   params: { page: pageNumber, per_page: perPage, _embed: true },
//   // });
//   const response = await axios.get(`${API_URL}/posts`, {
//     params: { page: pageNumber, per_page: perPage, _embed: true },
//   });
//   // Extract total posts from the headers
//   const totalPosts = parseInt(response.headers['x-wp-total']);
//   // console.log('Total Posts:', totalPosts);
//   // console.log('response', response);
//   return {
//     'totalPosts': totalPosts,
//     'data': response.data
//   };
// };

// Generic function to handle GraphQL queries
const fetchGraphQL = async (query, variables = {}) => {
  // console.log('variables', variables);
  try {
    return await graphQLClient.request(query, variables);
  } catch (error) {
    console.error('GraphQL Error:', error);
    return null;
  }
};

// Fetch paginated posts
export const getPosts = async (first = POSTS_PER_PAGE, after = null) => {
  // console.log('pageNumber', pageNumber, 'perPage', perPage);
  const query = gql`
    query GetPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          postId
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  // const variables = {
  //   perPage,
  //   offset: (pageNumber - 1) * perPage
  // };
  const variables = { first, after };

  const data = await fetchGraphQL(query, variables);
  // console.log('dataaaa', data);
  return {
    endCursor: data?.posts?.pageInfo?.endCursor || null,
    data: data?.posts?.nodes || [],
    pageInfo: data?.posts?.pageInfo || {}
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