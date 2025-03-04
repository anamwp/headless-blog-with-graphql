import axios from 'axios';
// import https from 'https';
import { GraphQLClient, gql } from 'graphql-request';
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const POSTS_PER_PAGE = 9;
// Initialize GraphQL Client
const graphQLClient = new GraphQLClient(API_URL);

// Generic function to handle GraphQL queries
const fetchGraphQL = async (query, variables = {}) => {
    try {
        return await graphQLClient.request(query, variables);
    } catch (error) {
        console.error('GraphQL Error:', error);
        return null;
    }
};

// Fetch paginated posts
export const getPosts = async (first = POSTS_PER_PAGE, after = null) => {
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
    const variables = { first, after };
    const data = await fetchGraphQL(query, variables);
    return {
        endCursor: data?.posts?.pageInfo?.endCursor || null,
        data: data?.posts?.nodes || [],
        pageInfo: data?.posts?.pageInfo || {}
    };
};


export const getCategories = async () => {
	const catQuery = gql`
		query CatQuery {
			categories {
				edges {
					node {
						slug
						termTaxonomyId
						name
						
					}
				}
			}
		}
	`;
	const catQueryResponse = await fetchGraphQL(catQuery);
	return catQueryResponse.categories.edges;
};

export const getTags = async () => {
	const tagQuery = gql`
		query TagQuery {
			tags {
				edges {
					node {
						slug
						termTaxonomyId
						name
					}
				}
			}
		}
	`;
	const tagQueryResponse = await fetchGraphQL(tagQuery);
	return tagQueryResponse.tags.edges;
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