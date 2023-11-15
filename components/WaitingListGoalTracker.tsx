import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";

const GOAL = 1000; // The goal for total entries

export default function WaitingListGoalTracker() {
	const [entryCount, setEntryCount] = useState(0);
	// Function to fetch current count
	const fetchCurrentCount = async () => {
		const { data, count, error } = await supabase
			.from("waiting_list")
			.select("*", { count: "exact" })
			.single();

		if (error) {
			console.error("Error fetching count:", error);
			return;
		}
		console.log("waiting list data >>> ", count);
		if (count) setEntryCount(count);
	};

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
					className={`bg-green-400`}
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
