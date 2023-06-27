import React from "react";
import { useRouter } from "next/navigation";
type Props = {
	id: string;
};

export default function InvestButton({ id }: Props) {
	const router = useRouter();
	const handleInvestButtonClick = () => {
		router.push(`/i/projects/${id}/invest`);
	};

	return (
		<div className=''>
			<button
				onClick={handleInvestButtonClick}
				className='py-2 px-6 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
			>
				Invest Now
			</button>
		</div>
	);
}
