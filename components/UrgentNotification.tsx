"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdWarning } from "react-icons/md";

type Props = {
	urgentNotification: {
		message: string;
		actionUrl: string;
		actionType: string;
		dismiss?: boolean;
	};
};

export default function UrgentNotification({ urgentNotification }: Props) {
	const router = useRouter();
	const { dismiss, message, actionUrl, actionType } = urgentNotification;
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
				{dismiss && (
					<button
						onClick={handleSetVisibility}
						className='text-xs text-yellow-700 opacity-70 hover:opacity-100 transition-all'
					>
						X Dismiss
					</button>
				)}
			</div>
			<div className='flex md:justify-between justify-center items-center mb-4  border border-yellow-700  rounded-lg px-4 md:px-8 py-4 text-center'>
				<MdWarning className='mr-2 text-2xl text-yellow-700' />
				<span className='md:flex md:items-center flex-1'>
					<h2 className='text-yellow-700 w-[100%]'>
						<span className='flex justify-center items-center text-sm md:text-base my-2'>
							{message}
						</span>
					</h2>
					<button
						onClick={() => router.push(`${actionUrl}`)}
						className='glow bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer text-sm md:text-base'
					>
						{actionType}
					</button>
				</span>
			</div>
		</div>
	);
}
