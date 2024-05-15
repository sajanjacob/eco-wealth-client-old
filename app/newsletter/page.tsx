import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

export default function Page({}: Props) {
	const router = useRouter();
	useEffect(() => {
		router.push("/newsletter/30-tips");
	}, []);
	return (
		<div className='blog-content'>
			<h1>Sign up for our newsletter!</h1>
		</div>
	);
}
