"use client";
import ReferralAgreement from "@/components/referral/ReferralAgreement";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

function Onboarding({}: Props) {
	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	useEffect(() => {
		if (user.refAgreement) {
			router.push("/r?tab=links");
		}
	}, [user]);
	return (
		<div>
			<ReferralAgreement />
		</div>
	);
}

export default withAuth(Onboarding);
