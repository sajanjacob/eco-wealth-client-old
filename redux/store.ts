import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/features/userSlice"; // we will create this file later
import onboardingReducer from "@/redux/features/onboardingSlice"; // we will create this file later
import loadingReducer from "@/redux/features/loadingSlice"; // we will create this file later
import producerReducer from "@/redux/features/producerSlice"; // we will create this file later

export const store = configureStore({
	reducer: {
		user: userReducer,
		onboarding: onboardingReducer,
		loading: loadingReducer,
		producer: producerReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
