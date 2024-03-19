import React, { useState, useEffect } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import handleReferrerIds from "@/utils/handleReferrerIds";

type Referrer = {
	id: string;
	name: string;
	email: string;
	inputSource: string;
};

type Props = {
	setReferrers: (referrers: Referrer[]) => void;
	referralSource: string;
	setReferralSource: (referralSource: string) => void;
	setReferrerIds: (referrerIds: string[]) => void;
	specificReferral: string;
	setSpecificReferral: (specificReferral: string) => void;
};

const ReferrerInput = ({
	setReferrers,
	referralSource,
	setReferralSource,
	setReferrerIds,
	specificReferral,
	setSpecificReferral,
}: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [referrerOptions, setReferrerOptions] = useState([]);
	const [selectedReferrers, setSelectedReferrers] = useState<Referrer[]>([]);
	const [savedReferrers, setSavedReferrers] = useState<Referrer[]>([]);
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");
	const path = usePathname();

	// Refactor debounce usage to be inside useEffect
	useEffect(() => {
		const fetchReferrers = debounce(async (searchTerm) => {
			try {
				const { data } = await axios.post("/api/find_referrers", {
					searchTerm,
				});
				if (data && data.referrers) {
					const options = data.referrers.map((ambassador: any) => ({
						label: `${ambassador.name} (${ambassador.email}) - id: ${ambassador.id}`,
						value: ambassador,
					}));
					setReferrerOptions(options);
				}
			} catch (err) {
				console.error("Error fetching referrers: ", err);
				setReferrerOptions([]); // Clear options on error
			}
		}, 500);

		if (inputValue) {
			fetchReferrers(inputValue);
		}
	}, [inputValue]); // fetchReferrers moved inside useEffect to ensure it's created once

	const handleAddReferrer = () => {
		const newSavedReferrers = [...savedReferrers, ...selectedReferrers];
		setSavedReferrers(newSavedReferrers);
		setSelectedReferrers([]);
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

			let referrerIds = [];
			if (ref) {
				try {
					referrerIds = JSON.parse(ref);
					if (!Array.isArray(referrerIds))
						throw new Error("Referrer IDs must be an array.");
				} catch (err) {
					console.error("Invalid format for referrer IDs in URL.", err);
					return;
				}
			} else {
				const storedData = localStorage.getItem("referrerData");
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					referrerIds = parsedData?.referrerIds || [];
				}
			}

			if (referrerIds.length > 0) {
				setReferralSource("Friend/Someone referred");
				await handleReferrerIds({
					urlReferrerIds: referrerIds,
					setReferrers,
					setReferrerIds,
					pageSource: path!,
					setSavedReferrers,
				});
			}
		};

		handleCheckReferral();
	}, [ref, path, setReferrers, setReferrerIds, setSavedReferrers]);

	// Handle referral source change
	const handleReferralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setReferralSource(e.target.value);
		setSpecificReferral(""); // Reset specific referral if the referral source is changed
	};

	// Handle referrer selection
	const handleSelectedReferrer = (selectedOption: any, index: number) => {
		const updatedReferrers = [...selectedReferrers];
		updatedReferrers[index] = selectedOption;
		setSelectedReferrers(updatedReferrers);
	};
	// Render specific referral input based on referral source
	const renderSpecificReferralInput = () => {
		if (referralSource === "Friend/Someone referred") {
			return (
				<div>
					<input
						type='text'
						placeholder='Search referrers by name, email, or ID'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					{selectedReferrers.map((selectedReferrer, index) => (
						<Select
							key={index}
							value={selectedReferrer}
							onChange={(selectedOption) =>
								handleSelectedReferrer(selectedOption, index)
							}
							options={referrerOptions}
						/>
					))}
					<button onClick={handleAddReferrer}>Add another referrer</button>
					<div className='text-xs text-gray-400 p-2'>
						{savedReferrers.map((referrer: any, index: number) => (
							<div key={index}>
								<span>{referrer.label}</span>
								<button onClick={() => handleEditReferrer(index)}>Edit</button>
								<button onClick={() => handleDeleteReferrer(index)}>
									Delete
								</button>
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
				"Blog/Website",
			].includes(referralSource)
		) {
			return (
				<div className='flex flex-col mb-4 w-[300px]'>
					<label className='mb-2'>
						Which {referralSource} account did you hear about Eco Wealth from?
					</label>
					<input
						type='text'
						value={specificReferral}
						placeholder={
							referralSource === "Blog/Website"
								? "Blog/Website name"
								: "@username"
						}
						className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
						onChange={(e) => setSpecificReferral(e.target.value)}
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
