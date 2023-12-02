import React from "react";

type Props = {};

export default function Disclaimer({}: Props) {
	return (
		<div
			id='about'
			className='pt-[100px] pb-[50px] px-[64px]'
		>
			<h3 className='font-bold'>Investment Disclaimer</h3>
			<div className='md:mt-8 mt-2 text-sm'>
				<p className='text-gray-400'>
					Please note that the performance of investments with Eco Wealth is
					subject to environmental, economic conditions, and the competence of
					project team members. While we strive to select projects with great
					potential and committed teams, external factors beyond our control can
					significantly impact the outcome of each investment. We encourage our
					investors to conduct thorough due diligence and consider their
					personal risk tolerance before committing to any investment. Eco
					Wealth does not guarantee returns and investors should be prepared for
					the possibility of variable outcomes.
				</p>
			</div>
		</div>
	);
}
