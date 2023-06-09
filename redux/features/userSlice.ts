import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
	roles: [],
	loggedIn: false,
	id: null,
	active_role: null,
	currentTheme: null,
	email: null,
	name: null,
	phone_number: null,
	is_verified: false,
	totalUserTreeCount: 0,
	userTreeCount: 0,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<Partial<UserState>>) => {
			const userData = action.payload;
			if (userData.roles) state.roles = userData.roles;
			if (userData.loggedIn !== undefined) state.loggedIn = userData.loggedIn;
			if (userData.id) state.id = userData.id;
			if (userData.active_role) state.active_role = userData.active_role;
			if (userData.currentTheme) state.currentTheme = userData.currentTheme;
			if (userData.email) state.email = userData.email;
			if (userData.phone_number) state.phone_number = userData.phone_number;
			if (userData.is_verified) state.is_verified = userData.is_verified;
			if (userData.name) state.name = userData.name;
			if (userData.totalUserTreeCount !== undefined)
				state.totalUserTreeCount = userData.totalUserTreeCount;
			if (userData.userTreeCount !== undefined)
				state.userTreeCount = userData.userTreeCount;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
