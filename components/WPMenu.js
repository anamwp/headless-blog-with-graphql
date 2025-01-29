import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function WPMenu( { menuSlug } ) {
	const [menuItems, setMenuItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
  
	// Organize menu items into parent-child relationships
	const buildMenuHierarchy = (items) => {
		const menuMap = {};
		const rootItems = [];
	
		// Create a map of all items
		items.forEach((item) => {
			menuMap[item.id] = { ...item, children: [] };
		});
	
		// Assign children to their respective parents
		items.forEach((item) => {
			if (item.parent && item.parent !== '0') {
				menuMap[item.parent]?.children.push(menuMap[item.id]);
			} else {
				rootItems.push(menuMap[item.id]);
			}
		});
		return rootItems;
	};
  
	useEffect(() => {
		const fetchMenu = async () => {
			try {
				const response = await axios.get(`${process.env.NEXT_PUBLIC_API_SITE_URL}/wp-json/smart-menu-api/v1/menus/${menuSlug}`);
				const organizedMenu = buildMenuHierarchy(response.data || []);
				setMenuItems(organizedMenu);
			} catch (err) {
				setError(`Failed to load menu. Please try again. ${err.message}`);
			} finally {
				setLoading(false);
			}
		};
  
	  	fetchMenu();
	}, [menuSlug]);

	// Adjust submenu positioning dynamically to prevent overflow
	// Function to check if menu item is last in the row
	const isLastItem = (index, itemsLength) => {
		return index >= itemsLength - 2; // Adjust threshold based on layout
	};

  
	if (loading) return <p>Loading menu...</p>;
	if (error) return <p>{error}</p>;
  
	// Render menu recursively to handle nested menus
	const renderMenu = (items) => {
		return (
			<ul className="menu flex flex-row">
				{items.map((item, index) => {
					const isLast = isLastItem(index, items.length);
					const submenuClass = isLast ? 'right-0 left-auto' : 'left-0 right-auto';

					return(
						<li key={item.id} className="menu-item relative group">
							<Link href={item.url}>
								<span className="block px-3 py-1 cursor-pointer text-slate-600 hover:text-slate-950">
									{item.title}
								</span>
							</Link>

							{item.children.length > 0 && (
								<ul className={`submenu absolute top-full ${submenuClass} hidden min-w-[200px] w-64 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block`}>
									{item.children.map((child) => (
										<li key={child.id} className="submenu-item">
											<Link href={child.url}>
												<span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
													{child.title}
												</span>
											</Link>
										</li>
									))}
								</ul>
							)}
						</li>
					)
				})}
			</ul>
		);
	};
  
	return (
		<nav>
			{renderMenu(menuItems)}
	
			{/* <style jsx>{`
			.menu {
				list-style: none;
				padding: 0;
				margin: 0;
			}
			.menu-item {
				margin: 5px 0;
			}
			.menu-item > a {
				font-weight: bold;
				text-decoration: none;
				color: #0070f3;
			}
			.menu-item > a:hover {
				text-decoration: underline;
			}
			.submenu {
				margin-left: 20px;
				padding-left: 10px;
				border-left: 2px solid #ddd;
			}
			`}</style> */}
		</nav>
	);
}
