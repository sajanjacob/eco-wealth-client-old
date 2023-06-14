import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/features/userSlice"; // we will create this file later
import onboardingReducer from "@/redux/features/onboardingSlice"; // we will create this file later

export const store = configureStore({
	reducer: {
		user: userReducer,
		onboarding: onboardingReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
