"use client";
import React, { useState } from "react";
import Enagic from "./Enagic";
import EcoWealth from "./EcoWealth";
import EcoxSolar from "./EcoxSolar";
import { useAppSelector } from "@/redux/hooks";

type Props = {};

export function Component({}: Props) {
	const [activeCategory, setActiveCategory] = useState("EcoWealth");
	const user = useAppSelector((state) => state.user);
	const referralId = user.referralId;
	// Function to handle category change
	const handleCategoryChange = (category: string) => {
		setActiveCategory(category);
	};

	// Function to dynamically render the appropriate links component based on the active category
	const renderComponent = () => {
		switch (activeCategory) {
			case "EcoWealth":
				return <EcoWealth />;
			case "EnagicLinks":
				return <Enagic />; // Assuming you have this component
			case "EcoxSolar":
				return <EcoxSolar />; // Assuming you have this component
			default:
				return null;
		}
	};
	return (
		<div className='mt-4'>
			<h2 className='text-2xl'>Compensation Structure:</h2>

			<div className='flex space-x-2 my-2'>
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
					onClick={() => handleCategoryChange("EnagicLinks")}
					className={`px-4 py-2 ${
						activeCategory === "EnagicLinks"
							? "bg-[var(--cta-one)] rounded-md text-white cursor-default"
							: "bg-gray-500 rounded-md hover:bg-gray-400 transition-colors"
					}`}
				>
					Enagic
				</button>
				<button
					onClick={() => handleCategoryChange("EcoxSolar")}
					className={`px-4 py-2 ${
						activeCategory === "EcoxSolar"
							? "bg-[var(--cta-one)] rounded-md text-white cursor-default"
							: "bg-gray-500 rounded-md hover:bg-gray-400 transition-colors"
					}`}
				>
					EcoxSolar
				</button>
			</div>
			{renderComponent()}
		</div>
	);
}
