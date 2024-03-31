"use client";
import React, { useState } from "react";
import EcoWealth from "./EcoWealth";
import Enagic from "./Enagic";
import { useAppSelector } from "@/redux/hooks";
import General from "./General";

type Props = {};

const Component = ({}: Props) => {
	const [activeCategory, setActiveCategory] = useState("General");
	const user = useAppSelector((state) => state.user);
	const referralId = user.referralId;
	// Function to handle category change
	const handleCategoryChange = (category: string) => {
		setActiveCategory(category);
	};

	// Function to dynamically render the appropriate  component based on the active category
	const renderComponent = () => {
		switch (activeCategory) {
			case "General":
				return <General />;
			case "EcoWealth":
				return <EcoWealth />;
			case "Enagic":
				return <Enagic />; // Assuming you have this component
			// case "EcoxSolar":
			// 	return <EcoxSolar referralId={referralId} />; // Assuming you have this component
			default:
				return null;
		}
	};
	return (
		<div className='mt-4'>
			<p className='text-sm text-gray-500'>Your Referral ID is: {referralId}</p>
			<h2 className='text-2xl'>Settings:</h2>
			<div className='flex space-x-2 my-2'>
				<button
					onClick={() => handleCategoryChange("General")}
					className={`px-4 py-2 ${
						activeCategory === "General"
							? "bg-[var(--cta-one)] rounded-md text-white cursor-default"
							: "bg-gray-500 rounded-md hover:bg-gray-400 transition-colors"
					}`}
				>
					General
				</button>
				<button
					onClick={() => handleCategoryChange("EcoWealth")}
					className={`px-4 py-2 ${
						activeCategory === "EcoWealth"
							? "bg-[var(--cta-one)] rounded-md text-white cursor-default"
							: "bg-gray-500 rounded-md hover:bg-gray-400 transition-colors"
					}`}
				>
					Eco Wealth
				</button>
				<button
					onClick={() => handleCategoryChange("Enagic")}
					className={`px-4 py-2 ${
						activeCategory === "Enagic"
							? "bg-[var(--cta-one)] rounded-md text-white cursor-default"
							: "bg-gray-500 rounded-md hover:bg-gray-400 transition-colors"
					}`}
				>
					Enagic
				</button>
				{/* <button
					onClick={() => handleCategoryChange("EcoxSolar")}
					className={`px-4 py-2 ${
						activeCategory === "EcoxSolar"
							? "bg-[var(--cta-one)] rounded-md text-white cursor-default"
							: "bg-gray-500 rounded-md hover:bg-gray-400 transition-colors"
					}`}
				>
					EcoxSolar
				</button> */}
			</div>
			{renderComponent()}
		</div>
	);
};

export { Component };
