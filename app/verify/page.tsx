"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import {
	FacebookMessengerShareButton,
	FacebookShareButton,
	RedditShareButton,
	LinkedinShareButton,
	EmailShareButton,
	TwitterShareButton,
	FacebookIcon,
	RedditIcon,
	LinkedinIcon,
	EmailIcon,
	TwitterIcon,
} from "next-share";
import { MdErrorOutline } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import SupportLink from "@/components/SupportLink";
type Props = {};

export default function Verify({}: Props) {
	const searchParams = useSearchParams();
	const token = searchParams?.get("token");
	const [verified, setVerified] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	useEffect(() => {
		setLoading(true);
		axios
			.put("/api/verify", { token })
			.then((res) => {
				console.log("res: ", res);
				setVerified(true);
				setLoading(false);
			})
			.catch((err) => {
				console.log("err: ", err);
				setLoading(false);
				setError(true);
			});
	}, [token]);

	if (!verified && loading) {
		return (
			<div className='flex justify-center flex-col items-center pt-52'>
				Loading...
			</div>
		);
	}
	if (error) {
		return (
			<div className='flex justify-center flex-col items-center pt-52'>
				<MdErrorOutline className='text-[208px] mb-4 font-light text-yellow-400' />
				<h2 className='font-bold'>
					There was an error verifying your email. Please submit a support
					ticket at <SupportLink />
				</h2>
			</div>
		);
	}
	if (verified)
		return (
			<div className='flex justify-center flex-col items-center p-8'>
				<IoMdCheckmarkCircleOutline className='text-[148px] md:text-[208px] mb-4 font-light text-green-400' />
				<h1 className='text-2xl md:text-3xl bold'>
					Thank you, your email has been verified and you&apos;ve joined the
					waiting list! 🎉
				</h1>
				<p className='mt-8'>Consider sharing Eco Wealth with a friend!</p>

				<div className='flex mt-2'>
					<div className='mr-2'>
						<FacebookShareButton url={"https://ecowealth.app"}>
							<FacebookIcon
								size={48}
								round
							/>
						</FacebookShareButton>
					</div>
					<div className='mr-2'>
						<RedditShareButton url={"https://ecowealth.app"}>
							<RedditIcon
								size={48}
								round
							/>
						</RedditShareButton>
					</div>
					<div className='mr-2'>
						<LinkedinShareButton url={"https://ecowealth.app"}>
							<LinkedinIcon
								size={48}
								round
							/>
						</LinkedinShareButton>
					</div>
					<div className='mr-2'>
						<EmailShareButton url={"https://ecowealth.app"}>
							<EmailIcon
								size={48}
								round
							/>
						</EmailShareButton>
					</div>
					<div className='mr-2'>
						<TwitterShareButton url={"https://ecowealth.app"}>
							<TwitterIcon
								size={48}
								round
							/>
						</TwitterShareButton>
					</div>
				</div>
			</div>
		);
}
