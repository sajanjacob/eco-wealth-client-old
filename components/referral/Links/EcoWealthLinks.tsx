"use client";
import copyToClipboard from "@/utils/copyToClipboard";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { BiDownload } from "react-icons/bi";
import { useRouter } from "next/navigation";
type Props = {
	referralId: string;
};

export default function EcoWealthLinks({ referralId }: Props) {
	const homePageReferralLink = `https://ecowealth.app/?r=${referralId}`;
	const waitingListReferralLink = `https://ecowealth.app/register?r=${referralId}`;
	const referralLink = `?r=${referralId}`;
	const [showHomePageQr, setShowHomePageQr] = useState(false);
	const [showWaitingListQr, setShowWaitingListQr] = useState(false);
	const router = useRouter();

	// After 3s if the referralId is not available, refresh the page
	useEffect(() => {
		setTimeout(() => {
			if (!referralId) {
				router.refresh();
			}
		}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [referralId]);
	return (
		<div>
			<div className='mt-2'>
				<label>Home pagee:</label>
				<div className='flex mt-[2px]'>
					<p
						className='cursor-pointer mr-2 border-[var(--cta-one)] border-2 p-2 rounded-md w-[max-content] hover:text-[var(--cta-one)] transition-colors'
						onClick={() => copyToClipboard(homePageReferralLink)}
					>
						{homePageReferralLink}
					</p>
					<button
						onClick={() => copyToClipboard(homePageReferralLink)}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer'
					>
						Copy link
					</button>
				</div>
				<div className='mt-2'>
					<p
						className='text-gray-400 text-xs cursor-pointer hover:text-gray-300 transition-colors'
						onClick={() => setShowHomePageQr(!showHomePageQr)}
					>
						{showHomePageQr ? "Hide " : "Show "}QR Code
					</p>
					{showHomePageQr && (
						<QRCode
							value={homePageReferralLink}
							size={150}
							className='p-2 bg-white rounded-md w-max mt-2'
						/>
					)}
				</div>
			</div>
			<div className='mt-4'>
				<label>Waiting list registration:</label>
				<div className='flex mt-[2px]'>
					<p
						className='cursor-pointer mr-2 border-[var(--cta-one)] border-2 p-2 rounded-md w-[max-content] hover:text-[var(--cta-one)] transition-colors'
						onClick={() => copyToClipboard(waitingListReferralLink)}
					>
						{waitingListReferralLink}
					</p>
					<button
						onClick={() => copyToClipboard(waitingListReferralLink)}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer'
					>
						Copy link
					</button>
				</div>
				<div className='mt-2'>
					<p
						className='text-gray-400 text-xs cursor-pointer hover:text-gray-300 transition-colors'
						onClick={() => setShowWaitingListQr(!showWaitingListQr)}
					>
						{showWaitingListQr ? "Hide " : "Show "}QR Code
					</p>
					{showWaitingListQr && (
						<QRCode
							value={waitingListReferralLink}
							size={150}
							className='p-2 bg-white rounded-md w-max mt-2'
						/>
					)}
				</div>
			</div>
			<div className='mt-4'>
				<label>Public project pages:</label>
				<p className='text-gray-400 text-sm'>
					Add this to any public project page to include your referral link like
					this:
					<br />
					<code>
						https://alpha.ecowealth.app/pub/projects/[project_id]{referralLink}
					</code>
					<br />
					<b>Note:</b> replace &quot;[project_id]&quot; with the actual project
					id.
				</p>
				<div className='flex mt-2'>
					<p
						className='cursor-pointer mr-2 border-[var(--cta-one)] border-2 p-2 rounded-md w-[max-content] hover:text-[var(--cta-one)] transition-colors'
						onClick={() => copyToClipboard(referralLink)}
					>
						{referralLink}
					</p>
					<button
						onClick={() => copyToClipboard(referralLink)}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer'
					>
						Copy link
					</button>
				</div>
			</div>
		</div>
	);
}
