"use client";
import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	useCallback,
	Ref,
} from "react";
import { useRouter } from "next/navigation";
import { lightTheme, darkTheme } from "@/styles/themes";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RxAvatar } from "react-icons/rx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FiPower } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
type Props = {};

const Header = ({}: Props) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const activeRole = useAppSelector((state) => state.user?.active_role);
	const currentTheme = useAppSelector((state) => state.user?.currentTheme);
	const user = useAppSelector((state) => state.user);
	const isLoggedIn = useAppSelector((state) => state.user?.loggedIn);

	const [theme, setTheme] = useState("dark");

	// Avatar Menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	console.log("(header) redux user >>> ", user);
	const switchRole = (role: String) => {
		fetch("/api/switchActiveRole", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ role: role, userId: user?.id }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			});
	};

	const handleToggleRole = () => {
		if (activeRole === "producer") {
			dispatch(setUser({ ...user, active_role: "investor" }));
			router.push("/i/dashboard");
			switchRole("investor");
		} else if (activeRole === "investor") {
			dispatch(setUser({ ...user, active_role: "producer" }));
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
		dispatch(
			setUser({
				roles: [],
				loggedIn: false,
				id: null,
				active_role: null,
				currentTheme: null,
				email: null,
				name: null,
				phone_number: null,
				is_verified: false,
				totalUserTreeCount: 0,
				userTreeCount: 0,
			})
		);
		router.push("/login");
	};

	const handleToggleTheme = () => {
		// Toggle the theme state between 'light' and 'dark'
		setTheme((prevTheme: string) => {
			const newTheme = prevTheme === "light" ? "dark" : "light";

			// Apply or remove the 'dark' class to the root HTML element
			if (theme === "light") {
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
		<div className='flex justify-between items-center p-4 bg-green-500 dark:bg-gradient-to-r from-green-950 to-[#0C2100] border-b border-b-gray-200 dark:border-b-green-900 sticky top-0'>
			<div
				className='text-xl cursor-pointer text-black font-semibold dark:text-white'
				onClick={handleReturnHome}
			>
				Eco Wealth
			</div>
			<div className='flex space-x-4 items-center'>
				{isLoggedIn ? (
					<>
						<a
							className='menu-link'
							onClick={handleDashboardClick}
						>
							Dashboard
						</a>
						{activeRole === "investor" && (
							<>
								<a
									className='menu-link'
									onClick={handleDiscoverClick}
								>
									Discover
								</a>
								<a
									className='menu-link'
									onClick={handlePortfolioClick}
								>
									My Portfolio
								</a>
							</>
						)}
						{activeRole === "producer" && (
							<>
								<a
									className='menu-link'
									onClick={handleAddProjectClick}
								>
									Add Project
								</a>
								<a
									className='menu-link'
									onClick={handleMyProjectsClick}
								>
									My Projects
								</a>
							</>
						)}
						<a
							className='menu-link'
							onClick={handleEducationCenterClick}
						>
							Education Center
						</a>
						<div
							className='cursor-pointer'
							id='basic-button'
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup='true'
							aria-expanded={open ? "true" : undefined}
							onClick={handleClick}
						>
							<RxAvatar className='text-2xl menu-link' />
						</div>
						<Menu
							id='basic-menu'
							className=''
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
							disableScrollLock={true}
							sx={
								theme === "dark"
									? {
											"& .MuiPaper-root": {
												backgroundColor: "rgb(12 33 0 / 90%)",
												borderColor: "rgb(20 83 45 / 90%)",
												borderWidth: "2px",
											},
									  }
									: {
											"& .MuiPaper-root": {
												backgroundColor: "",
											},
									  }
							}
						>
							<MenuItem
								className='menu-link'
								onClick={handleToggleTheme}
							>
								{theme === "light" ? (
									<>
										<BsFillMoonFill className='text-black mr-2' />
										Dark Mode
									</>
								) : (
									<>
										<BsFillSunFill className='text-yellow-300 mr-2' />
										Light Mode
									</>
								)}
							</MenuItem>
							{user?.roles?.length > 1 ? (
								<>
									<MenuItem
										className='menu-link'
										onClick={handleToggleRole}
									>
										Switch to{" "}
										{activeRole === "investor" ? "Producer" : "Investor"}
									</MenuItem>
								</>
							) : null}

							<MenuItem
								className='menu-link'
								onClick={handleProfileClick}
							>
								<CgProfile className='mr-2' /> Account Center
							</MenuItem>
							<MenuItem
								className='menu-link'
								onClick={handleLogoutClick}
							>
								<FiPower className='mr-2' /> Logout
							</MenuItem>
						</Menu>
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
			</div>
		</div>
	);
};

export default Header;
