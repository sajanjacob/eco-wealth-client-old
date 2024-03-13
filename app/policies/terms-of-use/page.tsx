"use client";
import SupportLink from "@/components/SupportLink";
import { linkClass } from "@/lib/tw-styles";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {};

export default function TermsOfUse({}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, []);
	return (
		<div className='w-3/4 mx-auto py-16'>
			<h1 className='text-2xl font-bold'>Terms of Use</h1>{" "}
			<sub className='text-gray-600'>Last Updated: March 8, 2023</sub>
			<h2 className='text-lg font-bold mt-4'>Welcome to Eco Wealth</h2>
			<p className='text-gray-400'>
				Welcome to our platform, Eco Wealth, operated by Eco Apps and
				Automation, Inc (&quot;Eco Wealth,&quot; &quot;we,&quot; &quot;us,&quot;
				or &quot;our&quot;). Our platform is dedicated to connecting
				eco-conscious investors with tree planting and solar farm projects. By
				using our website or any services linked to these terms
				(&quot;platform&quot;) or by participating in any of our projects,
				services, or affiliate offerings, you are agreeing to these Terms of
				Use.
			</p>
			<h2 className='text-lg font-bold mt-4'>Acceptance of Terms</h2>
			<p className='text-gray-400'>
				By accessing or using our platform, you acknowledge that you have read,
				understood, and agreed to be bound by these Terms of Use. You affirm you
				are legally competent to enter into this agreement. If you disagree with
				any part of these terms, you must cease using our platform immediately.
			</p>
			<h2 className='text-lg font-bold mt-4'>Arbitration Agreement</h2>
			<p className='text-gray-400'>
				By accepting these Terms of Use, you agree to resolve any disputes
				through binding arbitration, relinquishing the right to participate in
				class actions or to have disputes resolved by a jury or in court. More
				details are provided in the Dispute Resolution section below.
			</p>
			<h2 className='text-lg font-bold mt-4'>Comprehensive Agreement</h2>
			<p className='text-gray-400'>
				These Terms of Use, alongside our Privacy Policy, Cancellation and
				Refund Policy, and any other related terms, constitute a binding
				agreement between you and Eco Wealth. They govern your use of our
				platform. Any additional terms specific to certain purchases will be
				provided at the time of purchase.
			</p>
			<h2 className='text-lg font-bold mt-4'>Eligibility and Access</h2>
			<p className='text-gray-400'>
				Our platform and offers are intended for adults. By using them, you
				confirm you are at least 18 years old or the legal age in your
				jurisdiction, understand these terms, and can enter into binding
				agreements. Access for minors under 18 but over 13 requires parental
				consent.
			</p>
			<h2 className='text-lg font-bold mt-4'>Purchases</h2>
			<p className='text-gray-400'>
				Purchases must be initiated by adults using an approved payment method.
				We reserve the right to refuse service or cancel orders at our
				discretion.
			</p>
			<h2 className='text-lg font-bold mt-4'>Geographical Restrictions</h2>
			<p className='text-gray-400'>
				Our platform and offers are not available globally yet. Operations will
				start in North America and expand to the Eastern Hemisphere, shortly
				thereafter. By using our services, you acknowledge responsibility for
				compliance with local laws if accessing from restricted areas.
			</p>
			<h2 className='text-lg font-bold mt-4'>Privacy Practices</h2>
			<p className='text-gray-400'>
				Please review our{" "}
				<Link
					className={linkClass}
					href='/policies/privacy'
				>
					privacy policy
				</Link>{" "}
				to understand how we handle your personal information.
			</p>
			<h2 className='text-lg font-bold mt-4'>Conduct Expectations</h2>
			<p className='text-gray-400'>
				Users are expected to adhere to our Community Guidelines & Expectations,
				promoting a respectful and constructive environment. Violations may lead
				to access restrictions.
			</p>
			<h2 className='text-lg font-bold mt-4'>Intellectual Property</h2>
			<p className='text-gray-400'>
				Our codebase will be made open source excluding sensitive parts which
				anyone can replicate and use for their own funding needs. We are happy
				to assist you with setting up your own funding platform, please contact
				us at <SupportLink />.
			</p>
			<h2 className='text-lg font-bold mt-4'>Use Restrictions</h2>
			<p className='text-gray-400'>
				You are restricted from using the platform or affiliated offers for any
				unlawful purpose, to infringe upon rights, or to engage in behavior that
				may harm Eco Wealth, its affiliate partners, or its users.
			</p>
			<h2 className='text-lg font-bold mt-4'>Liability Limitation</h2>
			<p className='text-gray-400'>
				Eco Wealth disclaims all warranties to the maximum extent permitted by
				law. We will not be liable for any indirect or consequential damages
				arising from your use of our platform or affiliated offers.
			</p>
			<h2 className='text-lg font-bold mt-4'>
				Governing Law and Dispute Resolution
			</h2>
			<p className='text-gray-400'>
				These terms are governed by the laws of the province of Alberta for Eco
				Apps and Automation, Inc. Disputes will be resolved through arbitration
				in accordance with these terms.
			</p>
			<h2 className='text-lg font-bold mt-4'>Changes and Termination</h2>
			<p className='text-gray-400'>
				Eco Wealth reserves the right to modify these terms and our platform at
				any time. Your continued use after changes indicates acceptance. We may
				terminate your access for violation of these terms.
			</p>
			<h2 className='text-lg font-bold mt-4'>Contact Us</h2>
			<p className='text-gray-400'>
				For any questions or concerns, please contact us at <SupportLink />. We
				are committed to providing excellent customer support. By using the Eco
				Wealth platform, you signify your agreement to these Terms of Use and
				commit to contributing positively towards sustainable investment
				opportunities.
			</p>
		</div>
	);
}
