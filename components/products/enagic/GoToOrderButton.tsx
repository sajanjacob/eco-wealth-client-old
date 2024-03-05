import { buttonClass } from "@/lib/tw-styles";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function GoToOrderButton({}: Props) {
	const router = useRouter();
	// Order
	const handleOrderButtonClick = () => {
		router.push("/prdcts/enagic/order");
	};
	return (
		<button
			className={buttonClass}
			onClick={handleOrderButtonClick}
		>
			Order a machine today
		</button>
	);
}
