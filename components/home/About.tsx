import React from "react";

type Props = {};

export default function About({}: Props) {
	return (
		<div
			id='about'
			className='anchor'
		>
			<div className='py-[100px] px-[64px]'>
				<div className='text-2xl font-semibold'>
					<h3 className='text-3xl font-bold '>The Vision:</h3>
					<h3 className='mt-4'>
						Collectively plant more trees than we destroy and transition to
						renewable energy generation faster.
					</h3>
				</div>
				<div className='mt-4 text-gray-400'>
					<p>
						With trees, we destroy over 15 billion trees every year and{" "}
						<i>only replant 1.9 billion trees annually.</i>{" "}
						<b>
							Our vision is to reverse the equation and plant more trees than we
							destroy annually
						</b>
						.
					</p>
					<p className='mt-2'>
						With energy,{" "}
						<i>
							we are harvesting less than 1% of the sun&apos;s energy that hits
							the Earth at any given moment.
						</i>{" "}
						<b>Our vision is to increase this percentage globally</b>
					</p>
				</div>
			</div>
		</div>
	);
}
