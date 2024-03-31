"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdPeople } from "react-icons/md";

type Props = {
	showEditReferrer?: boolean;
	handleEditReferrer?: (index: number) => void;
	handleDeleteReferrer?: (index: number) => void;
};

export default function ReferrerCount({
	showEditReferrer = false,
	handleEditReferrer,
	handleDeleteReferrer,
}: Props) {
	const [showAllReferrers, setShowAllReferrers] = useState(false);
	const savedReferrers = useAppSelector(
		(state: RootState) => state.referrers.savedReferrers
	);

	return (
		<div className='text-xs text-gray-600'>
			{savedReferrers.length > 0 && (
				<div
					className={`flex items-center ${
						showEditReferrer &&
						"cursor-pointer hover:text-gray-500 transition-colors"
					} w-max`}
					onClick={() => {
						if (showEditReferrer) setShowAllReferrers(!showAllReferrers);
					}}
					title={`${savedReferrers.length} ${
						savedReferrers.length === 1 ? "person" : "people"
					} referred you — click to ${!showAllReferrers ? "view" : "hide"}`}
				>
					<MdPeople className='mr-[2px]' /> {savedReferrers.length} referrers
				</div>
			)}
			{showEditReferrer &&
				showAllReferrers &&
				savedReferrers &&
				savedReferrers.map((referrer: any, index: number) => (
					<div
						key={index}
						className='my-2 w-[300px] cursor-pointer'
						onClick={() => setShowAllReferrers(!showAllReferrers)}
						title={"Click to hide"}
					>
						<span>{referrer.label}</span>
						{(referrer.value.inputSource === "search" ||
							referrer.value.inputSource === "text") &&
							showEditReferrer &&
							handleDeleteReferrer &&
							handleEditReferrer && (
								<>
									{/* <button onClick={() => handleEditReferrer(index)}>
										Edit
									</button> */}
									<button onClick={() => handleDeleteReferrer(index)}>
										<FaTrash className='ml-[4px] text-xs hover:text-gray-500 transition-colors cursor-pointer' />
									</button>
								</>
							)}
					</div>
				))}
		</div>
	);
}
