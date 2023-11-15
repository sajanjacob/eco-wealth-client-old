import React from "react";

type Props = {};

export default function About({}: Props) {
	return (
		<div
			id='about'
			className='py-[100px] px-[64px]'
		>
			<h1 className='text-3xl font-bold'>Why use Eco Wealth?</h1>
			<div className='mt-8'>
				<h3 className='text-lg font-bold'>
					Our Vision: Investing in a Greener Tomorrow
				</h3>
				<p>
					Eco Wealth is dedicated to revolutionizing how we invest in our
					planet&apos;s future. With a focus on sustainability and ecological
					impact, our app provides a unique platform for eco-conscious investors
					to back meaningful green projects.
				</p>
			</div>
		</div>
	);
}
