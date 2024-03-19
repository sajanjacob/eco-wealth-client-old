import axios from "axios";
import { maxNumberOfReferrers } from "@/utils/constants";
import deduplicateByUniqueKey from "./deduplicateByUniqueKey";
import extractObjValuesToStringArray from "./extractObjValuesToStringArray";
import { Dispatch, SetStateAction } from "react";

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
	maxStoredIds?: number;
	setReferrer?: (referrer: any) => void;
	setReferrers?: (referrers: any) => void;
	setReferrerIds?: (referrerIds: string[]) => void;
	setSavedReferrers?: Dispatch<SetStateAction<Referrer[]>>;
};

export default async function handleReferrerIds({
	urlReferrerIds = [], // Referrer IDs from URL
	pageSource,
	maxStoredIds = maxNumberOfReferrers, // Max number of stored referral IDs
	setReferrer,
	setReferrers,
	setReferrerIds,
	setSavedReferrers,
}: Props) {
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
	if (combinedReferrerIds.length === 0) return;

	let queryData = {
		urlReferrerIds,
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
			let refData = res.data.referrers.map((referrer: any) => ({
				referrerId: referrer.refId,
				referrer: {
					name: referrer.name,
					email: referrer.email,
				},
				dateAdded: new Date().toISOString(),
				pageSource,
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
			setReferrers?.(refData.map((data: any) => data.referrer));
			setReferrerIds?.(refData.map((data: any) => data.referrerId));
			setSavedReferrers?.(
				res.data.referrers.map((referrer: any) => ({
					label: referrer.email
						? `${referrer.name} (${referrer.email}) - id: ${referrer.refId}`
						: `${referrer.name} - id: ${referrer.refId}`,
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
