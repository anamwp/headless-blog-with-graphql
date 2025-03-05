import Link from 'next/link';
import Image from 'next/image';

import { GraphQLClient, gql } from "graphql-request";
const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL; // Your WPGraphQL endpoint

// Get categories query
const GET_CATEGORIES = gql`
	query GET_CATEGORIES {
		categories {
			nodes {
				id
				name
				slug
			}
		}
	}
`;
// get categories by slug
const GET_CATEGORY_DETAILS_BY_SLUG = gql`
	query GET_CATEGORY($slug: ID!) {
		category(id: $slug, idType: SLUG) {
			id
			name
			slug
			categoryId
			count
			description
			taxonomyName
			uri
			link
		}
	}
`;
// get posts by category slug
const GET_POSTS_BY_CATEGORY_SLUG = gql`
	query GET_POSTS_BY_CATEGORY_SLUG($catSlug: ID!) {
		category(id: $catSlug, idType: SLUG) {
			posts {
				nodes {
					id
					postId
					title
					slug
					date
					uri
					featuredImage {
						node {
							sourceUrl
						}
					}
				}
			}
		}
	}
`;

const client = new GraphQLClient(GRAPHQL_API_URL);


export async function getStaticPaths() {
	// Fetch all categories
	const graphqlCategoryListResponse = await client.request(GET_CATEGORIES);
	const categories = graphqlCategoryListResponse.categories.nodes;

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
		const graphqlCategoryResponse = await client.request(GET_CATEGORY_DETAILS_BY_SLUG, {
			slug: slug,
		});
		const category = graphqlCategoryResponse.category;
		if (!category) {
			return { notFound: true };
		}

		// Fetch posts in this category
		const graphqlPostsResponse = await client.request(GET_POSTS_BY_CATEGORY_SLUG, {
			catSlug: slug,
		});

		return {
			props: {
				category,
				posts: graphqlPostsResponse.category.posts.nodes,
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
		<ul className='grid grid-cols-1 gap-7 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
			{posts.map((post) => {
			const featuredImage = post.featuredImage ? post.featuredImage.node.sourceUrl : null;
			return (
				<li key={post.id} className='mb-1'>
				<Link className='text-slate-600 text-base hover:text-slate-950 overflow-hidden inline-block rounded-md' href={`/posts/${post.slug}`}>
					{
					featuredImage && <Image width={900} height={600} src={featuredImage} alt={post.title} className='w-auto h-auto object-cover rounded-md hover:scale-125 transition-all duration-300' />
					}
				</Link>
				<Link className="inline-block capitalize text-slate-600 text-base hover:text-slate-950" href={`/posts/${post.slug}`}>{post.title}</Link>
				</li>
			)
			})}
		</ul>
		</div>
	);
};

export default CategoryPage;