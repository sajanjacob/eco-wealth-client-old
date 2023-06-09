interface User {
	name: string;
	email: string;
	phone_number: string;
	is_verified: boolean;
	roles: string[];
	id: string;
	active_role: string;
	totalUserTreeCount: number;
	userTreeCount: number;
}
interface UserState {
	roles: string[];
	loggedIn: boolean;
	roles: string[];
	id: string | null;
	active_role: string | null;
	currentTheme: string | null;
	email: string | null;
	name: string | null;
	phone_number: string | null;
	is_verified: boolean;
	totalUserTreeCount: number;
	userTreeCount: number;
}
