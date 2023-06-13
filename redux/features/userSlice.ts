import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
	roles: ["investor", "producer"],
	loggedIn: true,
	id: "23d2690a-487c-4eca-9cc8-b5303aacbf70",
	activeRole: "investor",
	currentTheme: null,
	email: "sajanjacob67@gmail.com",
	name: "Sajan",
	phoneNumber: "7802463275",
	isVerified: true,
	totalUserTreeCount: 0,
	userTreeCount: 0,
	onboardingComplete: true,
	investorOnboardingComplete: true,
	producerOnboardingComplete: false,
	emailNotification: false,
	smsNotification: true,
	pushNotification: true,
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
			if (userData.activeRole) state.activeRole = userData.activeRole;
			if (userData.currentTheme) state.currentTheme = userData.currentTheme;
			if (userData.email) state.email = userData.email;
			if (userData.phoneNumber) state.phoneNumber = userData.phoneNumber;
			if (userData.isVerified) state.isVerified = userData.isVerified;
			if (userData.name) state.name = userData.name;
			if (userData.totalUserTreeCount !== undefined)
				state.totalUserTreeCount = userData.totalUserTreeCount;
			if (userData.userTreeCount !== undefined)
				state.userTreeCount = userData.userTreeCount;
			if (userData.onboardingComplete !== undefined)
				state.onboardingComplete = userData.onboardingComplete;
			if (userData.investorOnboardingComplete !== undefined)
				state.investorOnboardingComplete = userData.investorOnboardingComplete;
			if (userData.producerOnboardingComplete !== undefined)
				state.producerOnboardingComplete = userData.producerOnboardingComplete;
			if (userData.emailNotification !== undefined)
				state.emailNotification = userData.emailNotification;
			if (userData.smsNotification !== undefined)
				state.smsNotification = userData.smsNotification;
			if (userData.pushNotification !== undefined)
				state.pushNotification = userData.pushNotification;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
