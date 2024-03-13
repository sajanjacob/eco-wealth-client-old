"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { supabaseClient } from "./supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { RootState } from "@/redux/store";
import axios from "axios";

export default function withAuth(WrappedComponent: React.ComponentType<any>) {
	const supabase = supabaseClient;
	return function WithAuthComponent(props: any) {
		const router = useRouter();
		const user = useAppSelector((state: RootState) => state.user);
		const pathname = usePathname();
		const dispatch = useAppDispatch();

		function isOlderThanADay(timestamp: string) {
			// Parse the input timestamp into a Date object
			const dateFromTimestamp = new Date(timestamp);

			// Get the current date and time
			const now = new Date();

			// Subtract 24 hours from the current date
			const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

			// If dateFromTimestamp is older than oneDayAgo, return true
			// otherwise, return false
			return dateFromTimestamp < oneDayAgo;
		}

		// Here we query public.users for the user's additional profile data
		const fetchUserData = async (userId: string) => {
			try {
				axios
					.post("/api/user", { userId })
					.then((res) => {
						if (
							res.data.data.mfa_verified_at &&
							isOlderThanADay(res.data.data.mfa_verified_at)
						) {
							return router.push("/login");
						}
						console.log("user authenticated.", res);
						dispatch(
							setUser({
								name: res.data.data.name,
								email: res.data.data.email,
								phoneNumber: res.data.data.phone_number,
								isVerified: res.data.data.is_verified,
								roles: res.data.data.roles ? res.data.data.roles : [""],
								id: res.data.data.id,
								investorId: res.data?.data.investors?.id,
								producerId: res.data?.data.producers?.id,
								activeRole: res.data.data.active_role,
								loggedIn: true,
								emailNotification: res.data.data.email_notification,
								smsNotification: res.data.data.sms_notification,
								pushNotification: res.data.data.push_notification,
								onboardingComplete: res.data.data.onboarding_complete,
								investorOnboardingComplete:
									res.data?.data.investors?.onboarding_complete,
								investorOnboardingSkipped:
									res.data?.data.investors?.onboarding_skipped,
								producerOnboardingComplete:
									res.data?.data.producers?.onboarding_complete,
								mfaEnabled: res.data.data.mfa_enabled,
								mfaVerified: res.data.data.mfa_verified,
								mfaVerifiedAt: res.data.data.mfa_verified_at,
								mfaFrequency: res.data.data.mfa_frequency,
								currentTheme:
									res.data.data.current_theme !== null
										? res.data.data.current_theme
										: "dark",
								loadingUser: false,
								refAgreement: res.data.refUser.agreement_accepted,
								refAgreementAcceptedAt: res.data.refUser.agreement_accepted_at,
								referrerIds: res.data.refUser.id,
							})
						); // Dispatch a redux action

						// Here we check for the user's active role from supabase and then push them to their
						// respective onboarding page if they haven't completed it yet or we push them to their
						// respective dashboard pages if they have completed their onboarding.

						if (
							res.data.data.active_role === "investor" &&
							!res.data.data.investors[0].onboarding_complete &&
							!res.data.data.investors[0].onboarding_skipped
						) {
							router.push("/i/onboarding/");
						} else if (
							res.data.data.active_role === "producer" &&
							!res.data.data.producers[0].onboarding_complete
						) {
							router.push("/p/onboarding/");
						} else if (
							res.data.data.active_role === "referral_ambassador" &&
							!res.data.refUser.agreement_accepted
						) {
							router.push("/r/onboarding/");
						} else {
							if (!res.data.data.mfa_enabled) {
								console.log("MFA is not enabled");
								return router.push("/setup-mfa");
							}
							if (!res.data.data.mfa_verified) {
								console.log("MFA is not verified");
								return router.push("/login");
							}
						}
					})
					.catch((err) => {
						console.error("Unable to fetch user data: ", err);
					});
			} catch (err) {
				console.error("Unexpected error fetching user data:", err);
				return null;
			}
		};

		const checkUserLoggedInStatus = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				fetchUserData(user.id);
			} else {
				if (pathname)
					router.push(`/login?next=${encodeURIComponent(pathname)}`);
				else router.push(`/login`);
			}
		};

		useEffect(() => {
			if (user.loggedIn) {
				let role = null;
				if (pathname?.includes("/i/")) {
					role = "investor";
				} else if (pathname?.includes("/p/")) {
					role = "producer";
				}

				if (role) {
					console.log(
						"user.roles.includes(role) >>> ",
						user.roles.includes(role)
					);

					if (user.roles.includes(role)) {
						if (user.activeRole !== role) {
							// Switch role
							dispatch(setUser({ ...user, activeRole: role }));
						}
						if (
							user.activeRole === "producer" &&
							!user.producerOnboardingComplete
						) {
							return router.push("/p/onboarding");
						}
						if (
							user.activeRole === "investor" &&
							!user.investorOnboardingComplete &&
							!user.investorOnboardingSkipped
						) {
							return router.push("/i/onboarding");
						}
					} else {
						// Redirect to dashboard if user doesn't have role
						router.push(`/onboarding/`);
					}
				}
			} else {
				checkUserLoggedInStatus();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [user, pathname, dispatch, router]);

		return <WrappedComponent {...props} />;
	};
}
