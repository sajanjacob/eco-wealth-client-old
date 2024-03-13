import axios from "axios";

// New function to handle multiple referral IDs
export default async function handleReferrerIds(
	ReferrerIds: string[],
	setReferrer?: any,
	setReferrers?: any,
	setReferrerIds?: any,
	maxStoredIds: number = Infinity // Max number of stored referral IDs
) {
	// Retrieve the existing array of referral data or initialize a new one
	let referralDataArray = JSON.parse(
		localStorage.getItem("referralDataArray") || "[]"
	);

	// Check and remove the oldest referral data if exceeding maxStoredIds
	if (referralDataArray.length >= maxStoredIds) {
		// Assuming maxStoredIds is Infinity for now, but logic is here for future adjustments
		referralDataArray.shift(); // Remove the oldest entry if max is reached
	}

	// Process the new ReferralId
	if (!ReferrerIds || ReferrerIds.length === 0) {
		console.log("No referral ID provided");
		return;
	}

	await axios
		.post("/api/check_referrers", { refIds: ReferrerIds }) // Note the change to check_referrers
		.then((res) => {
			if (res.data && res.data.referrers && res.data.referrers.length > 0) {
				// Iterate over each referrer returned by the API
				res.data.referrers.forEach((referrer: any) => {
					// Add each referrer to the referralDataArray
					referralDataArray.push({
						referralId: referrer.refId,
						referrer: {
							name: referrer.name,
							email: referrer.email,
						},
						dateAdded: new Date().toISOString(),
					});
				});

				// Update localStorage with the new array
				localStorage.setItem(
					"referralDataArray",
					JSON.stringify(referralDataArray)
				);
				// Assuming you want to update the URL with the first ReferralId if multiple are present
				if (ReferrerIds.length > 0) updateUrlWithReferrerIds(ReferrerIds);
				if (setReferrer && res.data.referrers.length > 0)
					setReferrer(res.data.referrers[0].name); // Set to the first referrer's name, adjust as needed
				if (setReferrers)
					setReferrers(referralDataArray.map((data: any) => data.referrer)); // Pass all referrer data if needed
				if (setReferrerIds)
					setReferrerIds(referralDataArray.map((data: any) => data.referralId)); // Pass all stored IDs if needed
			}
		})
		.catch((err) => {
			console.log("err >>> ", err);
			updateUrlWithReferrerIds([""]); // Clear the URL if there's an error
			if (setReferrer) setReferrer("");
			if (setReferrers) setReferrers([]); // Clear referrers if there's an error
		});
}

function updateUrlWithReferrerIds(referralIds: string[]) {
	const url = new URL(window.location.href);
	url.searchParams.set("r", JSON.stringify(referralIds));
	window.history.pushState({}, "", url);
}
