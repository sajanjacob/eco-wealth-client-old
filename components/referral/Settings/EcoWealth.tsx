import DonationSlider from "@/components/DonationSlider";
import React from "react";
import ApisComingSoon from "../ApisComingSoon";

type Props = {};

export default function EcoWealth({}: Props) {
	const onChange = (value: number) => {
		console.log(value);
	};
	return (
		<div>
			<DonationSlider
				onChange={onChange}
				product='Eco Wealth'
			/>
			<ApisComingSoon />
		</div>
	);
}
