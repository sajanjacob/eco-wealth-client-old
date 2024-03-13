"use client";
import SupportLink from "@/components/SupportLink";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

type Props = {};

export default function Privacy({}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, []);
	return (
		<div className='w-3/4 mx-auto py-16'>
			<h1 className='text-[22px] font-bold mb-4'>Privacy Policy</h1>

			<p className='text-gray-400'>
				At Eco Wealth, we are committed to protecting your privacy and ensuring
				the security of your personal information. This privacy policy outlines
				how we collect, use, and protect the information that we gather through
				our website and mobile application.
			</p>

			<h3 className='text-lg font-bold mt-4'>Information we collect</h3>
			<p className='text-gray-400'>
				We collect personal information that you provide to us when you create
				an account, make a transaction, or communicate with us. This may include
				your name, email address, phone number, and payment information. We also
				collect non-personal information automatically when you use our app,
				such as your device type, IP address, and browsing history.
			</p>

			<h3 className='text-lg font-bold mt-4'>How we use your information</h3>
			<p className='text-gray-400'>
				We use your personal information to provide you with our services,
				process your transactions, and communicate with you about your account.
				We may also use your information to improve our app and tailor our
				offerings to your interests. We may share your information with
				third-party service providers who assist us with processing
				transactions, analyzing data, and providing customer support. We do not
				sell or rent your personal information to third parties for their
				marketing purposes.
			</p>
			<p className='text-gray-400'>
				We share your information publicly on our website in the form of
				registrations which includes your first name, the first letter of your
				last name, and approximately how long ago you registered.
			</p>
			<p className='text-gray-400'>
				We may disclose your information if required by law or if we believe
				that such action is necessary to protect our rights or property or to
				protect the safety of our users or the public. We may share your
				information with any successor to all or part of our business.
			</p>
			<p className='text-gray-400'>
				We may share your information with any successor to all or part of our
				business. We may share your information with any successor to all or
				part of our business.
			</p>

			<h3 className='text-lg font-bold mt-4'>Data retention and security</h3>
			<p className='text-gray-400'>
				We retain your personal information for as long as necessary to provide
				you with our services and comply with our legal obligations. We take
				reasonable measures to protect your information from unauthorized
				access, use, or disclosure.
			</p>

			<h3 className='text-lg font-bold mt-4'>
				Cookies and tracking technologies
			</h3>
			<p className='text-gray-400'>
				We use cookies and other tracking technologies to collect non-personal
				information about your use of our app. This helps us improve our
				offerings and tailor our marketing to your interests.
			</p>

			<h3 className='text-lg font-bold mt-4'>Your choices</h3>
			<p className='text-gray-400'>
				You may opt out of receiving marketing communications from us at any
				time by following the instructions in our emails. You may also disable
				cookies in your browser settings.
			</p>

			<h3 className='text-lg font-bold mt-4'>Children&apos;s privacy</h3>
			<p className='text-gray-400'>
				Our app is not intended for use by children under the age of 13. We do
				not knowingly collect personal information from children under the age
				of 13.
			</p>

			<h3 className='text-lg font-bold mt-4'>Changes to our privacy policy</h3>
			<p className='text-gray-400'>
				We reserve the right to update this privacy policy at any time. We will
				notify you of any material changes by posting the new policy on our
				website or app.
			</p>

			<h3 className='text-lg font-bold mt-4'>Contact us</h3>
			<p className='text-gray-400'>
				If you have any questions or concerns about our privacy policy, please
				submit a ticket at <SupportLink />
			</p>

			<p className='mt-5 text-sm'>Last updated: April 3 2023</p>
		</div>
	);
}
