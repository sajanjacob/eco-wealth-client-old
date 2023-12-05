"use client";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/features/userSlice"; // You need to create this action
import { RootState } from "@/redux/store"; // You need to create this file
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import withAuth from "@/utils/withAuth";

const Onboarding: FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [step, setStep] = useState(0);

	//  Here we update the user's role in the database and redux store
	const updateUserData = async (role: string) => {
		dispatch(
			setUser({
				...user,
				roles: [role],
				activeRole: role,
				phoneNumber: phone,
				onboardingComplete: true,
			})
		);
		const { data, error } = await supabase
			.from("users")
			.update({
				name: name,
				roles: [role],
				phone_number: phone,
				active_role: role,
				onboarding_complete: true,
			})
			.eq("id", user.id);
		if (error) {
			console.error("Error updating user role:", error.message);
			setLoading(false);
		}
		if (data) {
			if (role === "investor") {
				const { data, error } = await supabase.from("investors").insert([
					{
						user_id: user.id,
					},
				]);
				const { data: analyticData, error: analyticErr } = await supabase
					.from("analytics")
					.insert([
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
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setLoading(true);
		const accountRole =
			event.currentTarget.getAttribute("data-account-role") || "";
		setRole(accountRole);
		updateUserData(accountRole);
	};

	const handleNameSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		dispatch(setUser({ ...user, name: name }));
		setLoading(false);
		setStep(1);
	};

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};
	const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhone(e.target.value);
	};

	useEffect(() => {
		if (user?.activeRole === "investor") {
			router.push("/i/onboarding");
		} else if (user?.activeRole === "producer") {
			router.push("/p/onboarding");
		}
	}, [user?.activeRole, router]);

	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (name.length > 0 && phone.length > 0) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [name, phone]);

	switch (step) {
		case 0:
			return (
				<form
					onSubmit={handleNameSubmit}
					className='flex flex-col items-center justify-center min-h-screen'
				>
					<div className='flex flex-col'>
						<h1 className='mr-4 text-left mb-4 text-3xl text-gray-500 dark:text-white font-semibold'>
							Welcome to Eco Wealth.
						</h1>
						<h2 className='mr-4 text-left mb-8 text-xl text-gray-500 dark:text-white font-semibold'>
							Please complete your account setup to gain access and start
							investing or raising funds for the environment.
						</h2>
						<div>
							<label className='mr-4 text-left mb-4 text-xl text-gray-500 dark:text-white'>
								What&apos;s your name?
							</label>
							<input
								value={name}
								onChange={handleNameInput}
								className='w-[300px] p-2 mb-4 rounded text-gray-800 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
								type='name'
								placeholder='Full name'
								name='name'
							/>
						</div>
						<div>
							<label className='mr-4 text-left mb-4 text-xl text-gray-500 dark:text-white'>
								What&apos;s your phone number?
							</label>
							<input
								value={phone}
								onChange={handlePhoneInput}
								className='w-[300px] p-2 mb-4 rounded text-gray-800 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
								type='tel'
								placeholder='Phone Number'
								name='phone'
							/>
						</div>
					</div>
					<div>
						<button
							className={`px-4 py-2 rounded text-white mt-8  ${
								disabled
									? "bg-gray-500"
									: "cursor-pointer bg-green-700 transition-all hover:scale-105 hover:bg-green-500"
							}  `}
							disabled={disabled}
						>
							Continue to next step
						</button>
					</div>
				</form>
			);

		case 1:
			return (
				<div className='flex flex-col items-center justify-center min-h-screen'>
					<div className='w-[60%] text-center'>
						<h1 className='mb-8 text-5xl text-gray-500 dark:text-white font-bold'>
							👋 Hey {name}, let&apos;s get started!
						</h1>
						<h1 className='mb-2 text-2xl text-gray-500 dark:text-white'>
							Which role do you want to start with?
						</h1>
						<p className='mb-10 text-gray-500 dark:text-white text-sm'>
							<span className='font-semibold'>Note:</span> you can always
							explore other roles or add more roles to your account later.
						</p>
					</div>
					<button
						data-account-role='investor'
						onClick={handleButtonClick}
						className={`px-16 py-4 rounded text-white mb-4 w-[448px] ${
							loading
								? "bg-gray-500"
								: "cursor-pointer bg-green-700 transition-all hover:scale-105 hover:bg-green-500"
						}  `}
					>
						<span className='text-4xl font-bold'>Investor:</span> <br />I want
						to explore opportunities to invest in.
					</button>
					<button
						data-account-role='producer'
						onClick={handleButtonClick}
						className={`px-16 py-4 rounded text-white  mb-4 w-[448px] ${
							loading
								? "bg-gray-500"
								: "cursor-pointer bg-green-700 transition-all hover:scale-105 hover:bg-green-500"
						}  `}
					>
						<span className='text-4xl font-bold'>Producer:</span> <br />I want
						to operate & raise funds for projects.
					</button>
				</div>
			);
	}
};

export default withAuth(Onboarding);
