import React from "react";

type Props = {};

export default function Footer({}: Props) {
	return (
		<div className='pb-[100px] px-[64px]'>
			<div>
				<a
					href='/privacy-policy'
					className='text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] text-sm'
				>
					Privacy Policy
				</a>
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
