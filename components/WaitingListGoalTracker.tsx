import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import axios from "axios";

const GOAL = 1000; // The goal for total entries

export default function WaitingListGoalTracker() {
	const [entryCount, setEntryCount] = useState(0);
	// Function to fetch current count
	const fetchCurrentCount = async () => {
		axios
			.get("/api/waiting_list_count")
			.then((res) => {
				if (res.status === 200) {
					setEntryCount(res.data.count);
				}
			})
			.catch((err) => {
				console.error(err);
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
				<p className='mt-[2px]'>{entryCount}/1000</p>
			</div>
		</div>
	);
}
