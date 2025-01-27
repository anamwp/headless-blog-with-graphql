import {useEffect, useState} from 'react'

export default function UserData() {
	const [userData, setUserData] = useState(null);
	useEffect(() => {
		const manageUserData = () => {
			const cookies = document.cookie.split('; ');
			const userCookie = cookies.find((cookie) => cookie.startsWith('user_data='));
			if (userCookie) {
				const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
				setUserData(userData);
			}
		}
		manageUserData();
	}, []);
	return userData;
}
