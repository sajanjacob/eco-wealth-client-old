import React from "react";

type Props = {};

export default function SupportLink({}: Props) {
	return (
		<>
			<a
				href='mailto:support@ecowealth.app'
				target='_blank'
				className='text-[var(--cta-one)] hover:text-[var(--cta-one-hover)]'
			>
				support@ecowealth.app
			</a>
		</>
	);
}
