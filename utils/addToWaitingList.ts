import axios from "axios";
import DOMPurify from "dompurify";
import sanitizeJsonObject from "./sanitizeJsonObject";
import sanitizeStringArray from "./sanitizeStringArray";
import sanitizeArrayOfObjects from "./sanitizeArrayOfObjects";
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
	const sanitizedReferrers = referrers && sanitizeArrayOfObjects(referrers);
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
					router
						.push(
							`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
						)
						.then(setTimeout(() => setLoading(false), 3000));
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
					router
						.push(
							`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
						)
						.then(setTimeout(() => setLoading(false), 3000));
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
				router
					.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					)
					.then(setTimeout(() => setLoading(false), 3000));
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
[
	"aab6cd38-9051-4127-a3d2-75287e04cb60",
	"ce7ef793-cdcf-4490-9539-fb761c4e4d46",
	"202774d3-11a4-4ea3-9201-6cc3148a07b6",
];
