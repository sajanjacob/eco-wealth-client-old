import React, { useEffect, useState } from "react";
import { Country, City, State } from "country-state-city";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setOnboarding } from "@/redux/features/onboardingSlice";
import { set } from "react-hook-form";

type option = {
	value: {
		latitude: string;
		longitude: string;
		isoCode: string;
	};
	label: string;
} | null;

type cityOption = {
	value: {
		latitude: string;
		longitude: string;
		countryCode: string;
		name: string;
		stateCode: string;
	};
	label: string;
} | null;

type stateOption = {
	value: {
		latitude: string;
		longitude: string;
		countryCode: string;
		name: string;
		isoCode: string;
	};
	label: string;
} | null;
const countries = ["CA", "US"];
const options = countries.map((country) => {
	return {
		value: {
			latitude: Country.getCountryByCode(country)?.latitude!,
			longitude: Country.getCountryByCode(country)?.longitude!,
			isoCode: Country.getCountryByCode(country)?.isoCode!,
		},
		label: Country.getCountryByCode(country)?.name!,
	};
});

type Props = {
	setCountryCode: React.Dispatch<React.SetStateAction<string>>;
	city?: string;
	country?: string;
	stateProvince?: string;
	setAddress?: any;
	address?: {
		addressLineOne: string;
		addressLineTwo: string;
		city: string;
		country: string;
		postalCode: string;
		stateProvince: string;
	};
};
export default function CityPicker({
	setCountryCode,
	city,
	country,
	stateProvince,
	setAddress,
	address,
}: Props) {
	const [selectedCountry, setSelectedCountry] = useState<option>(null);
	const [selectedState, setSelectedState] = useState<stateOption>(null);
	const [selectedCity, setSelectedCity] = useState<cityOption>(null);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const handleSelectedCountry = (option: option) => {
		setSelectedCountry(option);
		setSelectedState(null);
		setSelectedCity(null);
		if (option) {
			setCountryCode(option?.value?.isoCode);
		}
		dispatch(setOnboarding({ ...onboarding, country: option?.label }));
		if (setAddress) setAddress({ ...address, country: option?.label });
	};
	const onboarding = useAppSelector((state: RootState) => state.onboarding);
	const handleSelectedState = (option: stateOption) => {
		setSelectedState(option);
		setSelectedCity(null);
		dispatch(setOnboarding({ ...onboarding, stateProvince: option?.label }));
		if (setAddress) setAddress({ ...address, stateProvince: option?.label });
	};
	const handleSelectedCity = (option: cityOption) => {
		setSelectedCity(option);
		dispatch(setOnboarding({ ...onboarding, city: option?.label }));
		if (setAddress) setAddress({ ...address, city: option?.label });
	};
	useEffect(() => {
		if (country) {
			let foundCountry =
				options.find((option) => option?.label === country) || null;
			setSelectedCountry(foundCountry);
			setCountryCode(foundCountry?.value.isoCode!);
		}
	}, [country]);
	useEffect(() => {
		if (stateProvince && selectedCountry) {
			let foundStateProvince =
				State.getStatesOfCountry(selectedCountry?.value.isoCode)?.find(
					(option) => option?.name === stateProvince
				) || null;
			setSelectedState({
				value: {
					latitude: foundStateProvince?.latitude!,
					longitude: foundStateProvince?.longitude!,
					countryCode: foundStateProvince?.countryCode!,
					name: foundStateProvince?.name!,
					isoCode: foundStateProvince?.isoCode!,
				},
				label: foundStateProvince?.name!,
			});
		}
	}, [stateProvince, selectedCountry]);

	useEffect(() => {
		if (city && selectedState) {
			let foundCity =
				City.getCitiesOfState(
					selectedState?.value.countryCode,
					selectedState?.value.isoCode
				)?.find((option) => option?.name === city) || null;
			setSelectedCity({
				value: {
					latitude: foundCity?.latitude!,
					longitude: foundCity?.longitude!,
					countryCode: foundCity?.countryCode!,
					name: foundCity?.name!,
					stateCode: foundCity?.stateCode!,
				},
				label: foundCity?.name!,
			});
		}
	}, [city, selectedState]);

	return (
		<div className='space-y-4 mt-3'>
			<div className='space-y-2'>
				<div className='flex items-center space-x-2 text-white/80'>
					<label>Country</label>
				</div>
				<Select
					value={selectedCountry}
					options={options}
					onChange={handleSelectedCountry}
					className='text-black'
				/>
			</div>
			{selectedCountry && (
				<div className='space-y-2 mt-3'>
					<div className='flex items-center space-x-2 text-white/80'>
						<label>
							{selectedCountry.value.isoCode === "US"
								? "State"
								: selectedCountry.value.isoCode === "CA"
								? "Province"
								: null}
						</label>
					</div>
					<Select
						className='text-black '
						value={selectedState}
						options={State.getStatesOfCountry(
							selectedCountry.value.isoCode
						)?.map((state: any) => ({
							value: {
								latitude: state.latitude!,
								longitude: state.longitude!,
								countryCode: state.countryCode,
								name: state.name,
								isoCode: state.isoCode,
							},
							label: state.name,
						}))}
						onChange={handleSelectedState}
					/>
				</div>
			)}
			{selectedState && (
				<div className='space-y-2 mt-3'>
					<div className='flex items-center space-x-2 text-white/80'>
						<label>Nearest City/Town</label>
					</div>
					<Select
						className='text-black w-[500px]'
						value={selectedCity}
						options={City.getCitiesOfState(
							selectedState.value.countryCode,
							selectedState.value.isoCode
						)?.map((state: any) => ({
							value: {
								latitude: state.latitude!,
								longitude: state.longitude!,
								countryCode: state.countryCode,
								name: state.name,
								stateCode: state.stateCode,
							},
							label: state.name,
						}))}
						onChange={handleSelectedCity}
					/>
				</div>
			)}
		</div>
	);
}
