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
import ProducerAddresses from "@/components/settings/ProducerAddresses";
import withAuth from "@/utils/withAuth";

type Props = {};

function Settings({}: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const navigateTo = (path: string) => {
		router.push(path);
	};
	const user = useAppSelector((state: RootState) => state.user);

	const links = [
		"personal-details",
		"notifications",
		"account security",
		"billing",
		"roles",
		`${user?.roles.includes("producer") ? "properties" : ""}`,
	];

	useEffect(() => {
		if (searchParams?.get("tab") === null) {
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
			case "account security":
				return <PasswordAndSecurity user={user} />;
			case "billing":
				return <Billing user={user} />;
			case "roles":
				return <Roles user={user} />;
			case "properties":
				return <ProducerAddresses user={user} />;
			default:
				return null;
		}
	};

	return (
		<div className='md:h-screen md:flex'>
			<div className='md:w-1/4 p-4 md:mr-12 flex overflow-scroll md:overflow-hidden items-center md:flex-col'>
				<h1 className='mb-2 mr-2 md:mb-6 md:text-2xl font-semibold text-center text-gray-300'>
					Account Settings
				</h1>

				{links.map((link) => {
					if (link === null || link === "") return null;
					return (
						<button
							key={link}
							className={`text-sm md:text-base mx-2 mb-2 md:mb-4 h-[10vh] md:h-[max-content] md:w-[100%] py-2 px-4 md:p-2 rounded ${
								searchParams?.get("tab") === link
									? "text-white bg-[var(--cta-one)] cursor-default"
									: "text-white bg-gray-800 hover:bg-gray-700 transition-colors"
							}`}
							onClick={() => navigateTo(`/settings?tab=${link}`)}
						>
							{link
								.split("-")
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" ")}
						</button>
					);
				})}
			</div>

			<div className='w-[100%] md:w-3/4 p-4'>
				{renderTabContent(searchParams?.get("tab") as string)}
			</div>
		</div>
	);
}

export default withAuth(Settings);
