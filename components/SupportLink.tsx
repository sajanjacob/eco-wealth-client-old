import React from "react";

type Props = {};

export default function SupportLink({}: Props) {
	return (
		<div>
			<a
				href='https://ecoappsandautomation.freshdesk.com/'
				target='_blank'
				className='text-green-500 hover:text-green-600'
			>
				ecoappsandautomation.freshdesk.com.
			</a>
		</div>
	);
}
