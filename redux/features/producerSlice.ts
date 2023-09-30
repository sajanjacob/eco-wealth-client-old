import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ProducerState = {
	// Populate with your initial state properties
	id: "",
	name: "",
	producerProperties: [],
};

export const producerSlice = createSlice({
	name: "producer",
	initialState,
	reducers: {
		setProducer: (state, action: PayloadAction<Partial<ProducerState>>) => {
			const producerData = action.payload;
			// Add conditions to set your state properties like you did in userSlice
			if (producerData.name) state.name = producerData.name;
			if (producerData.producerProperties !== undefined)
				state.producerProperties = producerData.producerProperties;
			if (producerData.id) state.id = producerData.id;
		},
	},
});

export const { setProducer } = producerSlice.actions;

export default producerSlice.reducer;
