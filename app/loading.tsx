"use client";
import { CircularProgress } from "@mui/material";
import React from "react";

type Props = {};

export default function loading({}: Props) {
	return (
		<div className='flex flex-col justify-center items-center h-[90vh]'>
			<CircularProgress
				className='mb-8'
				color='success'
				sx={{
					width: "48px !important",
					height: "48px !important",
				}}
			/>
			<h1>Loading App...</h1>
		</div>
	);
}
