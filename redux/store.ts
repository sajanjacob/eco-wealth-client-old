import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/features/userSlice";
import onboardingReducer from "@/redux/features/onboardingSlice";
import loadingReducer from "@/redux/features/loadingSlice";
import producerReducer from "@/redux/features/producerSlice";
import referrerReducer from "@/redux/features/referrerSlice";
export const store = configureStore({
	reducer: {
		user: userReducer,
		onboarding: onboardingReducer,
		loading: loadingReducer,
		producer: producerReducer,
		referrers: referrerReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
