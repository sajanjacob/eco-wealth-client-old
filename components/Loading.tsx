import { CircularProgress } from "@mui/material";
import React from "react";

type Props = {
	marginTop?: number;
	height?: number;
	message?: string;
};

export default function Loading({ marginTop, height, message }: Props) {
	return (
		<div
			className={`mx-auto flex flex-col items-center text-center mt-${
				marginTop || 48
			} h-[${height || 90}vh}]`}
		>
			<CircularProgress
				color='success'
				className='mb-4 text-lg'
			/>
			<h3 className='mb-4'>{message || `Loading...`}</h3>{" "}
		</div>
	);
}
