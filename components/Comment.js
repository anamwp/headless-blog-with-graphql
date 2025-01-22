import React from 'react';

const Comment = ({ comment, comments, addReply }) => {
	// filter rootCommnets and find out children comments
	const childComments = comments.filter(c => c.parent === comment.id);
	// console.log( 'singleComment', comment );
	// console.log( 'childComments', childComments );

	return (
		<div style={{ marginLeft: comment.parent ? '20px' : '0px', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
			<div data-comment-id={comment.id}>
				<strong>{comment.author_name} - id {comment.id}</strong>: 
				<div dangerouslySetInnerHTML={{__html: comment.content.rendered}} />
				{/* <a data-comment-reply-id={comment.id} href="#">Reply</a> */}
				<button
					className="text-blue-500 text-sm mt-2"
					onClick={() => {
						const element = document.getElementById('comment-form-wrapper');
						if (element) {
						  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}
						const replyMessageElement = document.querySelector('.reply-to-comment-message');
						if (replyMessageElement) {
							replyMessageElement.innerHTML = `Replying to comment: ${comment.content.rendered}`;
						}
						addReply(comment.id)
					}}
				>
					Reply
				</button>
			</div>
			{childComments.length > 0 && (
				<div>
				{childComments.map(childComment => (
					<Comment key={childComment.id} comment={childComment} comments={comments} addReply={addReply} />
				))}
				</div>
			)}
		</div>
	);
};

const CommentsView = ({ comments, addReply }) => {
	// Find out parent comments
	const rootComments = comments.filter(comment => comment.parent === 0);
	// console.log( 'rootComments', rootComments );

	return (
		<div>
		<h2>Comments</h2>
		{/* Loop through parent comment and show accordingly */}
		{rootComments.map(comment => (
			<Comment key={comment.id} comment={comment} comments={comments} addReply={addReply} />
		))}
		</div>
	);
};

export default CommentsView;