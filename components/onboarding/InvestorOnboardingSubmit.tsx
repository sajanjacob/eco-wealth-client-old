import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
type Props = {};

export default function InvestorOnboardingSubmit({}: Props) {
	return (
		<div className='flex flex-col justify-center items-center h-[60vh] text-center'>
			<CircularProgress
				className='mb-8'
				color='success'
			/>
			Submitting your answers and activating <br />
			your investor account...
		</div>
	);
}
