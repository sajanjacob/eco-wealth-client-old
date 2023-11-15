import React from "react";

type Props = {};

export default function HowItWorks({}: Props) {
	return (
		<>
			<hr className='border-green-400' />
			<div
				id='how-it-works'
				className='py-[100px] px-[64px]'
			>
				<h1 className='text-3xl font-bold'>
					How Eco Wealth Works: A Simple Path to Green Investing
				</h1>
				<div className='mt-8'>
					<h3 className='text-lg font-bold'>
						Eco Wealth simplifies the process of eco-conscious investing, making
						it easy for anyone to contribute to a greener future. Here&apos;s
						how it works:
					</h3>
					<p className='my-4'>
						<b>Sign Up and Explore: </b> Begin your journey by signing up on the
						Eco Wealth app. Browse through a curated selection of tree and solar
						projects, each with a detailed profile outlining its environmental
						impact and investment potential.
					</p>
					<p className='my-4'>
						<b>Choose Your Investment:</b> Select the project that resonates
						with you. Decide how many shares you wish to purchase, giving you
						flexibility and control over your investment amount.
					</p>{" "}
					<p className='my-4'>
						<b>Fund the Future:</b> Complete your investment to fund the
						project. Investments are pooled, and once a project reaches 80% of
						its funding goal, the producer can kickstart operations using the
						accumulated funds.
					</p>
					<p className='my-4'>
						<b>Track Progress and Receive Returns:</b> Stay updated on your
						project&apos;s growth and success. As the project matures, producers
						will distribute returns from the sale profits. Depending on the type
						of tree project, these returns are issued on a quarterly,
						semi-annual, or annual basis, ensuring a steady and rewarding
						investment experience.
					</p>
				</div>
			</div>
		</>
	);
}
