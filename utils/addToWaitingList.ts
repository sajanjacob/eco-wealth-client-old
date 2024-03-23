import axios from "axios";
import DOMPurify from "dompurify";
import sanitizeJsonObject from "./sanitizeJsonObject";
import sanitizeStringArray from "./sanitizeStringArray";
type Props = {
	name: string;
	email: string;
	referralSource?: string;
	referrers?: object[];
	referrerIds?: string[];
	router: any;
	setLoading: (loading: boolean) => void;
};
async function addToWaitingList({
	name,
	email,
	referralSource,
	referrers,
	referrerIds,
	router,
	setLoading,
}: Props) {
	const sanitizedName = DOMPurify.sanitize(name);
	const sanitizedEmail = DOMPurify.sanitize(email);
	const sanitizedReferralSource = DOMPurify.sanitize(referralSource || "");
	const sanitizedReferrers = referrers && sanitizeJsonObject(referrers);
	const sanitizedReferrerIds = referrerIds && sanitizeStringArray(referrerIds);
	//
	if (!referrerIds) {
		if (referralSource !== "") {
			await axios
				.post("/api/waiting_list", {
					name: sanitizedName,
					email: sanitizedEmail,
					referralSource: sanitizedReferralSource,
				})
				.then((res) => {
					setLoading(false);
					router.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					);
					return;
				})
				.catch((err) => {
					setLoading(false);
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
					setLoading(false);
					router.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					);
					return;
				})
				.catch((err) => {
					setLoading(false);
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
			})
			.then((res) => {
				setLoading(false);
				router.push(
					`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
				);
				return;
			})
			.catch((err) => {
				setLoading(false);
				console.log("/api/waiting_list >> err", err);
				return;
			});
	}
}

export default addToWaitingList;
