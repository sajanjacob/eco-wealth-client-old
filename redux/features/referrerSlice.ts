import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ReferrerState = {
	savedReferrers: [],
	referralSource: "",
};

export const referrerSlice = createSlice({
	name: "referrers",
	initialState,
	reducers: {
		setRdxReferrers: (state, action: PayloadAction<Partial<ReferrerState>>) => {
			const referrerData = action.payload;
			if (referrerData.savedReferrers)
				state.savedReferrers = referrerData.savedReferrers;
			if (referrerData.referralSource)
				state.referralSource = referrerData.referralSource;
		},
	},
});

export const { setRdxReferrers } = referrerSlice.actions;

export default referrerSlice.reducer;
