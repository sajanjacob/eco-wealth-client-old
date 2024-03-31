"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import handleReferrerIds from "@/utils/handleReferrerIds";
type Props = {
	setReferralSource: (arg0: string) => void;
	setReferrers: (arg0: string) => void;
};

export default function CheckReferral({
	setReferralSource,
	setReferrers,
}: Props) {
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");

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

	// Check if referrerIds is present in localStorage
	const handleExistingReferral = async (referrerIds: string) => {
		// @ts-ignore
		await handleReferrerIds(referrerIds, setReferrers);
	};
	return <></>;
}
