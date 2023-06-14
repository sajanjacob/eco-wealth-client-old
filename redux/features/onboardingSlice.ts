import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: OnboardingState = {
	addressLineOne: "",
	addressLineTwo: "",
	city: "",
	country: "",
	postalCode: "",
	stateProvince: "",
	operationType: ["Trees", "Solar Farm"],
	treeTypes: "",
	hasTreeFarmOperation: "",
	hasSolarFarmOperation: "",
	solarTypes: "",
	treeOpSize: "",
	solarOpSize: "",
	producerGoal: "",
	propertyZoneMap: "",
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
			if (onboardingData.operationType)
				state.operationType = onboardingData.operationType;
			if (onboardingData.treeTypes) state.treeTypes = onboardingData.treeTypes;
			if (onboardingData.solarTypes)
				state.solarTypes = onboardingData.solarTypes;
			if (onboardingData.treeOpSize)
				state.treeOpSize = onboardingData.treeOpSize;
			if (onboardingData.solarOpSize)
				state.solarOpSize = onboardingData.solarOpSize;
			if (onboardingData.producerGoal)
				state.producerGoal = onboardingData.producerGoal;
			if (onboardingData.propertyZoneMap)
				state.propertyZoneMap = onboardingData.propertyZoneMap;
		},
	},
});

export const { setOnboarding } = onboardingSlice.actions;

export default onboardingSlice.reducer;
