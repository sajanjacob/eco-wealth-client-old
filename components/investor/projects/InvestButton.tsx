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
				className='py-2 px-6 rounded bg-[var(--cta-one)] text-white font-bold transition-all hover:bg-[var(--cta-one-hover)] hover:scale-105'
			>
				Invest Now
			</button>
		</div>
	);
}
