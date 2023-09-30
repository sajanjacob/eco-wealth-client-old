"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdWarning } from "react-icons/md";

type Props = {
	urgentNotification: {
		message: string;
		actionUrl: string;
		actionType: string;
	};
};

export default function UrgentNotification({ urgentNotification }: Props) {
	const router = useRouter();
	const [show, setShow] = useState(true);
	const handleSetVisibility = () => {
		setShow(false);
	};
	if (!show) {
		return null;
	}

	return (
		<div className='w-3/4 mx-auto'>
			<div className='relative'>
				<button
					onClick={handleSetVisibility}
					className='text-xs text-yellow-700 opacity-70 hover:opacity-100 transition-all'
				>
					X Dismiss
				</button>
			</div>
			<div className='flex justify-between items-center mb-4  border border-yellow-700  rounded-lg px-8 py-4'>
				<h2 className='text-yellow-700'>
					<span className='flex items-center'>
						<MdWarning className='mr-2' /> {urgentNotification.message}
					</span>
				</h2>
				<button
					onClick={() => router.push(`${urgentNotification.actionUrl}`)}
					className='bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
				>
					{urgentNotification.actionType}
				</button>
			</div>
		</div>
	);
}
