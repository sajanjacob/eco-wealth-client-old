import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
type Referral = {
	name: string;
	email: string;
	dateReferred: string;
	type: string;
	orderStatus: string;
};
type Props = {};

export default function Enagic({}: Props) {
	const [referrals, setReferrals] = useState<Referral[]>([]);
	const user = useAppSelector((state) => state.user);
	const referralId = user.referralId;
	// Fetch referrals from the backend
	const fetchReferrals = async () => {
		console.log("fetching referrals...");
		axios
			.post("/api/referrals/enagic", {
				refId: referralId,
			})
			.then((res) => {
				setReferrals(res.data);
				console.log("Enagic referrals: ", res.data);
			})
			.catch((err) => {
				console.log("Unable to fetch referrals: ", err);
			});
	};

	// Run fetchReferrals on component mount
	useEffect(() => {
		fetchReferrals();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<h2 className='text-2xl mb-2'>Your Enagic Customers:</h2>
			<table className='w-[100%] border-white rounded-md border-[1px]'>
				<thead className='text-left border-b-[1px]'>
					<tr>
						<th className='p-2'>Name</th>
						<th>Email</th>
						<th>Date Referred</th>
						<th>Type</th>
						<th>Order status</th>
					</tr>
				</thead>
				<tbody>
					{referrals &&
						referrals.map((referral, index) => (
							<tr
								key={index}
								className='text-left border-b-[1px]'
							>
								<td className='p-2'>{referral.name}</td>
								<td>{referral.email}</td>
								<td>{referral.dateReferred}</td>
								<td>{referral.type}</td>
								<td>{referral.orderStatus}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
