"use client";
import BottleCalculator from "@/components/products/enagic/BottleCalculator";
import Footer from "@/components/products/enagic/Footer";
import How from "@/components/products/enagic/How";
import What from "@/components/products/enagic/What";
import Why from "@/components/products/enagic/Why";
import { useRouter } from "next/navigation";
import React from "react";
import plasticWasteImage from "@/assets/images/DALL·E 2024-03-03 22.04.26 - An impactful image depicting a clean, vibrant ocean on one side, symbolizing the positive impact of sustainable solutions, and on the other side, a cl.webp";
import { buttonClass, linkClass } from "@/lib/tw-styles";
import GoToOrderButton from "@/components/products/enagic/GoToOrderButton";
import BleachBottleCalculator from "@/components/products/enagic/BleachBottleCalculator";

type Props = {};

export default function Enagic({}: Props) {
	const router = useRouter();
	const backgroundImageUrl =
		"https://i.postimg.cc/PxZHJWwt/DALL-E-2024-03-03-22-04-26-An-impactful-image-depicting-a-clean-vibrant-ocean-on-one-side-symbol.webp";
	const backgroundCredits = "Image credits — Dall-E, OpenAI";
	return (
		<>
			<div
				className='z-0 absolute top-0 w-[100%] mx-auto h-[100vh] bg-cover bg-center flex justify-center items-center bg-no-repeat'
				style={{
					backgroundImage: `url(${backgroundImageUrl})`,
				}}
			>
				<div className='z-[1000] w-full h-full flex justify-center flex-col items-center bg-black bg-opacity-75'>
					<div className='z-[1000] w-[80%] m-auto items-center md:w-[50%]'>
						<h1 className='text-white font-bold text-4xl md:text-5xl md:w-[100%] mt-8 md:mt-0'>
							Help reduce plastic waste by displacing the{" "}
							<span
								className={linkClass}
								onClick={(e) => {
									e.preventDefault();
									router.push("/prdcts/enagic#calculator");
								}}
							>
								{" "}
								number of bottles
							</span>{" "}
							of water you consume.{" "}
						</h1>
						<div className='mt-4'>
							<GoToOrderButton />
							<button
								onClick={() => router.push("/prdcts/enagic#why")}
								className={buttonClass}
							>
								Know more
							</button>
						</div>
					</div>
					<div className='flex justify-end w-[100%]'>
						<h6 className='text-right text-white font-light mb-4 mr-4 text-xs opacity-50'>
							{backgroundCredits}
						</h6>
					</div>
				</div>
			</div>
			<div className='2xl:w-[1200px] md:mx-auto mt-[90vh]'>
				{/* Landing page elements */}
				{/*
				 *
				 *
				 *  */}
				{/* Why plastic bottle pollution is an issue and why to invest in an Enagic machine now */}
				<Why />
				{/*
				 *
				 * */}
				{/* What an Enagic Machines is */}
				<What />
				{/*
				 *
				 * */}
				{/* How Enagic Machines Work */}
				<How />
				{/*
				 *
				 * */}
				{/* Bottle Displacement Calculator */}
				<BottleCalculator />
				<BleachBottleCalculator />
				{/*
				 *
				 * */}
				{/* Enagic Footer */}
				<Footer />
			</div>
		</>
	);
}
