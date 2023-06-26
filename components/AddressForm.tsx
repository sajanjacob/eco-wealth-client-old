import React, { useEffect, useState } from "react";
import CityPicker from "./CityPicker";
import postalCodes from "postal-codes-js";

type Props = {
	handleUpdateAddress: (e: React.MouseEvent<HTMLElement>) => void;
	setAddress: any;
	address: {
		addressLineOne: string;
		addressLineTwo: string;
		city: string;
		country: string;
		postalCode: string;
		stateProvince: string;
	};
	editing?: boolean;
	initialDetails?: {
		addressLineOne: string;
		addressLineTwo: string;
		city: string;
		country: string;
		postalCode: string;
		stateProvince: string;
	};
};

export default function AddressForm({
	handleUpdateAddress,
	setAddress,
	address,
	editing,
	initialDetails,
}: Props) {
	const [countryCode, setCountryCode] = useState("");
	const [postalCodeError, setPostalCodeError] = useState(false);
	const handleProducerPostalCodeChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setAddress({ ...address, postalCode: e.target.value });
		const validPostalCode = postalCodes.validate(countryCode, e.target.value);
		if (validPostalCode === true) {
			setPostalCodeError(false);
		} else {
			setPostalCodeError(true);
		}
	};
	useEffect(() => {
		if (initialDetails) {
			setAddress(initialDetails);
		}
	}, [initialDetails]);

	return (
		<div>
			<div className='mb-8'>
				<h2 className='text-xl'>
					{editing ? "Update address:" : "Add a New Address:"}
				</h2>
				<fieldset className='flex flex-col'>
					<legend className='font-light mb-2'>
						{editing
							? "Note: Updating your address will trigger another verification process."
							: "What is the address you will operate your projects on?"}
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
						value={address.addressLineOne}
						onChange={(e) =>
							setAddress({ ...address, addressLineOne: e.target.value })
						}
						className='rounded-md  text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
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
						value={address.addressLineTwo}
						onChange={(e) =>
							setAddress({ ...address, addressLineTwo: e.target.value })
						}
						className='rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
					/>
					<CityPicker
						setCountryCode={setCountryCode}
						city={address.city}
						country={address.country}
						stateProvince={address.stateProvince}
					/>

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
								value={address.postalCode}
								onChange={handleProducerPostalCodeChange}
								className='rounded-md w-[300px] text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
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
				<div className='flex justify-end'>
					<button
						onClick={handleUpdateAddress}
						className='bg-green-500 hover:bg-green-600 text-white rounded-md p-2 mt-4'
					>
						Update Address
					</button>
				</div>
			</div>
		</div>
	);
}
