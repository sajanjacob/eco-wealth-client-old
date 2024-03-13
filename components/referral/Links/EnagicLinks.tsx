import copyToClipboard from "@/utils/copyToClipboard";
import React from "react";

type Props = {
	referrerIds: string;
};

export default function EnagicLinks({ referrerIds }: Props) {
	const landingPageLink = `https://ecowealth.app/prdcts/enagic?r=${referrerIds}`;
	const orderPageLink = `https://ecowealth.app/prdcts/enagic/order?r=${referrerIds}`;

	return (
		<div>
			<div className='mt-2'>
				<label>Landing page:</label>
				<div className='flex mt-[2px]'>
					<p
						className='cursor-pointer mr-2 border-[var(--cta-one)] border-2 p-2 rounded-md w-[max-content] hover:text-[var(--cta-one)] transition-colors'
						onClick={() => copyToClipboard(landingPageLink)}
					>
						{landingPageLink}
					</p>
					<button
						onClick={() => copyToClipboard(landingPageLink)}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer'
					>
						Copy link
					</button>
				</div>
			</div>
			<div className='mt-4'>
				<label>Order page:</label>
				<div className='flex mt-[2px]'>
					<p
						className='cursor-pointer mr-2 border-[var(--cta-one)] border-2 p-2 rounded-md w-[max-content] hover:text-[var(--cta-one)] transition-colors'
						onClick={() => copyToClipboard(orderPageLink)}
					>
						{orderPageLink}
					</p>
					<button
						onClick={() => copyToClipboard(orderPageLink)}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer'
					>
						Copy link
					</button>
				</div>
			</div>
		</div>
	);
}
