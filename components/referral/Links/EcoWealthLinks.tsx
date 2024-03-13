import copyToClipboard from "@/utils/copyToClipboard";
import React from "react";

type Props = {
	referrerIds: string;
};

export default function EcoWealthLinks({ referrerIds }: Props) {
	const homePageReferralLink = `https://ecowealth.app/?r=${referrerIds}`;
	const waitingListReferralLink = `https://ecowealth.app/register?r=${referrerIds}`;
	const referralLink = `?r=${referrerIds}`;
	return (
		<div>
			<div className='mt-2'>
				<label>Home page:</label>
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
			</div>
			<div className='mt-4'>
				<label>Public project pages:</label>
				<p className='text-gray-400 text-sm'>
					Add this to any public project page to include your referral link like
					this:
					<br />
					<code>
						https://alpha.ecowealth.app/pub/projects/[id]{referralLink}
					</code>
				</p>
				<div className='flex mt-[2px]'>
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
