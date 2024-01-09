import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
	width?: number;
	height?: number;
};

export default function Logo({ width, height }: Props) {
	const router = useRouter();
	const handleReturnHome = () => {
		router.push("/");
	};
	return (
		<div>
			<Image
				src='/white_logo_transparent_background.png'
				alt='EcoWealth logo'
				width={width || 300}
				height={height || 150}
				onClick={handleReturnHome}
				className='cursor-pointer'
			/>
		</div>
	);
}
