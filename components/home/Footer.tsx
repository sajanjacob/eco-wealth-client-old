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
			</div>
		</div>
	);
}
