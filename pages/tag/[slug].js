import Link from 'next/link';
import Image from 'next/image';

import { GraphQLClient, gql } from "graphql-request";
const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL; // Your WPGraphQL endpoint

// Get categories query
const GET_TAGS = gql`
	query GET_TAGS {
		tags {
			nodes {
				id
				name
				slug
			}
		}
	}
`;
// get categories by slug
const GET_TAG_DETAILS_BY_SLUG = gql`
	query GET_TAG($slug: ID!) {
		tag(id: $slug, idType: SLUG) {
			id
			name
			slug
			tagId
			count
			description
			taxonomyName
			uri
			link
		}
	}
`;

// get posts by category slug
const GET_POSTS_BY_TAG_SLUG = gql`
	query GET_POSTS_BY_TAG_SLUG($tagSlug: ID!) {
		tag(id: $tagSlug, idType: SLUG) {
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
  	// Fetch all tags
	const graphqlTagListResponse = await client.request(GET_TAGS);
	const tags = graphqlTagListResponse.tags.nodes;


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
		const graphqlTagResponse = await client.request(GET_TAG_DETAILS_BY_SLUG, {
			slug: slug,
		});
		const tag = graphqlTagResponse.tag;
		if (!tag) {
			return { notFound: true };
		}

		// Fetch posts with this tag
		const graphqlPostsResponse = await client.request(GET_POSTS_BY_TAG_SLUG, {
			tagSlug: slug,
		});

		return {
			props: {
				tag,
				posts: graphqlPostsResponse.tag.posts.nodes,
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
		<h2 className='text-2xl my-5 font-medium'>Tag: {tag.name}</h2>
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

export default TagPage;