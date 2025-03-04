import React, { useState } from 'react';
import UserData from './UserData';
import { GraphQLClient, gql } from "graphql-request";
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL; // Your WPGraphQL endpoint

const CREATE_COMMENT_MUTATION = gql`
	mutation CreateComment(
		$postId: Int!
		$parentId: ID
		$authorName: String!
		$authorEmail: String!
		$content: String!
	) {
		createComment(
			input: {
				commentOn: $postId
				parent: $parentId
				author: $authorName
				authorEmail: $authorEmail
				content: $content
			}
		) {
			success
			comment {
				id
				content
				date
				approved
				author {
					node {
						name
					}
				}
				parent {
					node {
						id
					}
				}
			}
		}
	}
`;

const CommentForm = ({ postId, parentId = 0 }) => {
	const [authorName, setAuthorName] = useState('');
	const [authorEmail, setAuthorEmail] = useState('');
	const [content, setContent] = useState('');
	/**
	 * Get user data
	 */
	const userData = UserData();
	/**
	 * Initialize GraphQL client
	 */
	const client = new GraphQLClient(API_URL);
	/**
	 * Handle Comment form submission
	 * @param {*} e - Event
	 */
	const handleSubmit = async (e) => {
		let name = authorName;
    	let email = authorEmail;
		/**
		 * Get the logged in user data
		 */
		if( userData && userData.token ){
			name = userData.user_nicename;
			email = userData.user_email;
		}
		/**
		 * Prevent default form submission
		 */
		e.preventDefault();
		/**
		 * Submit the comment
		 * @see https://www.wpgraphql.com/docs/comments#create-comment
		 */
		try {
			const response = await client.request(CREATE_COMMENT_MUTATION, {
				postId: parseInt(postId, 10),
      			parentId: parentId ? parseInt(parentId, 10) : null,
				authorName: name,
				authorEmail: email,
				content,
			});
			/**
			 * If comment is successfully submitted
			 */
			if( response.createComment.success === true ){
				if( !userData || !userData.token ){
					setAuthorName('');
					setAuthorEmail('');
				}
				setContent('');
				// add message to user
				const commentSubmitStatusDom = document.querySelector('.comment-submit-status');
				commentSubmitStatusDom.classList.add('bg-green-200', 'flex', 'gap-3', 'p-5', 'inline-block', 'w-full', 'rounded', 'mb-5');
				commentSubmitStatusDom.innerHTML = 'Comment submitted successfully. Please wait for approval.';
			}
			// Optionally refresh comments
		} catch (error) {
			console.error('Failed to submit comment:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5 items-start">
			<textarea
				placeholder="Your comment"
				value={content}
				className='rounded border border-1 border-gray-300 block w-full p-3'
				onChange={(e) => setContent(e.target.value)}
				required
			/>
			{
				!userData || !userData.token ? 
					<>
						<input
							type="text"
							placeholder="Your name"
							value={authorName}
							className='rounded border border-1 border-gray-300 block w-full p-3'
							onChange={(e) => setAuthorName(e.target.value)}
							required
						/>
						<input
							type="email"
							placeholder="Your email"
							value={authorEmail}
							className='rounded border border-1 border-gray-300 block w-full p-3'
							onChange={(e) => setAuthorEmail(e.target.value)}
							required
						/>
					</>
				: null
			}
			
			<button className='inline-block px-5 py-2 mb-5 border-2 border-slate-500 rounded-sm hover:bg-black hover:text-white hover:border-black transition-all' type="submit">Submit</button>
		</form>
	);
};

export default CommentForm;