"use client";
import ReferralAgreement from "@/components/referral/ReferralAgreement";
import { Component as Links } from "@/components/referral/Links/Component"; // Fix the casing of the import statement
import { Component as Compensation } from "@/components/referral/Compensation/Component"; // Fix the casing of the import statement
import ReferralMenu from "@/components/referral/ReferralMenu";
import ReferralPayouts from "@/components/referral/ReferralPayouts";
import { Component as Referrals } from "@/components/referral/Referrals/Component";
import { Component as Settings } from "@/components/referral/Settings/Component";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

function ReferralCenter({}: Props) {
	const user = useAppSelector((state) => state.user);
	const referralId = user.referralId;
	const agreementAcceptedAt = user.refAgreementAcceptedAt;
	const refAgreement = user.refAgreement;
	const searchParams = useSearchParams();
	const router = useRouter();

	const navigateTo = (path: string) => {
		router.push(path);
	};
	useEffect(() => {
		if (searchParams?.get("tab") === null) {
			navigateTo(`/r?tab=links`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const renderTabContent = (tab: string) => {
		switch (tab) {
			case "links":
				return <Links />;
			case "referrals":
				return <Referrals />;
			case "payouts":
				return <ReferralPayouts />;
			case "compensation":
				return <Compensation />;
			case "settings":
				return <Settings />;
			case "agreement":
				return (
					<ReferralAgreement
						referralId={referralId}
						agreementAcceptedAt={agreementAcceptedAt}
					/>
				);
			default:
				return null;
		}
	};

	// Show referral agreement if user has not agreed to it yet
	if (!refAgreement) {
		return (
			<div className='w-[90vw] mx-auto my-8'>
				<h1 className='text-3xl mb-2'>Referral Center</h1>
				<ReferralAgreement />
			</div>
		);
	}

	// Show referral center if user has agreed to referral agreement
	if (refAgreement)
		return (
			<div className='w-[90vw] mx-auto my-8'>
				<h1 className='text-3xl mb-2'>Referral Center</h1>
				<div className='xl:flex flex-col'>
					<ReferralMenu />
					<div>
						{renderTabContent((searchParams?.get("tab") as string) || "links")}
					</div>
				</div>
			</div>
		);
}

export default withAuth(ReferralCenter);
