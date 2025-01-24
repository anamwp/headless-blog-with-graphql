import { useEffect, useState } from 'react';
import Login from '../components/Login';
import { getCurrentUser } from '../components/CurrentUser';

export default function LoginPage() {
	const [ user, setUser ] = useState(null);
	const [ userData, setUserData ] = useState(null);
	const useAutoLogin = () => {
		useEffect(() => {
			const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('token='))
			?.split('=')[1];

			const cookies = document.cookie.split('; ');
			const userCookie = cookies.find((cookie) => cookie.startsWith('user_data='));

			if (userCookie) {
				const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
				setUserData(userData);
				console.log(userData.token); // Access the token
				console.log(userData.user_display_name); // Access the display name
				const token = userData.token;
				if (token) {
					getCurrentUser(token).then((user) => {
						if (user) {
							console.log('User is already logged in:', user);
							setUser(user);
						} else {
							console.log('User is not logged in');
						}
					});
				}
			}
		
		}, []);
	};
	console.log('User:', user);
	const logout = () => {
		document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		window.location.reload();
	};
	return (
		<div>
			{/* Show login if no user */}
			{
				!user && (
					<div>
						<h1>Login</h1>
						<Login />
					</div>
				)
			}
			{/* Show user details */}
			{
				user && (
					<div>
						<p className='text-xl font-bold text-slate-700'>Current User</p>
						<p>User: {user.name}</p>
						<p>Name: {user.name}</p>
						<p>Name: {userData.user_email}</p>
						<p>Description: {user.description}</p>
						<p>URL: {user.url}</p>
						<button onClick={logout} >Logout</button>
					</div>
				)
			}
			
			{useAutoLogin()}
		</div>
	);
}