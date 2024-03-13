import axios from "axios";
import DOMPurify from "dompurify";
import sanitizeJsonObject from "./sanitizeJsonObject";
import sanitizeStringArray from "./sanitizeStringArray";
type Props = {
	name: string;
	email: string;
	referralSource?: string;
	referrers?: object[];
	specificReferral?: string;
	referrerIds?: string[];
	router: any;
};
async function addToWaitingList({
	name,
	email,
	referralSource,
	referrers,
	specificReferral,
	referrerIds,
	router,
}: Props) {
	const sanitizedName = DOMPurify.sanitize(name);
	const sanitizedEmail = DOMPurify.sanitize(email);
	const sanitizedReferralSource = DOMPurify.sanitize(referralSource || "");
	const sanitizedReferrers = referrers && sanitizeJsonObject(referrers);
	const sanitizedSpecificReferral = DOMPurify.sanitize(specificReferral || "");
	const sanitizedReferrerIds = referrerIds && sanitizeStringArray(referrerIds);
	//
	if (!referrerIds) {
		if (referralSource !== "") {
			await axios
				.post("/api/waiting_list", {
					name: sanitizedName,
					email: sanitizedEmail,
					referralSource: sanitizedReferralSource,
					specificReferral: sanitizedSpecificReferral,
				})
				.then((res) => {
					router.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					);
					return;
				})
				.catch((err) => {
					console.log("/api/waiting_list >> err", err);
					return;
				});
		} else {
			await axios
				.post("/api/waiting_list", {
					name: sanitizedName,
					email: sanitizedEmail,
				})
				.then((res) => {
					router.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					);
					return;
				})
				.catch((err) => {
					console.log("/api/waiting_list >> err", err);
					return;
				});
		}
	} else {
		await axios
			.post("/api/waiting_list", {
				name: sanitizedName,
				email: sanitizedEmail,
				referralSource: sanitizedReferralSource,
				referrerIds: sanitizedReferrerIds,
				referrers: sanitizedReferrers,
				specificReferral: sanitizedSpecificReferral,
			})
			.then((res) => {
				router.push(
					`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
				);
				return;
			})
			.catch((err) => {
				console.log("/api/waiting_list >> err", err);
				return;
			});
	}
}

export default addToWaitingList;
