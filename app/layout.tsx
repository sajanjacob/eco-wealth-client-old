"use client";
import "./globals.css";
import { Providers } from "@/redux/provider";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
	title: "Eco Wealth",
	description: "A green-tech investment platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const path = usePathname();
	return (
		<html
			lang='en'
			className='dark custom-scrollbar'
		>
			<body>
				<Providers>
					{path !== "/thankyou" &&
					path !== "/login" &&
					path !== "/signup" &&
					path !== "/i/onboarding" &&
					path !== "/p/onboarding" &&
					path !== "/setup-mfa" ? (
						<Header />
					) : null}
					<ToastContainer />
					{children}
				</Providers>
			</body>
		</html>
	);
}
