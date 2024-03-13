import CityPicker from "@/components/global/CityPicker";
import { setOnboarding } from "@/redux/features/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import postalCodes from "postal-codes-js";

type Props = {
	handleNextStep: () => void;
};

export default function ProducerOnboardingAddress({ handleNextStep }: Props) {
	const dispatch = useAppDispatch();
	const [disableNextStep, setDisableNextStep] = useState(true);
	const [producerPostalCode, setProducerPostalCode] = useState("");
	const [producerAddressLineOne, setProducerAddressLineOne] = useState("");
	const [producerAddressLineTwo, setProducerAddressLineTwo] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [postalCodeError, setPostalCodeError] = useState(false);
	const handleProducerAddressLineOneChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setProducerAddressLineOne(e.target.value);
	};

	const handleProducerAddressLineTwoChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setProducerAddressLineTwo(e.target.value);
	};

	const handleProducerPostalCodeChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setProducerPostalCode(e.target.value);
		const validPostalCode = postalCodes.validate(countryCode, e.target.value);
		if (validPostalCode === true) {
			setPostalCodeError(false);
		} else {
			setPostalCodeError(true);
		}
	};
	const city = useAppSelector((state: RootState) => state.onboarding.city);
	const stateProvince = useAppSelector(
		(state: RootState) => state.onboarding.stateProvince
	);
	// Here we handle the next step button
	useEffect(() => {
		if (
			producerAddressLineOne !== "" &&
			countryCode &&
			!postalCodeError &&
			city &&
			stateProvince
		) {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [
		producerAddressLineOne,
		countryCode,
		postalCodeError,
		city,
		stateProvince,
	]);
	const handleContinue = (e: React.MouseEvent<HTMLElement>) => {
		dispatch(
			setOnboarding({
				addressLineOne: producerAddressLineOne,
				addressLineTwo: producerAddressLineTwo,
				postalCode: producerPostalCode,
			})
		);
		handleNextStep();
	};

	return (
		<div>
			<fieldset className='flex flex-col'>
				<legend className='text-xl font-semibold mb-2'>
					What is the address you will operate your projects on?
				</legend>
				<label
					htmlFor='addressLineOne'
					className='flex items-center '
				>
					Address Line One
				</label>
				<input
					id='addressLineOne'
					type='text'
					value={producerAddressLineOne}
					onChange={handleProducerAddressLineOneChange}
					className='rounded-md  text-lg p-[4px] outline-green-400 transition-colors'
				/>
				<label
					htmlFor='addressLineTwo'
					className='flex items-center mt-3'
				>
					Address Line Two
				</label>
				<input
					id='addressLineTwo'
					type='text'
					value={producerAddressLineTwo}
					onChange={handleProducerAddressLineTwoChange}
					className='rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
				/>
				<CityPicker setCountryCode={setCountryCode} />

				{countryCode && (
					<>
						<label
							htmlFor='postalCode'
							className='flex items-center mt-3'
						>
							{countryCode === "CA"
								? "Postal Code"
								: countryCode === "US"
								? "Zip Code"
								: null}{" "}
						</label>
						<input
							id='postalCode'
							type='text'
							value={producerPostalCode}
							onChange={handleProducerPostalCodeChange}
							className='rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
						/>
						{postalCodeError && (
							<p className='text-red-500'>
								Please enter a valid{" "}
								{countryCode === "CA"
									? "postal code."
									: countryCode === "US"
									? "zip code."
									: null}
							</p>
						)}
					</>
				)}
			</fieldset>
			<div className='flex justify-end mt-6'>
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
