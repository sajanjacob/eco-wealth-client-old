"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { lightTheme, darkTheme } from "@/styles/themes";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

type Props = {};

const Header = ({}: Props) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const activeRole = useAppSelector(
		(state: { user: UserState }) => state.user?.user?.activeRole
	);
	const currentTheme = useAppSelector(
		(state: { user: UserState }) => state.user?.user?.currentTheme
	);
	const user = useAppSelector((state: { user: UserState }) => state);
	const isLoggedIn = useAppSelector(
		(state: { user: UserState }) => state.user?.user?.loggedIn
	);

	const [theme, setTheme] = useState("light");

	const uiTheme = currentTheme === "light" ? lightTheme : darkTheme;

	const switchRole = (role: String) => {
		fetch("/api/switchActiveRole", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ role: role, userId: user?.user?.user?.id }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			});
	};

	const handleToggleRole = () => {
		if (activeRole === "producer") {
			dispatch(setUser({ ...user, activeRole: "investor" }));
			router.push("/i/dashboard");
			switchRole("investor");
		} else if (activeRole === "investor") {
			dispatch(setUser({ ...user, activeRole: "producer" }));
			router.push("/p/dashboard");
			switchRole("producer");
		}
	};

	const handleLoginClick = () => {
		router.push("/login");
	};

	const handleSignupClick = () => {
		router.push("/signup");
	};

	const handleLogoutClick = async () => {
		// Handle logout logic here
		console.log("logging user out...");
		await supabase.auth.signOut();
		dispatch(setUser({ user: null }));
		router.push("/login");
	};

	const handleToggleTheme = () => {
		// Toggle the theme state between 'light' and 'dark'
		setTheme((prevTheme: string) => {
			const newTheme = prevTheme === "light" ? "dark" : "light";

			// Apply or remove the 'dark' class to the root HTML element
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}

			return newTheme;
		});
	};

	const handleReturnHome = () => {
		router.push("/");
	};

	const handleDashboardClick = () => {
		if (activeRole === "investor") {
			router.push("/i/dashboard");
		}
		if (activeRole === "producer") {
			router.push("/p/dashboard");
		}
	};
	const handleDiscoverClick = () => {
		router.push("/i/discover");
	};

	const handlePortfolioClick = () => {
		router.push("/i/portfolio");
	};

	const handleAddProjectClick = () => {
		router.push("/p/add-project");
	};

	const handleMyProjectsClick = () => {
		router.push("/p/projects");
	};

	const handleEducationCenterClick = () => {
		router.push("/learn");
	};

	const handleProfileClick = () => router.push("/profile");

	console.log(`isLoggedIn: ${isLoggedIn}`);
	return (
		<div className='flex justify-between items-center p-4 bg-white dark:bg-[#0C2100] border-b border-gray-200 dark:border-green-950 sticky top-0'>
			<div
				className='text-xl cursor-pointer text-black font-semibold dark:text-white'
				onClick={handleReturnHome}
			>
				Eco Wealth
			</div>
			<div className='flex space-x-4'>
				{isLoggedIn ? (
					<>
						<a
							className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
							onClick={handleDashboardClick}
						>
							Dashboard
						</a>
						{activeRole === "investor" && (
							<>
								<a
									className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
									onClick={handleDiscoverClick}
								>
									Discover
								</a>
								<a
									className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
									onClick={handlePortfolioClick}
								>
									My Portfolio
								</a>
							</>
						)}
						{activeRole === "producer" && (
							<>
								<a
									className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
									onClick={handleAddProjectClick}
								>
									Add Project
								</a>
								<a
									className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
									onClick={handleMyProjectsClick}
								>
									My Projects
								</a>
							</>
						)}
						<a
							className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
							onClick={handleEducationCenterClick}
						>
							Education Center
						</a>
						<a
							className='cursor-pointer hover:underline text-gray-900 dark:text-gray-300'
							onClick={handleProfileClick}
						>
							Profile
						</a>
						<button
							className='bg-transparent border-none cursor-pointer text-green-600'
							onClick={handleLogoutClick}
						>
							Logout
						</button>
						<button
							className='bg-transparent border-none cursor-pointer text-green-600 ml-4'
							onClick={handleToggleRole}
						>
							Switch to {activeRole === "investor" ? "Producer" : "Investor"}
						</button>
					</>
				) : (
					<>
						<a
							className='cursor-pointer hover:underline text-green-600 font-medium'
							onClick={handleLoginClick}
						>
							Login
						</a>
						<a
							className='cursor-pointer hover:underline text-green-600 font-medium'
							onClick={handleSignupClick}
						>
							Signup
						</a>
					</>
				)}
				<button
					className='bg-transparent border-none cursor-pointer text-blue-600'
					onClick={handleToggleTheme}
				>
					{theme === "dark" ? (
						<BsFillMoonFill className='text-black' />
					) : (
						<BsFillSunFill className='text-yellow-300' />
					)}
				</button>
			</div>
		</div>
	);
};

export default Header;
