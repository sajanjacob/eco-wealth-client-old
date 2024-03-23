import React, { useState, useEffect, useCallback } from "react";
import Select, { OptionsOrGroups } from "react-select";
import debounce from "@/utils/debounce";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import handleReferrerIds from "@/utils/handleReferrerIds";
import { buttonClass, inputClass } from "@/lib/tw-styles";
import AsyncSelect from "react-select/async";
import { BiPlusCircle } from "react-icons/bi";
import validator from "validator";
import handleReferrerUrlEmail from "@/utils/handleReferrerUrlEmail";
import { MdPeople } from "react-icons/md";
type Referrer = {
	referrerId: string;
	referrer: {
		name: string;
		email: string;
	};
	dateAdded: string;
	pageSource: string;
	inputSource: string;
};

type Props = {
	setReferrers: (referrers: Referrer[]) => void;
	referralSource: string;
	setReferralSource: (referralSource: string) => void;
	setReferrerIds: (referrerIds: string[]) => void;
	specificReferrer: Referrer;
	setSpecificReferrer: (specificReferrer: Referrer) => void;
};

const ReferrerInput = ({
	setReferrers,
	referralSource,
	setReferralSource,
	setReferrerIds,
	specificReferrer,
	setSpecificReferrer,
}: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [influencerBrandReferrer, setInfluencerBrandReferrer] = useState("");
	const [referrerOptions, setReferrerOptions] = useState([]);
	const [selectedReferrers, setSelectedReferrers] = useState<Referrer[]>([]);
	const [selectedReferrer, setSelectedReferrer] = useState<Referrer>({
		referrerId: "",
		referrer: {
			name: "",
			email: "",
		},
		dateAdded: "",
		pageSource: "",
		inputSource: "",
	});
	const [savedReferrers, setSavedReferrers] = useState<Referrer[]>([]);
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");

	const path = usePathname();

	// This function creates options of referrers for the visitor to select from
	const fetchReferrers = async (
		searchTerm: string,
		callback: (options: any[]) => void
	) => {
		console.log("Fetching referrers...");
		// Check if the input value meets the minimum length requirement
		if (inputValue.length <= 3) {
			// Assuming a minimum of 3 characters before fetching
			callback([]);
			return;
		}
		await axios
			.post("/api/find_referrers", {
				searchTerm,
			})
			.then((response) => {
				const data = response.data;
				console.log("response >>> ", response);
				if (data && data.referrers) {
					console.log("Referrers: ", data.referrers);
					const options = data.referrers.map((ambassador: any) => ({
						label: `${ambassador.users.name} (${ambassador.contact_email}) - id: ${ambassador.id}`,
						value: {
							referrerId: ambassador.id,
							referrer: {
								name: ambassador.users.name,
								email: ambassador?.contact_email,
							},
							dateAdded: new Date().toISOString(),
							pageSource: path,
							inputSource: "search",
						},
					}));
					// setReferrerOptions(options);
					callback(options);
				}
			})
			.catch((err) => {
				console.error("Error fetching referrers: ", err);
				// setReferrerOptions([]); // Clear options on error
				callback([]);
			});
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedCheck = useCallback(
		debounce((searchTerm: string, callback: (options: any[]) => void) => {
			fetchReferrers(searchTerm, callback);
		}, 800),
		[]
	); // this useCallback ensures that the debounced function is created only once

	// Refactor debounce usage to be inside useEffect
	// useEffect(() => {

	// 	if (inputValue) {
	// 		fetchReferrers(inputValue);
	// 	}
	// }, [inputValue]); // fetchReferrers moved inside useEffect to ensure it's created once

	// useEffect(() => {
	// 	if (referrerOptions.length > 0) {
	// 		console.log("Referrer options: ", referrerOptions);
	// 	}
	// }, [referrerOptions]);

	const handleAddReferrer = (e: React.MouseEvent) => {
		if (selectedReferrer === null) return;
		const newSavedReferrers = [...savedReferrers, selectedReferrer];
		setSavedReferrers(newSavedReferrers);
		setSelectedReferrer({
			referrerId: "",
			referrer: {
				name: "",
				email: "",
			},
			dateAdded: "",
			pageSource: "",
			inputSource: "",
		});
		// Update localStorage and parent state
		updateLocalStorageAndParent(newSavedReferrers);
	};

	const handleDeleteReferrer = (index: number) => {
		const updatedReferrers = [...savedReferrers];
		updatedReferrers.splice(index, 1);
		setSavedReferrers(updatedReferrers);
		// Update localStorage and parent state
		updateLocalStorageAndParent(updatedReferrers);
	};

	const handleEditReferrer = (index: number) => {
		const referrerToEdit = savedReferrers[index];
		setSelectedReferrers([referrerToEdit]);
		handleDeleteReferrer(index);
	};

	const updateLocalStorageAndParent = (referrers: any[]) => {
		localStorage.setItem("referrerData", JSON.stringify(referrers));
		setReferrers(referrers.map((referrer) => referrer.value)); // Assuming `referrer.value` holds the detailed object
	};

	// Improved error handling and validation for ref
	useEffect(() => {
		const handleCheckReferral = async () => {
			if (typeof window === "undefined") return;

			let referrerIdentifiers = ref ? decodeURIComponent(ref) : null;
			let referrerIds = [];
			let isEmail = false;

			// Check if the referrerIdentifiers is an email, an array, or a single ID
			if (referrerIdentifiers) {
				isEmail = validator.isEmail(referrerIdentifiers);
				if (!isEmail) {
					try {
						referrerIds = JSON.parse(referrerIdentifiers);
						if (!Array.isArray(referrerIds)) {
							// Treat as a single ID
							referrerIds = [referrerIdentifiers];
						}
					} catch {
						// In case parsing failed, treat as a single ID
						referrerIds = [referrerIdentifiers];
					}
				}
			}

			// Fetch and handle referrer data based on the type of identifier
			if (referrerIdentifiers && isEmail) {
				await handleReferrerIds({
					urlEmail: referrerIdentifiers, // Provide a default value of an empty string when referrerIdentifiers is null
					pageSource: path!,
					setReferrers,
					setReferrerIds,
					setSavedReferrers,
				});
			} else if (referrerIds.length > 0) {
				await handleReferrerIds({
					urlReferrerIds: referrerIds,
					setReferrers,
					setReferrerIds,
					pageSource: path!,
					setSavedReferrers,
				});
			} else {
				await handleReferrerIds({
					pageSource: path!,
					setReferrers,
					setReferrerIds,
					setSavedReferrers,
				});
			}
		};

		handleCheckReferral();
	}, [ref, path, setReferrers, setReferrerIds, setSavedReferrers]);

	// Handle referral source change
	const handleReferralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setReferralSource(e.target.value);
		setSpecificReferrer({
			referrerId: "",
			referrer: {
				name: "",
				email: "",
			},
			dateAdded: "",
			pageSource: "",
			inputSource: "",
		}); // Reset specific referral if the referral source is changed
		setInfluencerBrandReferrer(""); // Reset influencerBrandReferrer if the referral source is changed
		setInputValue(""); // Reset inputValue if the referral source is changed
	};

	// Handle referrer selection
	const handleSelectedReferrer = (selectedOption: any, index: number) => {
		const updatedReferrers = [...selectedReferrers];
		updatedReferrers[index] = selectedOption;
		setSelectedReferrers(updatedReferrers);
	};

	const handleInputChange = (newValue: string) => {
		setInputValue(newValue);
		setSpecificReferrer({
			referrerId: "",
			referrer: {
				name: newValue,
				email: "",
			},
			dateAdded: "",
			pageSource: "",
			inputSource: "",
		});

		return newValue;
	};

	const handleInfluencerBrandReferrerChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setInfluencerBrandReferrer(e.target.value);
		// Add influencerBrandReferrer to referrers along with savedReferrers
		setSpecificReferrer({
			referrerId: "",
			referrer: {
				name: e.target.value,
				email: "",
			},
			dateAdded: new Date().toISOString(),
			pageSource: path ?? "", // Provide a default value of an empty string when path is null
			inputSource: "text",
		});
	};
	const handleSelectChange = (selectedOption: any) => {
		setSelectedReferrer(selectedOption);
		setReferrers([...savedReferrers, selectedOption.value]); // Adjust as needed to match expected structure
	};
	const [showAllReferrers, setShowAllReferrers] = useState(false);
	// Render specific referral input based on referral source
	const renderSpecificReferralInput = () => {
		if (referralSource === "Friend/Someone referred") {
			return (
				<div>
					<div>
						<div className='mb-[-8px]'>
							<p className='mb-[-4px] leading-1'>
								Who referred you to Eco Wealth?
							</p>
							<span className='text-xs text-gray-400'>
								Enter their name, email, or referral ID
							</span>
						</div>
						<div className='flex items-center'>
							<AsyncSelect
								cacheOptions
								defaultOptions
								value={selectedReferrer}
								loadOptions={debouncedCheck}
								onInputChange={handleInputChange}
								onChange={handleSelectChange}
								className='text-gray-900 flex-1 my-4'
							/>
							{selectedReferrer.referrerId !== "" && (
								<button
									className={
										inputValue.length >= 3
											? `${buttonClass} ml-2 !p-3`
											: `my-4 p-3 ml-2 cursor-default bg-gray-400 hover:bg-gray-400 border-none rounded-md`
									}
									disabled={inputValue.length <= 3}
									onClick={(e) => handleAddReferrer(e)}
								>
									<BiPlusCircle className='text-lg' />
								</button>
							)}
						</div>
					</div>
					<div className='text-xs text-gray-400 pb-2'>
						{!showAllReferrers && savedReferrers && (
							<div
								className='flex items-center cursor-pointer w-max'
								onClick={() => setShowAllReferrers(true)}
								title={`${savedReferrers.length} ${
									savedReferrers.length === 1 ? "person" : "people"
								} referred you — click to view`}
							>
								<MdPeople className='mr-[2px]' /> {savedReferrers.length}{" "}
								referrers
							</div>
						)}
						{showAllReferrers &&
							savedReferrers &&
							savedReferrers.map((referrer: any, index: number) => (
								<div
									key={index}
									className='mb-2 w-[300px] cursor-pointer'
									onClick={() => setShowAllReferrers(false)}
									title='Click to hide'
								>
									<span>{referrer.label}</span>
									{referrer.inputSource === "search" && (
										<>
											<button onClick={() => handleEditReferrer(index)}>
												Edit
											</button>
											<button onClick={() => handleDeleteReferrer(index)}>
												Delete
											</button>
										</>
									)}
								</div>
							))}
					</div>
				</div>
			);
		} else if (
			[
				"Instagram",
				"Facebook",
				"YouTube",
				"TikTok",
				"Threads",
				"Twitter/X",
				"Twitch",
				"Blog/Website",
			].includes(referralSource)
		) {
			return (
				<div className='flex flex-col mb-4 w-[300px]'>
					<label className='mb-2'>
						Which{" "}
						{referralSource !== "Blog/Website"
							? `${referralSource} account`
							: "blog or website "}{" "}
						did you hear about Eco Wealth from?
					</label>
					<input
						type='text'
						value={influencerBrandReferrer}
						placeholder={
							referralSource === "Blog/Website"
								? "Blog/Website name"
								: "@username"
						}
						className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
						onChange={handleInfluencerBrandReferrerChange}
					/>
				</div>
			);
		}
	};

	return (
		<div>
			<div className='flex flex-col mb-4'>
				<label className='mb-2'>How did you hear about Eco Wealth?</label>
				<select
					value={referralSource}
					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					onChange={handleReferralChange}
				>
					<option value=''>Select</option>
					<option value='Instagram'>Instagram</option>
					<option value='Facebook'>Facebook</option>
					<option value='YouTube'>YouTube</option>
					<option value='TikTok'>TikTok</option>
					<option value='Threads'>Threads</option>
					<option value='Twitter/X'>Twitter/X</option>
					<option value='Twitch'>Twitch</option>
					<option value='Blog/Website'>Blog/Website</option>
					<option value='Friend/Someone referred'>
						Friend/Someone referred me
					</option>
				</select>
			</div>
			{renderSpecificReferralInput()}
		</div>
	);
};

export default ReferrerInput;
