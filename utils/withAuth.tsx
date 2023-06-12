"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import supabase from "./supabaseClient";
import { setUser } from "@/redux/features/userSlice";

export default function withAuth(WrappedComponent: React.ComponentType<any>) {
	return function WithAuthComponent(props: any) {
		const router = useRouter();
		const user = useAppSelector((state) => state.user);
		const pathname = usePathname();
		const dispatch = useAppDispatch();

		// Here we query public.users for the user's additional profile data
		const fetchUserData = async (userId: string) => {
			try {
				const { data, error } = await supabase
					.from("users")
					.select("*")
					.eq("id", userId)
					.single();
				if (error) {
					console.error("Error fetching user data:", error.message);

					return null;
				}
				dispatch(
					setUser({
						...user,
						name: data.name,
						email: data.email,
						phoneNumber: data.phone_number,
						isVerified: data.is_verified,
						roles: data.roles ? data.roles : [],
						id: data.id,
						activeRole: data.active_role,
						loggedIn: true,
						emailNotification: data.email_notification,
						smsNotification: data.sms_notification,
						pushNotification: data.push_notification,
					})
				); // Dispatch a redux action
				console.log("user is logged in, ", data);
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
				router.push(`/login?next=${encodeURIComponent(pathname)}`);
			}
		};

		useEffect(() => {
			if (user.loggedIn) {
				// User is logged in, do nothing
				console.log("user is logged in, ", user);
			} else {
				checkUserLoggedInStatus();
			}

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [user, pathname]);

		return <WrappedComponent {...props} />;
	};
}
