"use client";
import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	useCallback,
	Ref,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { supabaseClient } from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RxAvatar } from "react-icons/rx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FiPower } from "react-icons/fi";
import {
	MdComment,
	MdSettings,
	MdContactSupport,
	MdBugReport,
} from "react-icons/md";
import { AiOutlineUserSwitch } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { GiSolarPower } from "react-icons/gi";
import { toast } from "react-toastify";
import WaitingListMobileMenu from "./WaitingListMobileMenu";
type Props = {};

const Header = ({}: Props) => {
	const supabase = supabaseClient;
	const router = useRouter();
	const dispatch = useAppDispatch();
	const activeRole = useAppSelector((state) => state.user?.activeRole);
	const currentTheme = useAppSelector((state) => state.user?.currentTheme);
	const user = useAppSelector((state) => state.user);
	const isLoggedIn = useAppSelector((state) => state.user?.loggedIn);

	const [theme, setTheme] = useState<string>(currentTheme || "dark");

	// Avatar Menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const switchRole = (role: String) => {
		fetch("/api/switchActiveRole", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ role: role, userId: user?.id }),
		})
			.then((response) => response.json())
			.then(() => {
				handleClose();
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

	const handleAboutClick = () => {
		router.push("/#about");
	};

	const handlePricingClick = () => {
		router.push("/#pricing");
	};

	const handleStrategyClick = () => {
		router.push("/#strategy");
	};
	const handleHowItWorksClick = () => {
		router.push("/#how-it-works");
	};

	const handleLoginClick = () => {
		router.push("/login");
	};

	const handleSignupClick = () => {
		router.push("/signup");
	};

	// Logout logic
	const handleLogoutClick = async () => {
		// Handle logout logic here
		await supabase.auth.signOut();
		dispatch(
			setUser({
				roles: [],
				loggedIn: false,
				id: null,
				activeRole: null,
				currentTheme: null,
				email: null,
				name: null,
				phoneNumber: null,
				isVerified: false,
				totalUserTreeCount: 0,
				userTreeCount: 0,
				onboardingComplete: false,
				investorOnboardingComplete: false,
				producerOnboardingComplete: false,
				emailNotification: false,
				smsNotification: false,
				pushNotification: false,
			})
		);
		await supabase
			.from("users")
			.update({
				mfa_verified: false,
			})
			.eq("id", user.id);
		router.push("/login");
	};
	const handleUpdateTheme = async (theme: string) => {
		const { data, error } = await supabase
			.from("users")
			.update({ current_theme: theme })
			.eq("id", user?.id);
		if (error) {
			console.error("Error updating user theme:", error.message);
		}
		if (data) {
			dispatch(setUser({ ...user, currentTheme: theme }));
			// Apply or remove the 'dark' class to the root HTML element
			if (theme === "light") {
				if (typeof window !== "undefined")
					document.documentElement.classList.add("dark");
			} else {
				if (typeof window !== "undefined")
					window.document.documentElement.classList.remove("dark");
			}
		}
	};

	// Here we toggle the theme between light and dark.
	const handleToggleTheme = () => {
		// Toggle the theme state between 'light' and 'dark'
		setTheme((prevTheme: string) => {
			const newTheme = prevTheme === "light" ? "dark" : "light";

			if (isLoggedIn) {
				handleUpdateTheme(newTheme);
			} else {
				// Apply or remove the 'dark' class to the root HTML element
				if (theme === "light") {
					if (typeof window !== "undefined")
						document.documentElement.classList.add("dark");
				} else {
					if (typeof window !== "undefined")
						window.document.documentElement.classList.remove("dark");
				}
			}
			return newTheme;
		});
	};

	// When the theme is initially loaded from redux and it's the 'light' class, we apply it
	// by removing 'dark' from the root html element.  Else, we leave the element alone.
	useEffect(() => {
		if (currentTheme === "light") {
			if (typeof window !== "undefined")
				document.documentElement.classList.remove("dark");
		}
	}, [currentTheme]);

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
		router.push("/educationcenter");
	};

	const handleSettingsClick = () =>
		router.push("/settings?tab=personal-details");

	const handleWaitingListClick = () => router.push("/register");

	const [render, setRender] = useState(true);
	const path = usePathname();

	useEffect(() => {
		path !== "/thankyou" &&
		path !== "/register" &&
		path !== "/login" &&
		path !== "/signup" &&
		path !== "/forgot-password" &&
		path !== "/onboarding" &&
		path !== "/i/onboarding" &&
		path !== "/p/onboarding" &&
		path !== "/setup-mfa"
			? setRender(true)
			: setRender(false);
	}, [path]);
	if (!render) return null;
	return (
		<div className='z-[1000] flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-green-500 dark:bg-gradient-to-r dark:from-green-950 dark:to-[#0C2100] border-b border-b-green-400 dark:border-b-green-900 sticky top-0'>
			<Image
				src='/white_logo_transparent_background.png'
				alt='EcoWealth logo'
				width={148}
				height={60}
				onClick={handleReturnHome}
				className='cursor-pointer'
			/>
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
								onClick={handleSettingsClick}
							>
								<MdSettings className='mr-2' /> Account Settings
							</MenuItem>

							{user?.roles?.length > 1 ? (
								<>
									<MenuItem
										className='menu-link'
										onClick={handleToggleRole}
									>
										<AiOutlineUserSwitch className='mr-2' />
										Switch to{" "}
										{activeRole === "investor" ? "Producer" : "Investor"}
									</MenuItem>
								</>
							) : null}
							<Link
								href='https://ecoxsolar.com/'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<GiSolarPower className='mr-2' /> Get Home Solar
								</MenuItem>
							</Link>
							<Link
								href='https://eco-wealth.canny.io/'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<MdComment className='mr-2' /> Give Feedback
								</MenuItem>
							</Link>
							<Link
								href='mailto:support@ecowealth.app'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<MdContactSupport className='mr-2' /> Get Support
								</MenuItem>
							</Link>
							<Link
								href='mailto:support@ecowealth.app'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<MdBugReport className='mr-2' /> Report a Bug
								</MenuItem>
							</Link>
							{/* TODO: fix light & dark mode */}
							{/* <MenuItem
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
							</MenuItem> */}
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
							className='hidden md:block scroll-smooth cursor-pointer hover:text-green-400 transition-all text-green-600 font-medium'
							onClick={handleAboutClick}
						>
							About
						</a>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-green-400 transition-all text-green-600 font-medium'
							onClick={handleStrategyClick}
						>
							Strategy
						</a>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-green-400 transition-all text-green-600 font-medium'
							onClick={handleHowItWorksClick}
						>
							How it works
						</a>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-green-400 transition-all text-green-600 font-medium'
							onClick={handlePricingClick}
						>
							Pricing
						</a>
						<button
							className='cursor-pointer transition-all hover:scale-105 bg-green-600 text-white font-medium rounded-md text-sm lg:text-lg lg:px-8 px-4 py-2 animation-pulsate'
							onClick={handleWaitingListClick}
						>
							Join the waiting list today
						</button>
						<WaitingListMobileMenu />
						{/* <a
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
						</a> */}
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
