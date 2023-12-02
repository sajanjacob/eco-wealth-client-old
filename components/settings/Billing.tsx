import React from "react";

type Props = {
	user: UserState;
};

export default function Billing({ user }: Props) {
	return (
		<div>
			<h1 className='md:mb-2 text-2xl font-semibold'>Billing</h1>
			<div className='flex flex-col items-center justify-center h-[50vh]'>
				<p>This page is currently being developed.</p>
			</div>
		</div>
	);
}
