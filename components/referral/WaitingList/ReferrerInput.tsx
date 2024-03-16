import React, { useState, useEffect } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import handleReferrerIds from "@/utils/handleReferrerIds";

type Props = {
	setReferrers: (referrers: Object[]) => void;
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
	const [selectedReferrers, setSelectedReferrers] = useState<Object[]>([]);
	const [savedReferrers, setSavedReferrers] = useState<Object[]>([]);
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");
	const path = usePathname();
	// Load saved referrers from localStorage
	// useEffect(() => {
	// 	const storedData = localStorage.getItem("referrerData");
	// 	if (storedData) {
	// 		const { referrerIds } = JSON.parse(storedData);
	// 		if (referrerIds && referrerIds.length) {
	// 			// Convert saved referrer IDs to referrer objects for the component state
	// 			loadSavedReferrers(referrerIds);
	// 		}
	// 	}
	// }, []);

	// // Function to load saved referrers by their IDs
	// const loadSavedReferrers = async (referrerIds: string[]) => {
	// 	// Structure query
	// 	const cookieConsent = localStorage.getItem("cookieConsent");
	// 	const trackingEnabled = cookieConsent === "accepted";
	// 	const refSessionId = localStorage.getItem("refSessionId");
	// 	let query = {};
	// 	if (refSessionId) {
	// 		query = { pageSource: path, refSessionId, referrerIds, trackingEnabled };
	// 	} else {
	// 		query = { pageSource: path, referrerIds, trackingEnabled };
	// 	}
	// 	// Call API
	// 	const res = await axios.post("/api/check_referrers", query);
	// 	if (res.data && res.data.referrers) {
	// 		const referrers = res.data.referrers.map((referrer: any) => ({
	// 			label: `${referrer.name} (${referrer.email}) - id: ${referrer.id}`,
	// 			value: {
	// 				id: referrer.id,
	// 				name: referrer.name,
	// 				email: referrer.email,
	// 			},
	// 		}));
	// 		setSavedReferrers(referrers);
	// 	}
	// };

	const fetchReferrers = debounce(async (searchTerm) => {
		axios
			.post("/api/find_referrers", { searchTerm })
			.then((res) => {
				if (res.data && res.data.referrers) {
					const options = res.data.referrers.map((ambassador: any) => ({
						label: `${ambassador.name} (${ambassador.email}) - id: ${ambassador.id}`,
						value: {
							id: ambassador.id,
							name: ambassador.name,
							email: ambassador.email,
						},
					}));
					setReferrerOptions(options);
				}
			})
			.catch((err) => {
				console.error("Error fetching referrers: ", err);
			});
	}, 500);

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

	const handleSelectReferrer = (selectedOption: any, index: number) => {
		const updatedReferrers = [...selectedReferrers];
		updatedReferrers[index] = selectedOption;
		setSelectedReferrers(updatedReferrers);
	};

	const updateLocalStorageAndParent = (referrers: any) => {
		// Convert referrers to ID array for localStorage
		const referrerDetails = referrers.map((referrer: any) => ({
			...referrer.value,
			addedThroughInput: true, // Mark as added through input
		}));
		localStorage.setItem("referrerData", JSON.stringify(referrerDetails));
		setReferrers(referrers); // Update parent component
	};
	// Check if referrerIds is present in localStorage
	const handleExistingReferral = async (referrerIds: string[]) => {
		await handleReferrerIds({
			urlReferrerIds: referrerIds,
			setReferrers,
			setReferrerIds,
			pageSource: path!,
		});
	};
	const handleCheckReferral = () => {
		if (typeof window !== "undefined") {
			// The code now runs only on the client side

			if (ref) {
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(JSON.parse(ref as string));
				return;
			} else {
				const storedData = localStorage.getItem("referrerData");
				if (!storedData) return;
				const { referrerIds } = JSON.parse(storedData as string);
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(referrerIds);
			}
		}
	};

	// Check if referrerIds is present in URL or localStorage
	useEffect(() => {
		// Check if referrerIds is present in URL
		handleCheckReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);

	// Handle referral source change
	const handleReferralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setReferralSource(e.target.value);
		setSpecificReferral(""); // Reset specific referral if the referral source is changed
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
								handleSelectReferrer(selectedOption, index)
							}
							options={referrerOptions}
						/>
					))}
					<button onClick={handleAddReferrer}>Add another referrer</button>
					<div>
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
			{/* Referral source dropdown */}
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
