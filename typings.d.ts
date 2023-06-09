interface User {
	name: string;
	email: string;
	phone: string;
	is_verified: boolean;
	roles: string[];
	id: string;
	active_role: string;
}
interface UserState {
	user: {
		loggedIn: boolean;
		roles: string[];
		id: string | null;
		activeRole: string | null;
		currentTheme: string | null;
		email: string | null;
		name: string | null;
	} | null;
}
