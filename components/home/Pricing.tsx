import React from "react";

type Props = {};

export default function Pricing({}: Props) {
	return (
		<>
			<hr className='border-green-400' />
			<div
				id='pricing'
				className='py-[100px] px-[64px]'
			>
				<h1 className='text-3xl font-bold'>
					Transparent Pricing for Your Investments
				</h1>
				<div className='mt-8'>
					<h3 className='text-lg font-bold'>
						At Eco Wealth, we believe in transparent and straightforward
						pricing, ensuring you can invest with confidence and clarity.
						Here&apos;s how our pricing works:
					</h3>
					<div className='py-4 px-8'>
						<h4 className='text-lg font-bold mt-4'>
							Investment Processing Fees
						</h4>
						<hr className='my-4' />
						<p className='mb-4 mt-2'>
							<b>Merchant Order Processing Fee: </b> For each investment, a fee
							of 2.9% + $30 is applied. This fee covers the costs associated
							with processing your investment securely and efficiently.
						</p>
						<p className='my-4'>
							<b>Administrative Cost:</b> A nominal fee of $1 is charged for
							administrative expenses, ensuring the smooth management and
							operation of your investments.
						</p>{" "}
					</div>
					<div className='py-4 px-8'>
						<h4 className='text-lg font-bold'>Your Investment Benefits</h4>
						<hr className='my-4' />
						<p className='mb-4'>
							When you invest in a project through Eco Wealth, you gain access
							to a range of benefits, ensuring a rewarding and engaging
							investment experience:
						</p>
						<p className='my-4'>
							<b>Ownership of Project Share(s):</b> Gain direct ownership of
							shares in the green project of your choice, making a tangible
							impact on the environment and sustainable development.
						</p>
						<p className='my-4'>
							<b>Project Milestone Updates:</b> Stay informed with regular
							updates on your project&apos;s progress. Watch as your investment
							contributes to tangible environmental achievements.
						</p>
						<p className='my-4'>
							<b>Returns on Investment:</b> Depending on the project&apos;s
							success, and the type of project, you will receive a one-time or
							recurring returns on your investment. These returns are a
							testament to your contribution to both the environment and your
							financial portfolio.
						</p>
						<p className='my-4'>
							<b>Flexibility in Ownership:</b> Enjoy the flexibility to sell or
							transfer the ownership of your shares. Eco Wealth provides you
							with options to adapt your investment portfolio as your needs and
							priorities evolve.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
