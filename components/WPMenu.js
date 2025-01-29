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
  
	if (loading) return <p>Loading menu...</p>;
	if (error) return <p>{error}</p>;
  
	// Render menu recursively to handle nested menus
	const renderMenu = (items) => {
		return (
			<ul className="menu flex flex-row gap-2">
				{items.map((item) => (
					<li key={item.id} className="menu-item relative group">
					<Link href={item.url}>
						<span className="block px-4 py-2 hover:text-blue-500">{item.title}</span>
					</Link>
					{item.children.length > 0 && (
						<ul className="submenu absolute top-full right-0 hidden w-64 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block" style={{ transformOrigin: 'top left' }}>
							{item.children.map((child) => (
								<li key={child.id} className="submenu-item">
									<Link
										href={child.url}
										className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
									>
										{child.title}
									</Link>
								</li>
							))}
						</ul>
					)}
					</li>
				))}
			</ul>
		);
	};
  
	return (
		<nav>
			{renderMenu(menuItems)}
	
			<style jsx>{`
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
			`}</style>
		</nav>
	);
}
