"use client";
import React, { useState } from "react";
import { buttonClass, inputClass } from "@/lib/tw-styles"; // Assuming these styles exist
import GoToOrderButton from "./GoToOrderButton";
import { set } from "react-hook-form";

export default function BleachBottleCalculator() {
	const [units, setUnits] = useState("L"); // Default to liters
	const [yearlyConsumption, setYearlyConsumption] = useState(0);
	const [numberOfBottles, setNumberOfBottles] = useState(0);
	const averageBottleSizeL = 3.57; // Average size of a bleach bottle in liters
	const averageBottleSizeG = averageBottleSizeL * 0.264172; // Convert to gallons

	// Handle input change and calculate bottles displaced
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const consumption = Number(e.target.value);
		setYearlyConsumption(consumption); // Set the yearly consumption based on input

		// Calculate bottles based on units
		if (units === "L") {
			setNumberOfBottles(consumption / averageBottleSizeL);
		} else {
			setNumberOfBottles(consumption / averageBottleSizeG);
		}
	};

	// Switch between liters and gallons
	const switchUnits = () => {
		if (units === "L") {
			setUnits("Gal");
			// Optionally convert the existing input to the new unit for continuity
			setYearlyConsumption(Math.round(yearlyConsumption * 0.264172));
		} else {
			setUnits("L");
			// Optionally convert the existing input to the new unit for continuity
			setYearlyConsumption(Math.round(yearlyConsumption * 3.78541));
		}
	};

	return (
		<div
			id='bleach-calculator'
			className='anchor'
		>
			<div className='mt-16 px-[64px]'>
				<h1 className='text-3xl md:text-5xl font-bold text-white mb-4 leading-tight'>
					See how many <span className='text-gray-400'>bleach bottles</span> you
					could displace annually:
				</h1>
				<div className='md:w-1/2 mt-16'>
					<h2 className='text-3xl font-bold text-gray-400 mb-4'>
						How many {units === "L" ? "liters" : "gallons"} of bleach do you use
						per year?
					</h2>
					<div className='flex'>
						<div className='flex bg-white rounded-md items-center justify-between w-[100%]'>
							<span className='text-2xl'>💧</span>
							<input
								className={`outline-none w-[100%] p-2 rounded text-gray-800 text-3xl font-bold `}
								value={yearlyConsumption}
								onChange={handleInputChange}
							></input>
							<p className='text-3xl text-black font-bold pr-4'>{units}</p>
						</div>
						<div className='flex ml-2'>
							<button
								className={
									units === "L"
										? "text-gray-400 cursor-pointer hover:text-gray-200 transition-all mr-2"
										: "text-green-400 cursor-default mr-2"
								}
								onClick={switchUnits}
							>
								Gal
							</button>
							<button
								className={
									units === "Gal"
										? "text-gray-400 cursor-pointer hover:text-gray-200 transition-all"
										: "text-green-400 cursor-default"
								}
								onClick={switchUnits}
							>
								L
							</button>
						</div>
					</div>
				</div>
				<div className='mt-16 mb-4'>
					<h3 className='text-gray-400'>
						<div className='flex items-center'>
							<span className='md:text-5xl mr-4'>
								You could <span className='text-white'>displace</span>
							</span>
							<span className='text-3xl md:text-8xl text-white font-bold'>
								{Math.round(numberOfBottles)}
							</span>
						</div>
						<span className=' md:text-5xl'>
							<span className=' text-white'>
								{units === "L" ? "3.57 L " : "120 Oz "} bleach bottles
							</span>{" "}
							per year. 🌊
						</span>
					</h3>
				</div>
				<GoToOrderButton />
			</div>
		</div>
	);
}
