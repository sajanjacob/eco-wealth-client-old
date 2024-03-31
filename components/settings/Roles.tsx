import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { MdOutlineSportsRugby } from "react-icons/md";

type Props = {
	user: UserState;
};

export default function Roles({ user }: Props) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [loadingRole, setLoadingRole] = useState<string | null>(null);
	const handleActivateRole = async (role: string, e: React.FormEvent) => {
		e.preventDefault();
		setLoadingRole(role);

		// Add the new role to the user's roles array
		let newRoles: string[] = [];
		let newRole = "";
		if (role === "referral ambassador") {
			newRoles = [...user.roles, "referral_ambassador"];
			newRole = "referral_ambassador";
		} else {
			newRoles = [...user.roles, role];
			newRole = role;
		}

		await axios
			.post("/api/settings/roles", {
				roles: newRoles,
				userId: user.id,
				role: newRole,
			})
			.then((res) => {
				console.log(res.data);

				let activeRole = "";
				let nextRoute = "";
				let newDispatch = setUser({ ...user });
				if (newRole === "investor") {
					nextRoute = "/i/onboarding";
					activeRole = "investor";
					newDispatch = setUser({
						...user,
						roles: newRoles,
						activeRole: activeRole,
						investorId: res.data.id,
					});
				}
				if (newRole === "producer") {
					nextRoute = "/p/onboarding";
					activeRole = "producer";
					newDispatch = setUser({
						...user,
						roles: newRoles,
						activeRole: activeRole,
						producerId: res.data.id,
					});
				}
				if (newRole === "referral_ambassador") {
					nextRoute = "/r/onboarding";
					activeRole = "referral_ambassador";
					newDispatch = setUser({
						...user,
						roles: newRoles,
						activeRole: activeRole,
						referralId: res.data.id,
					});
				}
				dispatch(newDispatch);
				router.push(nextRoute);
				setLoadingRole(role);
			})
			.catch((error) => {
				setLoadingRole(role);
				console.log("Error updating user roles:", error.message);
			});

		// Redirect the user to the onboarding section for their new role
	};
	return (
		<div className='md:w-[80%]'>
			<h2 className='mb-6 text-2xl font-semibold'>Roles</h2>
			{["Investor", "Producer", "Referral Ambassador"].map((role) => {
				let searchedRole = role.toLowerCase();
				if (role === "Referral Ambassador") {
					searchedRole = "referral_ambassador";
				} //get db value for referral
				const isActive = user.roles.includes(searchedRole);
				const isRoleLoading = loadingRole === searchedRole;
				return (
					<div key={role}>
						<div
							className={
								isActive
									? "flex items-center justify-between mb-4 border-[var(--cta-one)] border-2 py-4 px-6 rounded-md"
									: "flex items-center justify-between mb-4 border-green-100 border-2 py-4 px-6 rounded-md hover:border-[var(--cta-two-hover)] transition-colors hover:text-[var(--cta-two-hover)]"
							}
						>
							<h2
								className={
									isActive ? "text-[var(--cta-one)] text-xl" : "text-xl"
								}
							>
								{role}
							</h2>
							{isActive ? (
								<p className='text-[var(--cta-one)] font-semibold text-xl'>
									Activated
								</p>
							) : (
								<button
									onClick={(e) => handleActivateRole(role.toLowerCase(), e)}
									className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white font-bold py-2 px-4 rounded text-base'
									disabled={isRoleLoading}
								>
									{isRoleLoading
										? "Activating account role..."
										: "Activate now"}
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
