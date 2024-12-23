
import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import Link from 'next/link';


export default function Category() {

	const [loading, setLoading] = useState(false); // Loading state for button
	const [siteCategories, setSiteCategories] = useState([]); // Store fetched categories


	useEffect(() => {
		fetchCategories();
	});

	console.log('siteCategories', siteCategories);


	const fetchCategories = async () => {
		if (loading) return;
		setLoading(true);
		try {
		  const response = await getCategories();
		  if (response.length < 1){
			setSiteCategories([]);
		  }else{
			setSiteCategories(response);
		  }
		} catch (error) {
		  console.error('Error fetching categories:', error);
		} finally {
		  setLoading(false);
		}
	}

	return (
		<div>
			<h1>Category</h1>
			<p>Category page content</p>
			{
				loading ? 'Loading categories...' : (
					<ul>
						{siteCategories.map((category) => (
							
							<li key={category.id}>
								<Link href={`/category/${category.slug}`}>
									{category.name}
								</Link>
							</li>
						))}
					</ul>
				)
			}
		</div>
	);
}