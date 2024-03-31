import React, { useState, useEffect, useCallback } from "react";
import debounce from "@/utils/debounce";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import handleReferrerIds from "@/utils/handleReferrerIds";
import { buttonClass, inputClass } from "@/lib/tw-styles";
import AsyncSelect from "react-select/async";
import { BiPlusCircle } from "react-icons/bi";
import validator from "validator";
import ReferrerCount from "./ReferrerCount";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRdxReferrers } from "@/redux/features/referrerSlice";
import { RootState } from "@/redux/store";

type Props = {
	setReferrers: (referrers: Referrer[]) => void;
	referralSource: string;
	setReferralSource: (referralSource: string) => void;
	setReferrerIds: (referrerIds: string[]) => void;
	specificReferrer: Referrer;
	setSpecificReferrer: (specificReferrer: Referrer) => void;
	setInputValueParent: (value: string) => void;
};

const ReferrerInput = ({
	setReferrers,
	referralSource,
	setReferralSource,
	setReferrerIds,
	specificReferrer,
	setSpecificReferrer,
	setInputValueParent,
}: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [influencerBrandReferrer, setInfluencerBrandReferrer] = useState("");
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
	const dispatch = useAppDispatch();
	const rdxReferrers = useAppSelector((state: RootState) => state.referrers);
	useEffect(() => {
		setInputValueParent(inputValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValue]);
	useEffect(() => {
		if (savedReferrers.length > 0) {
			dispatch(setRdxReferrers({ savedReferrers }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [savedReferrers]);
	const path = usePathname();

	// This function creates options of referrers for the visitor to select from
	const fetchReferrers = async (
		searchTerm: string,
		callback: (options: any[]) => void
	) => {
		// Check if the input value meets the minimum length requirement
		if (searchTerm.length <= 3) {
			// Assuming a minimum of 3 characters before fetching
			callback([]);
			return;
		}
		console.log("Fetching referrers...");
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
						label: `${ambassador.users.name} ${
							ambassador.contact_email && `(${ambassador.contact_email})`
						} - id: ${ambassador.id}`,
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
					callback(options);
				}
			})
			.catch((err) => {
				console.error("Error fetching referrers: ", err);
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

	const handleAddReferrer = (e: React.MouseEvent) => {
		if (selectedReferrer === null) return;
		const newSavedReferrers = [...savedReferrers, selectedReferrer];
		setSavedReferrers(newSavedReferrers);
		console.log("newSavedReferrers >>> ", newSavedReferrers);
		setInputValue("");
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
		dispatch(setRdxReferrers({ savedReferrers: updatedReferrers }));
		// Update localStorage and parent state
		updateLocalStorageAndParent(updatedReferrers);
	};

	const handleEditReferrer = (index: number) => {
		const referrerToEdit = savedReferrers[index];
		setSelectedReferrers([referrerToEdit]);
		handleDeleteReferrer(index);
	};

	const updateLocalStorageAndParent = (referrers: any[]) => {
		const referrerValues = referrers.map((referrer) => referrer.value);
		localStorage.setItem("referrerData", JSON.stringify(referrerValues));
		setReferrers(referrerValues);
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
				console.log("referrerIdentifiers: ", referrerIdentifiers);
				isEmail = validator.isEmail(referrerIdentifiers);
				if (!isEmail) {
					try {
						referrerIds = JSON.parse(referrerIdentifiers);
						if (!Array.isArray(referrerIds)) {
							// Treat as a single ID
							referrerIds = [referrerIdentifiers];
						}
					} catch (e) {
						// In case parsing failed, treat as a single ID
						console.error("Error parsing referrer IDs: ", e);
						referrerIds = [referrerIdentifiers];
					}
				}
			}
			console.log("isEmail >>> ", isEmail);
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
		dispatch(setRdxReferrers({ referralSource: e.target.value }));
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

	const handleInputChange = (newValue: string, actionMeta: any) => {
		if (actionMeta.action === "input-change") {
			setInputValue(newValue);
		} else if (
			actionMeta.action === "menu-close" &&
			!selectedReferrer.referrerId
		) {
			// When the menu is closed without a selection, preserve the input value
			setSelectedReferrer({
				referrerId: "",
				referrer: {
					name: newValue,
					email: "",
				},
				dateAdded: new Date().toISOString(),
				pageSource: path ?? "",
				inputSource: "text",
			});
		}
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
		// setSelectedReferrer(selectedOption);
		const newSavedReferrers = [...savedReferrers, selectedOption];
		setReferrers(newSavedReferrers); // Adjust as needed to match expected structure
		dispatch(
			setRdxReferrers({
				savedReferrers: newSavedReferrers,
			})
		);
		updateLocalStorageAndParent(newSavedReferrers);
		// clear input
		setInputValue("");
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
	};
	const handleInputBlur = () => {
		// Check if there's text in the input and no selection has been made
		if (inputValue && selectedReferrer.referrerId === "") {
			const newReferrer = {
				...selectedReferrer,
				referrer: { ...selectedReferrer.referrer, name: inputValue },
			};
			setSelectedReferrer(newReferrer);
			// Optionally, if you want to add this referrer to the savedReferrers list
			// you can call the handleAddReferrer function or similar logic here.
		}
	};
	const handleAddManualReferrer = () => {
		if (inputValue) {
			const newReferrer = {
				label: `${inputValue}`,
				value: {
					referrerId: "", // Empty string or some identifier if available
					referrer: {
						name: inputValue,
						email: "", // Assuming email is empty if the user is manually entering a name
					},
					dateAdded: new Date().toISOString(),
					pageSource: path ?? "",
					inputSource: "text", // You could add a new input source type 'manual'
				},
			};

			// Update the savedReferrers state
			const newSavedReferrers = [...savedReferrers, newReferrer] as Referrer[];
			setSavedReferrers(newSavedReferrers);

			// Update the Redux store if needed
			dispatch(setRdxReferrers({ savedReferrers: newSavedReferrers }));

			// Update localStorage
			updateLocalStorageAndParent(newSavedReferrers);

			// Reset the inputValue and selectedReferrer
			setInputValue("");
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
		}
	};
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
								inputValue={inputValue}
								loadOptions={debouncedCheck}
								onInputChange={handleInputChange}
								onChange={handleSelectChange}
								onBlur={handleInputBlur}
								className='text-gray-900 flex-1 my-4'
							/>
							{selectedReferrer.referrerId !== "" && (
								<button
									className={
										selectedReferrer.referrerId !== ""
											? `${buttonClass} ml-2 !p-3`
											: `my-4 p-3 ml-2 cursor-default bg-gray-400 hover:bg-gray-400 border-none rounded-md`
									}
									disabled={!selectedReferrer.referrerId}
									onClick={(e) => handleAddReferrer(e)}
								>
									<BiPlusCircle className='text-lg' />
								</button>
							)}
							{inputValue && selectedReferrer.referrerId === "" && (
								<button
									className={`${buttonClass} ${
										!inputValue
											? `my-4 p-3 ml-2 cursor-default bg-gray-400 hover:bg-gray-400 border-none rounded-md`
											: ""
									}`}
									onClick={handleAddManualReferrer}
									disabled={!inputValue} // Disable the button if there is no input value
								>
									<BiPlusCircle className='text-lg' />
								</button>
							)}
						</div>
					</div>
					<div className='pb-2'>
						<ReferrerCount
							showEditReferrer={true}
							handleDeleteReferrer={handleDeleteReferrer}
							handleEditReferrer={handleEditReferrer}
						/>
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
				"Rumble",
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
					<option value='Rumble'>Rumble</option>
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
