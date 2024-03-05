"use client";
import { buttonClass, inputClass, linkClass } from "@/lib/tw-styles";
import React, { useEffect, useState } from "react";
import bottleOf from "@/assets/images/DALL·E 2024-03-03 22.42.25 - Design a detailed emoji of a  bottle. The  bottle should be clear, showcasing its pure, clean  inside, with a blue cap to symbolize fre.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { set } from "react-hook-form";
import GoToOrderButton from "./GoToOrderButton";
type Props = {};

export default function BottleCalculator({}: Props) {
	const router = useRouter();

	// Liters
	const [numberOfLitersConsumedPerDay, setNumberOfLitersConsumedPerDay] =
		useState(0);
	const [numberOf500MLBottles, setNumberOf500MLBottles] = useState(0);
	const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNumberOfLitersConsumedPerDay(Number(e.target.value));
	};

	useEffect(() => {
		if (numberOfLitersConsumedPerDay < 0) {
			setNumberOfLitersConsumedPerDay(0);
		}
	}, [numberOfLitersConsumedPerDay]);
	useEffect(() => {
		if (numberOfLitersConsumedPerDay > 0) {
			const numberOf500MLBottlesPerDay = numberOfLitersConsumedPerDay / 0.5;
			const numberOf500MLBottlesPerYear = numberOf500MLBottlesPerDay * 365;
			setNumberOf500MLBottles(numberOf500MLBottlesPerYear);
		}
	}, [numberOfLitersConsumedPerDay]);

	// Gallons
	const [numberOf16OzBottles, setNumberOf16OzBottles] = useState(0);
	const [numberOfGallonsConsumedPerDay, setNumberOfGallonsConsumedPerDay] =
		useState(0);
	const handleGallonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNumberOfGallonsConsumedPerDay(Number(e.target.value));
	};
	useEffect(() => {
		if (numberOfGallonsConsumedPerDay < 0) {
			setNumberOfGallonsConsumedPerDay(0);
		}
	}, [numberOfGallonsConsumedPerDay]);
	useEffect(() => {
		if (numberOfGallonsConsumedPerDay > 0) {
			const numberOf16OzBottlesPerDay = numberOfGallonsConsumedPerDay / 0.5;
			const numberOf16OzBottlesPerYear = numberOf16OzBottlesPerDay * 365;
			setNumberOf16OzBottles(numberOf16OzBottlesPerYear);
		}
	}, [numberOfGallonsConsumedPerDay]);

	// Units
	const [units, setUnits] = useState("L");
	const handleSwitchUnits = () => {
		if (units === "L") {
			setUnits("Gal");
			const numberOfGallonsConsumedPerDay: number =
				numberOfLitersConsumedPerDay / 3.78541;

			setNumberOfGallonsConsumedPerDay(
				Math.round(numberOfGallonsConsumedPerDay)
			);
		} else {
			const numberOfLitersConsumedPerDay: number =
				numberOfGallonsConsumedPerDay * 3.78541;
			setUnits("L");
			setNumberOfLitersConsumedPerDay(Math.round(numberOfLitersConsumedPerDay));
		}
	};

	return (
		<div
			id='calculator'
			className='anchor'
		>
			<div className='mt-16 px-[64px]'>
				<h1 className='text-3xl md:text-5xl font-bold text-white mb-4 leading-tight'>
					See how many bottles of water{" "}
					<span className='text-gray-400'>you could displace</span> with an{" "}
					<a href={linkClass}>Enagic Machine</a>:
				</h1>
				<div className='md:w-1/2 mt-16'>
					{units === "L" && (
						<h2 className='text-3xl font-bold text-gray-400 mb-4'>
							How many liters of water do you consume a day on average?
						</h2>
					)}
					{units === "Gal" && (
						<h2 className='text-3xl font-bold text-gray-400 mb-4'>
							How many gallons of water do you consume a day on average?
						</h2>
					)}
					<div className='flex '>
						{units === "L" && (
							<div className='flex bg-white rounded-md items-center justify-between w-[100%]'>
								<span className='text-2xl'>💧</span>
								<input
									className='outline-none w-[100%] p-2 rounded text-gray-800 text-3xl font-bold '
									value={numberOfLitersConsumedPerDay}
									onChange={handleLitersChange}
								></input>
								<p className='text-3xl text-black font-bold pr-4'>L</p>
							</div>
						)}
						{units === "Gal" && (
							<div className='flex bg-white rounded-md items-center justify-between w-[100%]'>
								<span className='text-2xl'>💧</span>
								<input
									className='outline-none w-[100%] p-2 rounded text-gray-800 text-3xl font-bold '
									value={numberOfGallonsConsumedPerDay}
									onChange={handleGallonsChange}
								></input>
								<p className='text-3xl text-black font-bold pr-4'>Gal</p>
							</div>
						)}
						<div className='flex ml-2'>
							<button
								className={`${
									units === "L"
										? "text-gray-400 cursor-pointer hover:text-gray-200 transition-all"
										: "text-green-400 cursor-default"
								} mr-2`}
								onClick={handleSwitchUnits}
							>
								Gal
							</button>
							<button
								className={
									units === "L"
										? "text-green-400 cursor-default"
										: "text-gray-400 cursor-pointer hover:text-gray-200 transition-all"
								}
								onClick={handleSwitchUnits}
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
							</span>{" "}
							<span className='text-3xl md:text-8xl text-white font-bold'>
								{units === "L" && numberOf500MLBottles}
								{units === "Gal" && numberOf16OzBottles}
							</span>
						</div>

						<span className='md:text-5xl'>
							<span className='text-white'>
								{units === "L" && "500 ml "}
								{units === "Gal" && "16.9 oz "} plastic water bottles
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
