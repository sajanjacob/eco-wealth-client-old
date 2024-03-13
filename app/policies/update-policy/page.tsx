"use client";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

type Props = {};

export default function UpdatePolicy({}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, []);
	return (
		<div className='w-3/4 mx-auto py-16'>
			<h1 className='text-2xl font-bold'>Update Policy</h1>
			<sub className='text-gray-600'>Effective Date: March 7, 2024</sub>
			<p className='mt-4 text-gray-400'>
				Eco Wealth, operated by Eco Apps and Automation, Inc. (&quot;Eco
				Wealth&quot; or &quot;the Company&quot;) is dedicated to providing
				environmental investment opportunities and educational resources. By
				accessing, purchasing, or engaging with our website, educational
				content, investment platforms, services, materials, or events (&quot;Eco
				Wealth Services&quot;), you acknowledge and consent to do so in
				accordance with our officially published Terms of Service, Privacy
				Policy, Disclaimers, and Purchase Conditions. Please be aware that all
				these documents are dynamic and subject to modifications.
			</p>{" "}
			<p className='mt-4 text-gray-400'>
				It&apos;s essential that you review and comprehend the following
				advisory each time you engage with our services. Similar to our Terms of
				Service, Privacy Policy, Community Guidelines, and Disclaimers, the
				information on this website and within Eco Wealth Services is prone to
				updates and changes over time. The content you encounter may be
				different on your next visit. These adjustments are made by the Company
				in response to evolving business needs, regulatory requirements, and to
				safeguard our digital properties and services.
			</p>{" "}
			<p className='mt-4 text-gray-400'>
				To stay informed about relevant changes or updates to our policies and
				services, we recommend regularly reviewing policies. Except as required
				by applicable laws, we may not provide direct notifications before or
				after implementing changes or updates.
			</p>
		</div>
	);
}
