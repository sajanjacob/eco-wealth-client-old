import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const GOAL = 1000; // The goal for total entries

export default function WaitingListGoalTracker() {
	const [entryCount, setEntryCount] = useState(0);
	const [loading, setLoading] = useState(true);
	// Function to fetch current count
	const fetchCurrentCount = async () => {
		setLoading(true);
		axios
			.get("/api/waiting_list_count")
			.then((res) => {
				if (res.status === 200) {
					setEntryCount(res.data.count);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	};
	// subscribe to supabase changes
	supabase
		.channel("waiting_list")
		.on(
			"postgres_changes",
			{ event: "INSERT", schema: "public", table: "waiting_list" },
			(payload: any) => {
				fetchCurrentCount();
			}
		)
		.subscribe();
	useEffect(() => {
		fetchCurrentCount();
	}, []);

	// Calculate the width of the loading bar
	const loadingWidth = Math.min(100, (entryCount / GOAL) * 100);

	return (
		<div className='mt-2'>
			<p className='text-sm mb-[4px]'>Help us reach 1000 waiting list users!</p>
			<div className='border-green-800 border-[1px] rounded-md'>
				<div
					className={`bg-green-400 transition-all duration-500 ease-out`}
					style={{
						width: `${loadingWidth}%`,
						height: "8px",
					}}
				></div>
			</div>
			<div className='text-xs flex justify-end'>
				{loading ? (
					<CircularProgress
						color='success'
						sx={{
							width: "16px !important",
							height: "16px !important",
							marginRight: "4px !important",
							marginTop: "2px !important",
						}}
					/>
				) : null}
				<p className='mt-[2px]'>{entryCount}/1000</p>
			</div>
		</div>
	);
}
