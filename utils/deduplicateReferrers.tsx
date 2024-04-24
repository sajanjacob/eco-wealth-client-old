import { ReferrerItem } from "../app/api/waiting_list/route";

export function deduplicateReferrers(
	referrerArray: ReferrerItem[]
): ReferrerItem[] {
	const uniqueReferrers = new Map<string, ReferrerItem>();

	referrerArray.forEach((item) => {
		const referrerId = item.referrerId;
		if (!uniqueReferrers.has(referrerId)) {
			uniqueReferrers.set(referrerId, item);
		}
	});

	return Array.from(uniqueReferrers.values());
}
