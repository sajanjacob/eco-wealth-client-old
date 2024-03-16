import axios from "axios";
import { maxNumberOfReferrers } from "@/utils/constants";
import deduplicateByUniqueKey from "./deduplicateByUniqueKey";
import extractObjValuesToStringArray from "./extractObjValuesToStringArray";
// New function to handle multiple referral IDs
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
	urlReferrerIds: string[];
	pageSource: string;
	maxStoredIds?: number;
	setReferrer?: (referrer: any) => void;
	setReferrers?: (referrers: any) => void;
	setReferrerIds?: (referrerIds: string[]) => void;
	setSavedReferrers?: (referrers: Object[]) => void;
};

export default async function handleReferrerIds({
	urlReferrerIds, //Referrer IDs from URL
	pageSource,
	maxStoredIds = maxNumberOfReferrers, // Max number of stored referral IDs
	setReferrer,
	setReferrers,
	setReferrerIds,
	setSavedReferrers,
}: Props) {
	// Retrieve the existing array of referral data or initialize a new one
	let referrerData = JSON.parse(localStorage.getItem("referrerData") || "[]");
	console.log("hndlrfrids -- referrerData >>> ", referrerData);
	let uniqueReferrerData = deduplicateByUniqueKey(referrerData, "referrerId"); // Deduplicate by referrerId
	localStorage.setItem("referrerData", JSON.stringify(uniqueReferrerData)); // Update localStorage with deduplicated referrers
	// Check and remove the oldest referral data if exceeding maxStoredIds
	if (uniqueReferrerData.length >= maxStoredIds) {
		uniqueReferrerData.shift(); // Remove the oldest entry if max is reached
		localStorage.setItem("referrerData", JSON.stringify(uniqueReferrerData));
	}
	const referrerIds = extractObjValuesToStringArray(
		uniqueReferrerData,
		"referrerId"
	); //Referrer IDs from localStorage

	// Process the new ReferralId
	if (!urlReferrerIds || urlReferrerIds.length === 0) {
		console.log("No referral IDs provided");
		return;
	}

	// Combine referrerIds and urlReferrerIds while removing duplicates
	const combinedReferrerIds = [new Set(...urlReferrerIds, ...referrerIds)];
	const cookieConsent = localStorage.getItem("cookieConsent");
	let trackingEnabled = false;
	if (cookieConsent === "accepted") {
		trackingEnabled = true;
	}
	const refSessionId = localStorage.getItem("refSessionId");
	let queryData = {};
	if (refSessionId) {
		queryData = {
			refIds: combinedReferrerIds,
			pageSource,
			trackingEnabled,
			refSessionId,
		};
	} else {
		queryData = {
			refIds: combinedReferrerIds,
			pageSource,
			trackingEnabled,
		};
	}
	// Call the API to check the referrer data
	await axios
		.post("/api/check_referrers", queryData)
		.then((res) => {
			if (res.data && res.data.referrers && res.data.referrers.length > 0) {
				let refData = [] as ReferrerData[];
				// Iterate over each referrer returned by the API
				res.data.referrers.forEach((referrer: any) => {
					// Add each referrer to the referrerData
					refData.push({
						referrerId: referrer.refId,
						referrer: {
							name: referrer.name,
							email: referrer.email,
						},
						dateAdded: new Date().toISOString(),
						pageSource,
					});
				});

				// Update localStorage with the new array
				localStorage.setItem("referrerData", JSON.stringify(refData));
				if (res.data.refSessionId) {
					localStorage.setItem("refSessionId", res.data.refSessionId);
				}
				// Assuming you want to update the URL with the first ReferralId if multiple are present
				if (urlReferrerIds.length > 0) updateUrlWithReferrerIds(urlReferrerIds);
				if (setReferrer && res.data.referrers.length > 0)
					setReferrer(
						res.data.referrers.map((data: ReferrerData) => data.referrer)
					); // Set to the first referrer's name, adjust as needed
				if (setReferrers)
					setReferrers(refData.map((data: ReferrerData) => data.referrer)); // Pass all referrer data if needed
				if (setReferrerIds)
					setReferrerIds(refData.map((data: ReferrerData) => data.referrerId)); // Pass all stored IDs if needed
				if (setSavedReferrers) {
					const referrers = res.data.referrers.map((referrer: any) => ({
						label: `${referrer.name} (${referrer.email}) - id: ${referrer.id}`,
						value: {
							id: referrer.id,
							name: referrer.name,
							email: referrer.email,
						},
					}));
					setSavedReferrers(referrers);
				}
			}
		})
		.catch((err) => {
			console.log("err >>> ", err);
			updateUrlWithReferrerIds([""]); // Clear the URL if there's an error
			if (setReferrer) setReferrer("");
			if (setReferrers) setReferrers([]); // Clear referrers if there's an error
		});
}

function updateUrlWithReferrerIds(referrerIds: string[]) {
	const url = new URL(window.location.href);
	url.searchParams.set("r", JSON.stringify(referrerIds));
	window.history.pushState({}, "", url);
}
