import React from "react";

type Props = {};

export default function SupportLink({}: Props) {
	return (
		<div>
			<a
				href='https://ecoappsandautomation.freshdesk.com/'
				target='_blank'
				className='text-[var(--cta-one)] hover:text-[var(--cta-one-hover)]'
			>
				ecoappsandautomation.freshdesk.com.
			</a>
		</div>
	);
}
