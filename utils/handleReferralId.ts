import axios from "axios";

// Store referralId in localStorage
export default async function handleReferralId(
	ReferralId: string,
	setReferrer?: any
) {
	// Check if there is existing referral data in localStorage
	const storedData = localStorage.getItem("referralData");
	if (storedData) {
		const { referralId, dateAdded, referrer } = JSON.parse(storedData);

		const dateAddedObj = new Date(dateAdded);
		const currentDate = new Date();
		const dayDifference = Math.floor(
			(currentDate.getTime() - dateAddedObj.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (dayDifference > 90) {
			// Over 90 days old, check if there is a referral ambassador with the same ID and update the referral ID or do nothing
			await axios
				.post("/api/check_referrer", { refId: ReferralId })
				.then((res) => {
					console.log("res >>> ", res);
					if (res.data) {
						// There is a referral ambassador with the same ID, use that ID
						const referralData = {
							referralId: ReferralId,
							referrer: res.data.referrer.name,
							dateAdded: new Date().toISOString(),
						};
						console.log(
							"updating referral data in localStorage >>> ",
							referralData
						);
						localStorage.setItem("referralData", JSON.stringify(referralData));
						updateUrlWithReferralId(res.data);
						setReferrer(res.data.referrer.name);
						return;
					}
				})
				.catch((err) => {
					console.log("err >>> ", err);
				});
		} else {
			// Less than 90 days old, keep the existing ID
			console.log(
				`Existing referralId (${referralId}) is less than 90 days old and will be kept.`
			);
			updateUrlWithReferralId(referralId);
			setReferrer(referrer);
			return;
		}
	} else {
		// No existing data, check if there is a referral ambassador with the same ID
		await axios
			.post("/api/check_referrer", { refId: ReferralId })
			.then((res) => {
				console.log(
					"no existing data, storing ref id in localStorage >>> ",
					res
				);
				if (res.data) {
					console.log("res.data.referrer >>> ", res.data.referrer);
					// There is a referral ambassador with the same ID, use that ID
					const referralData = {
						referralId: ReferralId,
						referrer: res.data.referrer.name,
						dateAdded: new Date().toISOString(),
					};
					localStorage.setItem("referralData", JSON.stringify(referralData));
					updateUrlWithReferralId(ReferralId);
					setReferrer(res.data.referrer.name);
					return;
				}
			})
			.catch((err) => {
				console.log("err >>> ", err);
			});
	}
}

function updateUrlWithReferralId(referralId: string) {
	const url = new URL(window.location.href);
	url.searchParams.set("r", referralId);
	window.history.pushState({}, "", url);
}
