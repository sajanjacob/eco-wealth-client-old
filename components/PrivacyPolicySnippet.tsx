import React from "react";
import { BiLock } from "react-icons/bi";

type Props = {};

export default function PrivacyPolicySnippet({}: Props) {
	return (
		<div>
			<p className='text-xs mt-2 text-gray-500'>
				<BiLock className='inline text-base' />
				<b>Your Privacy:</b> We promise to keep your data confidential and only
				contact you with information regarding EcoWealth products and services
				and the occasional affiliate partner offerings.
			</p>
			<p className='text-xs mt-2 text-gray-500'>
				<b>Note:</b> More details in our{" "}
				<a
					href='/privacy-policy'
					className='underline cursor-pointer hover:text-gray-400 transition-all'
				>
					privacy policy
				</a>
				.
			</p>
		</div>
	);
}
