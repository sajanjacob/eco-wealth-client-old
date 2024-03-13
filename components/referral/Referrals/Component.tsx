"use client";
import React, { useState } from "react";
import EcoWealth from "./EcoWealth";
import Enagic from "./Enagic";
import { useAppSelector } from "@/redux/hooks";

type Props = {};

const Component = ({}: Props) => {
	const [activeCategory, setActiveCategory] = useState("EcoWealth");
	const user = useAppSelector((state) => state.user);
	const referrerIds = user.referrerIds;
	// Function to handle category change
	const handleCategoryChange = (category: string) => {
		setActiveCategory(category);
	};

	// Function to dynamically render the appropriate links component based on the active category
	const renderComponent = () => {
		switch (activeCategory) {
			case "EcoWealth":
				return <EcoWealth />;
			case "Enagic":
				return <Enagic />; // Assuming you have this component
			// case "EcoxSolar":
			// 	return <EcoxSolar  />; // Assuming you have this component
			default:
				return null;
		}
	};
	return (
		<div className='mt-4'>
			<h2 className='text-2xl'>Referrals:</h2>

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
