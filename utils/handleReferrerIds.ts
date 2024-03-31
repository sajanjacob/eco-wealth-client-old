import axios from "axios";
import { maxNumberOfReferrers } from "@/utils/constants";
import deduplicateByUniqueKey from "./deduplicateByUniqueKey";
import extractObjValuesToStringArray from "./extractObjValuesToStringArray";

type Referrer = {
	id: string;
	name: string;
	email: string;
	inputSource: string;
};
type ReferrerData = {
	referrerId: string;
	referrer: {
		name: string;
		email: string;
	};
	dateAdded: string;
	pageSource: string;
};
type Props = {
	pageSource: string;
	urlReferrerIds?: string[];
	urlEmail?: string; // New optional property for email
	maxStoredIds?: number;
	setReferrer?: (referrer: any) => void;
	setReferrers?: (referrers: any) => void;
	setReferrerIds?: (referrerIds: string[]) => void;
	setSavedReferrers?: (referrers: any) => void;
};

export default async function handleReferrerIds({
	urlReferrerIds = [],
	urlEmail, // Include urlEmail in the function parameters
	pageSource,
	maxStoredIds = maxNumberOfReferrers,
	setReferrer,
	setReferrers,
	setReferrerIds,
	setSavedReferrers,
}: Props) {
	console.log("urlReferrerIds >>> ", urlReferrerIds);
	console.log("urlEmail >>> ", urlEmail);
	// Retrieve the existing array of referral data or initialize a new one
	let referrerData = JSON.parse(localStorage.getItem("referrerData") || "[]");
	let uniqueReferrerData = deduplicateByUniqueKey(referrerData, "referrerId"); // Deduplicate by referrerId
	// Ensure the array is sorted by dateAdded to correctly remove the oldest entry if needed
	uniqueReferrerData.sort(
		(a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
	);
	// Check and remove the oldest referral data if exceeding maxStoredIds
	while (uniqueReferrerData.length > maxStoredIds) {
		uniqueReferrerData.shift(); // Remove the oldest entry if max is reached
	}
	// Update localStorage with the filtered array
	localStorage.setItem("referrerData", JSON.stringify(uniqueReferrerData));

	const referrerIds = extractObjValuesToStringArray(
		uniqueReferrerData,
		"referrerId"
	);

	// Combine referrerIds and urlReferrerIds while removing duplicates
	const combinedReferrerIds = Array.from(
		new Set([...urlReferrerIds, ...referrerIds])
	).filter((id) => id !== "");

	// If no referrer IDs are present, exit function
	if (combinedReferrerIds.length === 0 && !urlEmail) return;

	let queryData = {
		urlReferrerIds,
		urlEmail,
		refIds: referrerIds,
		pageSource,
		trackingEnabled: localStorage.getItem("cookieConsent") === "accepted",
		refSessionId: localStorage.getItem("refSessionId"),
		referrers: uniqueReferrerData,
	};

	// Call the API to check the referrer data
	try {
		const res = await axios.post("/api/check_referrers", queryData);

		if (res.data && res.data.referrers && res.data.referrers.length > 0) {
			console.log("res.data.referrers >>> ", res.data.referrers);
			let refData = res.data.referrers.map((referrer: any) => ({
				referrerId: referrer.referrerId,
				referrer: {
					name: referrer.referrer.name,
					email: referrer.referrer.email,
				},
				dateAdded: referrer.dateAdded,
				pageSource: referrer.pageSource,
				inputSource: referrer.inputSource,
			}));

			// Update localStorage with the new array
			localStorage.setItem("referrerData", JSON.stringify(refData));

			// Update referral session id if not in localStorage already
			if (res.data.refSessionId && !localStorage.getItem("refSessionId")) {
				localStorage.setItem("refSessionId", res.data.refSessionId);
			}

			// Update url with referrerIds from API
			if (res.data.referrerIds && res.data.referrerIds.length > 0) {
				updateUrlWithReferrerIds(res.data.referrerIds);
			}

			// Callback functions - safely invoked
			setReferrer?.(refData.map((data: any) => data.referrer));
			setReferrers?.(refData.map((data: any) => data));
			setReferrerIds?.(refData.map((data: any) => data.referrerId));
			setSavedReferrers?.(
				res.data.referrers.map((referrer: any) => ({
					label: referrer.email
						? `${referrer.referrer.name} (${referrer.referrer.email}) - id: ${referrer.referrerId}`
						: `${referrer.referrer.name} - id: ${referrer.referrerId}`,
					value: referrer,
				}))
			);
		}
	} catch (err) {
		console.error("handleReferrerIds - error: ", err);
		updateUrlWithReferrerIds([]); // Clear the URL if there's an error
		setReferrer?.([]);
		setReferrers?.([]); // Clear referrers if there's an error
		setReferrerIds?.([]);
		setSavedReferrers?.([]);
	}
}

function updateUrlWithReferrerIds(referrerIds: string[]) {
	const url = new URL(window.location.href);
	url.searchParams.set("r", JSON.stringify(referrerIds));
	window.history.pushState({}, "", url.toString());
}
