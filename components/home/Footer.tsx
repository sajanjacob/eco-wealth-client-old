import React from "react";

type Props = {};

export default function Footer({}: Props) {
	return (
		<div className='pb-[100px] px-[64px]'>
			<div>
				<div className='flex'>
					<a
						href='/policies/privacy'
						className='mr-4 text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] text-sm'
					>
						Privacy Policy
					</a>
					<a
						href='/policies/terms-of-use'
						className='mr-4 text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] text-sm'
					>
						Terms of Use
					</a>
					<a
						href='/policies/disclaimer'
						className='mr-4 text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] text-sm'
					>
						Disclaimer
					</a>
					<a
						href='/policies/update-policy'
						className='mr-4 text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] text-sm'
					>
						Update Policy
					</a>
				</div>
				<p className='text-sm text-gray-500'>
					We are not affiliated with or endorsed by X™, Meta™, Facebook™,
					Instagram™, Threads™, TikTok™, Google™, Isha Foundation, Cauvery
					Calling, Save Soil, or any of their subsidiaries, holding companies,
					related organizations, or initiatives. Eco Wealth is an independent
					startup based out of Canada focused on raising investments for
					tree-based agriculture and renewable energy projects.
				</p>
			</div>
		</div>
	);
}
