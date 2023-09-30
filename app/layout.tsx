import "./globals.css";
import { Providers } from "@/redux/provider";
import Header from "@/components/Header";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Eco Wealth",
	description:
		"Eco Wealth is a platform that allows you to invest in tree planting and solar energy projects.",
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
					<Header />
					<ToastContainer />
					{children}
				</Providers>
			</body>
		</html>
	);
}
