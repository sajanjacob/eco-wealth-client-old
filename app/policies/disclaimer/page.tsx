"use client";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

type Props = {};

export default function Disclaimer({}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, []);
	return (
		<div className='w-3/4 mx-auto py-16'>
			<h1 className='text-2xl font-bold'>Disclaimers</h1>
			<sub className='text-gray-600'>Revised March 07, 2024</sub>
			<p className='text-gray-400 mt-4'>
				Eco Wealth, operated by Eco Apps and Automation Inc. (“The Company” or
				“Eco Wealth”) is dedicated to providing educational resources and
				opportunities in the green technology investment sector. By engaging
				with our website, investment platforms, educational content, community
				discussions, products, services, or events, you acknowledge and agree
				that we do not promise or guarantee 100% success rates from your
				investments. It is crucial that you read and fully understand the
				following disclaimers when accessing, using, subscribing to, or making
				purchases through Eco Wealth.
			</p>
			<h2 className='font-bold text-lg mt-4 mb-1'>
				Earning and Income Disclaimers
			</h2>
			<p className='text-gray-400'>
				Eco Wealth offers financial security products that offer set returns
				based on projected outcomes. Each project is subject to variable factors
				that can either positively or negatively influence project outcomes. Any
				educational content and information that should not be interpreted as
				specific investment advice or a guarantee of earnings.
			</p>{" "}
			<p className='text-gray-400 mt-2'>
				The results of your green technology investments can significantly vary
				and depend on multiple factors, including, but not limited to, the
				nature of the investment, market conditions, your level of experience,
				dedication, the effort and resources you apply, as well as circumstances
				and elements beyond anyone&apos;s control. You are advised to conduct
				thorough due diligence and consult with your own financial advisors
				before making any investment decisions or embarking on financial
				ventures.
			</p>
			<h2 className='font-bold text-lg mt-4 mb-1'>
				Investor, Producer, or Affiliate Earnings Disclaimers{" "}
			</h2>
			<p className='text-gray-400'>
				Some of Eco Wealth&apos;s clients may participate as either Investors,
				Producers, or Affiliates, earning income through either their
				investments, projects, or commissions by referring others to our
				platforms and third-party affiliate offers.{" "}
			</p>
			<p className='text-gray-400 mt-2'>
				Although we strive to ensure that all testimonials accurately represent
				our platform and its potential, it is important to understand that the
				impact, earnings or income statements of these individuals are their own
				and not guaranteed by Eco Wealth.
			</p>
			<h2 className='font-bold text-lg mt-4 mb-1'>Education</h2>
			<p className='text-gray-400'>
				Eco Wealth does not issue degrees, diplomas, credits, or educational
				qualifications equivalent to traditional academic institutions. Our
				educational resources are not intended as post-secondary education, are
				not accredited, do not qualify participants for employment, and do not
				prepare participants for any licensing examinations or professional
				certifications.
			</p>{" "}
			<p className='text-gray-400 mt-2'>
				Our focus with education is to provide knowledge and insights into the
				green technology investment sector for personal enrichment and potential
				financial opportunities within this emerging field.
			</p>
		</div>
	);
}
