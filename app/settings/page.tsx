"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import PersonalDetails from "@/components/settings/PersonalDetails";
import PasswordAndSecurity from "@/components/settings/PasswordAndSecurity";
import Billing from "@/components/settings/Billing";
import Roles from "@/components/settings/Roles";
import Notifications from "@/components/settings/Notifications";

type Props = {};

export default function Settings({}: Props) {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const navigateTo = (path: string) => {
		router.push(path);
	};
	const user = useAppSelector((state: RootState) => state.user);

	const links = [
		"personal-details",
		"notifications",
		"password-and-security",
		"billing",
		"roles",
	];

	useEffect(() => {
		if (searchParams.get("tab") === null) {
			navigateTo(`/settings/?tab=personal-details`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderTabContent = (tab: string) => {
		switch (tab) {
			case "personal-details":
				return <PersonalDetails user={user} />;
			case "notifications":
				return <Notifications user={user} />;
			case "password-and-security":
				return <PasswordAndSecurity user={user} />;
			case "billing":
				return <Billing user={user} />;
			case "roles":
				return <Roles user={user} />;
			default:
				return null;
		}
	};

	return (
		<div className='flex h-screen'>
			<div className='w-1/4 p-4 mr-12'>
				<h1 className='mb-6 text-2xl font-semibold text-center'>
					Account Settings
				</h1>

				{links.map((link) => (
					<button
						key={link}
						className={`mb-4 w-full p-2 rounded ${
							searchParams.get("tab") === link
								? "text-white bg-green-700 cursor-default"
								: "text-white bg-gray-800 hover:bg-gray-700 transition-colors"
						}`}
						onClick={() => navigateTo(`/settings?tab=${link}`)}
					>
						{link
							.split("-")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")}
					</button>
				))}
			</div>

			<div className='w-3/4 p-4'>
				{renderTabContent(searchParams.get("tab") as string)}
			</div>
		</div>
	);
}
