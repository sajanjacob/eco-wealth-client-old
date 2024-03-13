import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type Props = {};

export default function ReferralMenu({}: Props) {
	const router = useRouter();
	// list of active referrals
	// list of pending, & previous payouts
	// show agreement
	// Links to share
	const searchParams = useSearchParams();

	const activeTab = searchParams?.get("tab");

	const HandleMenuLinkClick = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		{ destination }: { destination: string }
	) => {
		e.preventDefault();
		// navigate to destination
		router.push(`/r/?tab=${destination}`);
	};

	return (
		<div className='xl:flex-col flex rounded-md border-[1px] w-max p-3 border-green-950'>
			<h2 className='mr-2 xl:mb-2 text-gray-300'>Referral Menu —</h2>
			<p
				className={
					activeTab === "links"
						? "mr-2 xl:mb-2 cursor-default text-green-400"
						: "text-gray-400 mr-2 xl:mb-2 cursor-pointer hover:text-green-400 transition-colors"
				}
				onClick={(e) => HandleMenuLinkClick(e, { destination: "links" })}
			>
				Links
			</p>
			<p
				className={
					activeTab === "referrals"
						? "mr-2 xl:mb-2 cursor-default text-green-400"
						: "text-gray-400 mr-2 xl:mb-2 cursor-pointer hover:text-green-400 transition-colors"
				}
				onClick={(e) => HandleMenuLinkClick(e, { destination: "referrals" })}
			>
				Referrals
			</p>
			<p
				className={
					activeTab === "payouts"
						? "mr-2 xl:mb-2 cursor-default text-green-400"
						: "text-gray-400 mr-2 xl:mb-2 cursor-pointer hover:text-green-400 transition-colors"
				}
				onClick={(e) => HandleMenuLinkClick(e, { destination: "payouts" })}
			>
				Payouts
			</p>
			<p
				className={
					activeTab === "compensation"
						? "mr-2 xl:mb-2 cursor-default text-green-400"
						: "text-gray-400 mr-2 xl:mb-2 cursor-pointer hover:text-green-400 transition-colors"
				}
				onClick={(e) => HandleMenuLinkClick(e, { destination: "compensation" })}
			>
				Compensation
			</p>
			<p
				className={
					activeTab === "agreement"
						? "mr-2 xl:mb-2 cursor-default text-green-400"
						: "text-gray-400 mr-2 xl:mb-2 cursor-pointer hover:text-green-400 transition-colors"
				}
				onClick={(e) => HandleMenuLinkClick(e, { destination: "agreement" })}
			>
				Agreement
			</p>
			<p
				className={
					activeTab === "settings"
						? "mr-2 xl:mb-2 cursor-default text-green-400"
						: "text-gray-400 mr-2 xl:mb-2 cursor-pointer hover:text-green-400 transition-colors"
				}
				onClick={(e) => HandleMenuLinkClick(e, { destination: "settings" })}
			>
				Settings
			</p>
		</div>
	);
}
