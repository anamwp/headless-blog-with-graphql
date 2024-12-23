
import { useEffect, useState } from 'react';
import { getTags } from '@/lib/api';
import Link from 'next/link';


export default function Tag() {

	const [loading, setLoading] = useState(false); // Loading state for button
	const [siteTags, setSiteTags] = useState([]); // Store fetched categories


	useEffect(() => {
		fetchTags();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchTags = async () => {
		if (loading) return;
		setLoading(true);
		try {
		  const response = await getTags();
		  if (response.length < 1){
			setSiteTags([]);
		  }else{
			setSiteTags(response);
		  }
		} catch (error) {
		  console.error('Error fetching tags:', error);
		} finally {
		  setLoading(false);
		}
	}

	console.log('siteTags', siteTags.length);



	return (
		<div>
			<h1>Tags</h1>
			<p>Tag page content</p>
			<p>{ siteTags.length < 1 ? 'No tags found' : '' }</p>
			{
				loading ? 'Loading tags...' : (
					siteTags && <ul>
						{siteTags.map((tag) => (
							<li key={tag.id}>
								<Link href={`/tag/${tag.slug}`}>
									{tag.name}
								</Link>
							</li>
						))}
					</ul>
				)
			}
		</div>
	);
}