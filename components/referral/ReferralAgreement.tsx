import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";
import Loading from "../Loading";
import moment from "moment";

type Props = {
	setRefAgreement?: React.Dispatch<React.SetStateAction<boolean>>;
	referrerIds?: string;
	agreementAcceptedAt?: string;
};

export default function ReferralAgreement({
	setRefAgreement,

	agreementAcceptedAt,
}: Props) {
	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const referrerIds = user.referrerIds;
	// Add user to referral ambassador list if they agree to T&C and refresh the page
	const HandleAgreementClick = async () => {
		await axios
			.post("/api/confirm_referral_agreement", {
				userId: user.id,
			})
			.then((res) => {
				console.log("res >>> ", res);
				dispatch(setUser({ ...user, refAgreement: true }));
			})
			.catch((err) => {
				console.log("Unable to add user to referral ambassador list: ", err);
			});
	};

	// Push user to homepage if they do not agree to T&C
	const HandleDisagreementClick = async () => {
		router.push("/");
	};
	if (user.loadingUser) return <Loading />;
	return (
		<div className='mt-4 text-gray-400'>
			<h1 className='text-3xl mb-4 text-white font-bold'>
				Eco Wealth Referral/Affiliate Policy
			</h1>
			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				1. Introduction
			</h2>
			<p>
				<strong>Objective:</strong> To grow Eco Wealth as a platform and offer
				eco-conscious influencers and sales professionals opportunities to earn
				cash rewards for new users and eco affiliate sales.
			</p>
			<p>
				<strong>Target Audience:</strong> Eco-conscious individuals who want to
				make a positive environmental impact through their daily activities.
			</p>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				2. Program Structure
			</h2>
			<ul>
				<li>
					<strong>Type of Program:</strong> Collaborative Affiliate/Referral
					Marketing.
				</li>
				<li>
					<strong>Definition:</strong> This type of program is designed to make
					sales a collaborative effort.
				</li>
				<li>
					Instead of one person reaping the reward, we track all activity and
					split the reward among all referrers who participated in making the
					sale.
				</li>
			</ul>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				3. Incentives and Rewards
			</h2>
			<ul>
				<li>
					<strong>Type of Compensation:</strong> Cash rewards.
				</li>
				<li>
					<strong>Project-Based Variance:</strong> No variance in rewards based
					on project type.
				</li>
				<li>
					<strong>Scaling Compensation:</strong> As you make more sales, your
					compensation will scale accordingly. You can view more details on the
					compensation structure of each offer in the compensation section.
				</li>
				<li>
					<strong>Commission Split:</strong> As mentioned in the program
					structure section, commissions are collaborative and split amongst all
					participating referral ambassadors.
				</li>
			</ul>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				4. Terms and Conditions
			</h2>
			<ul>
				<li>
					<strong>Eligibility Criteria:</strong> Must be a resident of Canada or
					the US and have a social media account.
				</li>
				<li>
					<strong>Referral Limits:</strong> Unlimited referrals, but
					compensation is currently once per referred user (subject to change).
				</li>
				<li>
					<strong>Dispute Resolution:</strong> Escalation to compliance & legal
					department, possible legal action against fraud, and dispute
					settlement based on effort and tracked activity.
				</li>
				<li>
					<strong>Free to Participate:</strong> No purchase is necessary to
					participate in the affiliate/referral program for any offers.
				</li>
			</ul>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				5. Tracking and Payments
			</h2>
			<ul>
				<li>
					<strong>Referral Tracking:</strong> Utilization of unique stacking
					referral tracking links.
				</li>
				<li>
					<strong>Payment Method:</strong> Direct deposit or Wise Bank transfer.
				</li>
			</ul>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				6. Marketing and Promotion
			</h2>
			<ul>
				<li>
					<strong>Promotional Channels:</strong> Through the app and email
					marketing.
				</li>
				<li>
					<strong>Materials for Affiliates:</strong> Provision of landing pages,
					graphics, and video training (eventually).
				</li>
			</ul>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				7. Program Monitoring and Adjustments
			</h2>
			<ul>
				<li>
					<strong>Performance Monitoring:</strong> Internal high-level KPIs and
					individual KPIs for ambassadors (e.g., number of referred users, link
					clicks).
				</li>
				<li>
					<strong>Adjustments:</strong> Openness to making adjustments based on
					performance metrics and feedback.
				</li>
			</ul>

			<h2 className='text-2xl mt-8 mb-2 font-bold text-white'>
				8. Legal Compliance and Documentation
			</h2>
			<ul>
				<li>
					<strong>Legal Considerations:</strong> To be determined in
					consultation with a compliance specialist.
				</li>
				<li>
					<strong>Policy Documentation:</strong> Detailed policy documents to be
					reviewed and agreed upon by participants before creating their
					referral center account.
				</li>
			</ul>
			{!referrerIds ? (
				<div className='flex mt-2'>
					<button
						onClick={HandleAgreementClick}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						I agree to the referral ambassador terms & conditions
					</button>
					<button
						onClick={HandleDisagreementClick}
						className='flex text-sm md:text-base items-center bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						I disagree
					</button>
				</div>
			) : (
				<div className='mt-4'>
					<p className='flex items-center text-green-500'>
						<BiCheckCircle className='mr-2 text-2xl' /> You completed this
						agreement on {moment(agreementAcceptedAt).format("MMMM D, YYYY")}.
					</p>
				</div>
			)}
		</div>
	);
}
