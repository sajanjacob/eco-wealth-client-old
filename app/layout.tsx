import "./globals.css";
import { Providers } from "@/redux/provider";
import Header from "@/components/global/Header";
import "react-tooltip/dist/react-tooltip.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import CookieConsent from "@/components/global/CookieConsent";
import Check from "@/components/referrer/Check";

export const metadata: Metadata = {
	title: "Eco Wealth",
	description:
		"Eco Wealth is a crowdfunding platform for tree-based agriculture and solar energy projects.",
	openGraph: {
		images: "/images/mandala_logo_green.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className='dark custom-scrollbar'
		>
			<body>
				<Providers>
					<Check />
					<Header />
					<ToastContainer />
					{children}
					<CookieConsent />
				</Providers>
			</body>
		</html>
	);
}
