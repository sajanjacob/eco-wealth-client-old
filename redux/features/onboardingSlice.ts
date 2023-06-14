import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: OnboardingState = {
	addressLineOne: "",
	addressLineTwo: "",
	city: "",
	country: "",
	postalCode: "",
	stateProvince: "",
};

export const onboardingSlice = createSlice({
	name: "onboarding",
	initialState,
	reducers: {
		setOnboarding: (state, action: PayloadAction<Partial<OnboardingState>>) => {
			const onboardingData = action.payload;
			if (onboardingData.addressLineOne)
				state.addressLineOne = onboardingData.addressLineOne;
			if (onboardingData.addressLineTwo)
				state.addressLineTwo = onboardingData.addressLineTwo;
			if (onboardingData.city) state.city = onboardingData.city;
			if (onboardingData.country) state.country = onboardingData.country;
			if (onboardingData.postalCode)
				state.postalCode = onboardingData.postalCode;
			if (onboardingData.stateProvince)
				state.stateProvince = onboardingData.stateProvince;
		},
	},
});

export const { setOnboarding } = onboardingSlice.actions;

export default onboardingSlice.reducer;
