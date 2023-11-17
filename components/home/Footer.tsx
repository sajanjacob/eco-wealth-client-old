import React from "react";

type Props = {};

export default function Footer({}: Props) {
	return (
		<div className='pb-[100px] px-[64px]'>
			<div>
				<a
					href='/privacy-policy'
					className='text-green-500 hover:text-green-600 text-sm'
				>
					Privacy Policy
				</a>
			</div>
		</div>
	);
}
