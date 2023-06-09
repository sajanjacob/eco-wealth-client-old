import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
	user: {
		loggedIn: false,
		roles: [],
		id: null,
		activeRole: null,
		currentTheme: null,
		email: null,
		name: null,
	},
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
