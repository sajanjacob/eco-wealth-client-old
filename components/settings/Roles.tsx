import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";

type Props = {
	user: UserState;
};

export default function Roles({ user }: Props) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);

	const handleActivateRole = async (role: string) => {
		setLoading(true);
		try {
			// Add the new role to the user's roles array
			const newRoles = [...user.roles, role.toLowerCase()];

			// Update the user's roles in Supabase
			const { data, error } = await supabase
				.from("users")
				.update({ roles: newRoles })
				.eq("id", user.id);

			if (error) throw error;

			if (data) {
				dispatch(setUser({ ...user, roles: newRoles }));
				if (role === "investor") {
					const { data, error } = await supabase.from("investors").insert([
						{
							user_id: user.id,
						},
					]);
					if (error) {
						console.error("Error inserting investor:", error.message);
					}
					if (data) {
						router.push("/i/onboarding");
					}
				}

				if (role === "producer") {
					const { data, error } = await supabase.from("producers").insert([
						{
							user_id: user.id,
						},
					]);
					if (error) {
						console.error("Error inserting producer:", error.message);
					}
					if (data) {
						router.push("/p/onboarding");
					}
				}
			}

			// Redirect the user to the onboarding section for their new role
		} catch (error) {
			console.error("Error activating role:", error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className='w-[80%]'>
			<h2 className='mb-6 text-2xl font-semibold'>Roles</h2>
			{["Investor", "Producer"].map((role) => {
				const isActive = user.roles.includes(role.toLowerCase());
				return (
					<>
						<div
							key={role}
							className={
								isActive
									? "flex items-center justify-between mb-4 border-green-700 border-2 py-4 px-6 rounded-md"
									: "flex items-center justify-between mb-4 border-green-100 border-2 py-4 px-6 rounded-md hover:border-green-400 transition-colors hover:text-green-400"
							}
						>
							<h2 className='text-xl'>{role}</h2>
							{isActive ? (
								<p className='text-green-400 font-semibold text-xl'>
									Activated
								</p>
							) : (
								<button
									onClick={() => handleActivateRole(role.toLowerCase())}
									className='bg-green-500 hover:bg-green-400 transition-colors text-white font-bold py-2 px-4 rounded text-base'
									disabled={isLoading}
								>
									{isLoading ? "Activating account role..." : "Activate now"}
								</button>
							)}
						</div>
					</>
				);
			})}
		</div>
	);
}
