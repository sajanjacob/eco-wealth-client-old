import { setOnboarding } from "@/redux/features/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
	handleNextStep: () => void;
	handlePreviousStep: () => void;
};

export default function ProducerOnboardingPropertyZone({
	handleNextStep,
	handlePreviousStep,
}: Props) {
	const dispatch = useAppDispatch();
	const [disableNextStep, setDisableNextStep] = useState(true);
	const [propertyZoneMap, setPropertyZoneMap] = useState("");
	const handlePropertyZoneMapChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setPropertyZoneMap(e.target.value);
	};
	const onboarding = useAppSelector((state: RootState) => state.onboarding);
	const handleContinue = () => {
		dispatch(
			setOnboarding({ ...onboarding, propertyZoneMap: propertyZoneMap })
		);
		handleNextStep();
	};
	useEffect(() => {
		if (propertyZoneMap !== "") {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [propertyZoneMap]);
	const [showInstructions, setShowInstructions] = useState(false);
	const handleShowInstructions = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		setShowInstructions(!showInstructions);
	};

	return (
		<div>
			<h2 className='text-2xl'>Submit Property Zone</h2>
			<h3 className='text-xl my-2'>
				Create a map with your property zone boundaries at{" "}
				<a
					href='https://mymaps.google.com/'
					target='_blank'
					className='text-green-300'
				>
					mymaps.google.com
				</a>{" "}
				on your computer, and share it here:
			</h3>
			<input
				type='text'
				placeholder='https://mymaps.google.com/...'
				className='border-2 border-gray-300 rounded-md p-2 w-full'
				value={propertyZoneMap}
				onChange={handlePropertyZoneMapChange}
			/>
			<button
				className='bg-green-600 cursor-pointer rounded-md py-3 px-12 mt-3 hover:bg-green-700 transition-colors text-white'
				onClick={handleShowInstructions}
			>
				{showInstructions ? "Hide Instructions" : "Show Instructions"}
			</button>
			{showInstructions && (
				<div className='mt-4'>
					<h3 className='text-xl my-2'>Example Map using Edmonton:</h3>
					<Image
						alt=''
						width={275}
						height={100}
						src='https://i.postimg.cc/kGVRybSy/map-example.png'
					/>
					<h3 className='text-xl my-2'>
						Step 1 - On your computer, sign in to{" "}
						<a
							href='https://mymaps.google.com/'
							target='_blank'
							className='text-green-300'
						>
							mymaps.google.com
						</a>
						.
					</h3>
					<h3 className='text-xl my-2'>Step 2 - Open or create a map.</h3>
					<h3 className='text-xl my-2'>
						Step 3 - Find your property on the map by using the search bar at
						the top.
					</h3>
					<h3 className='flex text-xl my-2'>
						Step 4 - Click Draw a line
						<Image
							alt=''
							width={25}
							height={20}
							src='https://storage.googleapis.com/support-kms-prod/SNP_3024944_en_v0'
							className='bg-white mx-[4px]'
						/>
						and then Add line or shape.
					</h3>
					<h3 className='text-xl my-2'>
						Step 5 - Select a layer and click on the edge of your property zone.
					</h3>
					<h3 className='text-xl my-2'>
						Step 6 - Add lines until you create the boundaries of your property
						zone.
					</h3>
					<h3 className='text-xl my-2'>
						Step 7 - When you&apos;re finished drawing the property zone
						boundaries, double-click or complete the shape.
					</h3>

					<h3 className='text-xl my-2'>
						Step 8 - Give your line or shape a name.
					</h3>
					<h3 className='text-xl my-2'>Step 9 - Save the map.</h3>
					<h3 className='text-xl my-2'>
						Step 10 - Click the Share button, make the link accessible to anyone
						to view, and copy it.
					</h3>
					<div className='flex justify-between my-3'>
						<Image
							alt=''
							width={275}
							height={100}
							src='https://i.postimg.cc/VLy86wdr/my-map.png'
						/>
						<Image
							alt=''
							width={325}
							height={100}
							src='https://i.postimg.cc/XY4ht7zW/share-map.png'
						/>
					</div>
					<h3 className='text-xl my-2'>
						Step 11 - Paste the link in the input at the top of the page and
						click continue to complete the onboarding.
					</h3>

					<h3>
						Note: You can edit the map at anytime in case if you made a mistake
						and need to update it.
					</h3>
				</div>
			)}
			<div className='flex justify-between mt-6'>
				<button
					type='button'
					onClick={handlePreviousStep}
					className={
						"w-[33%] bg-transparent border-green-700 border-[1px] hover:bg-green-700 text-green-700 hover:text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors"
					}
				>
					Go Back
				</button>
				<button
					type='button'
					onClick={handleContinue}
					className={
						disableNextStep
							? "w-[33%] bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-default"
							: "w-[33%] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
					}
					disabled={disableNextStep}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
