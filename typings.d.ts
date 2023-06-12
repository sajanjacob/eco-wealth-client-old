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

interface Project {
	id: string;
	title: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	role: string;
	tree_target: number;
	tree_count: number;
	image_url: string;
	status: string;
	type: string;
	funds_requested_per_tree: number;
	projectType: string;
	projectId: string;
	project_coordinator_contact_name: string;
	project_coordinator_contact_email: string;
}

type Projects = Project[];
