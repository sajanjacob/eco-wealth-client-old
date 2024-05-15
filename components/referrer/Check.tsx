"use client";
import { setRdxReferrers } from "@/redux/features/referrerSlice";
import { useAppDispatch } from "@/redux/hooks";
import handleReferrerIds from "@/utils/handleReferrerIds";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

export default function Check({}: Props) {
	const path = usePathname();
	const params = useSearchParams();
	const refIds = params?.get("r");
	const [referrers, setReferrers] = React.useState<Referrer[]>([]);
	const [referrerIds, setReferrerIds] = React.useState<string[]>([]);
	const [savedReferrers, setSavedReferrers] = React.useState<Referrer[]>([]);
	useEffect(() => {
		if (path) console.log("path >> ", path);
		// if (path === "/contact") return;
		// if (path?.includes("/contributors")) return;
		// if (path === "/contributors") return;
		if (refIds && JSON.parse(refIds) === referrerIds) return;
		const handleRefIds = async () =>
			await handleReferrerIds({
				pageSource: path!,
				setReferrers,
				setReferrerIds,
				setSavedReferrers,
			});
		handleRefIds();
	}, [path]);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (referrerIds.length > 0) {
			dispatch(setRdxReferrers({ savedReferrers }));
		}
	}, [referrerIds]);
	// TODO: save in redux
	// TODO: check if referrer ids in url changed
	// TODO: add exit path if no changes

	return <div></div>;
}
