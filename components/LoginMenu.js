import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';

export default function LoginMenu() {
	const [userData, setUserData] = useState(null);
	const router = useRouter();
	useEffect(() => {
		const manageUserData = () => {
			const cookies = document.cookie.split('; ');
			const userCookie = cookies.find((cookie) => cookie.startsWith('user_data='));
			if (userCookie) {
				const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
				setUserData(userData);
			}
		}
		router.events.on('routeChangeStart', manageUserData);
		return () => {
			router.events.off('routeChangeStart', manageUserData);
		};

	}, [router.events]);
	return (
		<li>
			{/* {userData ? (
				<button onClick={logout} className='px-5 py-2 border-2 border-black rounded-sm bg-black text-white hover:bg-slate-700 hover:border-black transition-all'>
				Logout
				</button>
			) : (
				<Link className='text-slate-600 text-base hover:text-slate-950' href="/login">
				Login
				</Link>
			)} */}
			<Link className='text-slate-600 text-base hover:text-slate-950' href="/login">
				{userData ? 'Dashboard' : 'Login'}
			</Link>
		</li>
	)
}
