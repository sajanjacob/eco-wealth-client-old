import React from "react";

type Props = {};

export default function Strategy({}: Props) {
	return (
		<>
			<hr className='border-green-400' />
			<div
				id='strategy'
				className='py-[100px] px-[64px]'
			>
				<h1 className='text-3xl font-bold'>Our Three-Phase Strategy</h1>
				<div className='mt-8'>
					<h3 className='text-lg font-bold'>
						Our Vision: Investing in a Greener Tomorrow
					</h3>
					<p className='my-2'>
						<b>Phase One:</b> Funding Private Tree and Solar Projects <br />
						Begin your journey by investing in private tree and solar farm
						projects. These initiatives are carefully selected for their
						environmental impact and potential for growth.{" "}
					</p>
					<p className='my-2'>
						<b>Phase Two:</b> Research and Develop Tree Health Tracking System
						<br />
						In this phase, you&apos;ll be able to stay closely informed and
						engaged with your tree project investments. Our innovative tree
						health tracking system will offer real-time data on the growth,
						health of the trees & soil of the tree projects you&apos;ve helped
						fund.
					</p>{" "}
					<p className='my-2'>
						<b>Phase Three:</b> Starting Free Tree and Solar Projects <br />
						As Eco Wealth grows, so does our commitment to the environment. We
						will initiate tree planting and solar projects to offer free produce
						and energy, expanding our reach and impact.
					</p>
				</div>
			</div>
		</>
	);
}
