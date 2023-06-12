import supabase from "@/utils/supabaseClient";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
	user: UserState;
};

export default function PasswordAndSecurity({ user }: Props) {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	// Here we have a function called setPassword that updates the user's password in the supabase database
	const setPassword = async () => {
		setLoading(true);
		const { data, error } = await supabase.rpc("change_user_password", {
			current_plain_password: oldPassword,
			new_plain_password: newPassword,
		});

		if (error) {
			console.log(error.message);
			toast.error(`Could not update password: ${error.message}`);
			setLoading(false);
			return;
		}
		toast.success("Password updated successfully");
		setLoading(false);
	};

	const handlePasswordChange = () => {
		if (newPassword !== confirmNewPassword) {
			toast.error("New passwords do not match!");
			return;
		}
		setLoading(true);
		setPassword();
		// Password update logic goes here.
		// You would typically make an API call to the server to update the password.
	};

	return (
		<div className='mt-6 w-[80%]'>
			<h2 className='mb-6 text-2xl font-semibold'>Password and Security</h2>
			<h3 className='mb-3 text-xl font-light'>Update Password</h3>
			<div className='mb-4'>
				<label
					className='block text-sm font-bold mb-2'
					htmlFor='old-password'
				>
					Old Password
				</label>
				<input
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					id='old-password'
					type='password'
					placeholder='Old password'
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label
					className='block text-sm font-bold mb-2'
					htmlFor='new-password'
				>
					New Password
				</label>
				<input
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					id='new-password'
					type='password'
					placeholder='New password'
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label
					className='block text-sm font-bold mb-2'
					htmlFor='confirm-new-password'
				>
					Confirm New Password
				</label>
				<input
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					id='confirm-new-password'
					type='password'
					placeholder='Confirm new password'
					value={confirmNewPassword}
					onChange={(e) => setConfirmNewPassword(e.target.value)}
				/>
			</div>
			{errorMessage && (
				<p className='text-red-500 text-xs italic'>{errorMessage}</p>
			)}
			<div className='flex justify-end'>
				<button
					className='w-[33%] bg-green-500 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					type='button'
					onClick={handlePasswordChange}
				>
					{loading ? "Updating Password..." : "Update Password"}
				</button>
			</div>
		</div>
	);
}
