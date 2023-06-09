import React, { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import UserContext from "@/state/UserContext";

export default function withAuth(WrappedComponent) {
	return function WithAuthComponent(props) {
		const router = useRouter();
		const { state } = useContext(UserContext);
		useEffect(() => {
			if (
				state.matches("loggedIn.investor") ||
				state.matches("loggedIn.producer")
			) {
				// User is logged in, do nothing
			} else if (state.matches("loggedOut")) {
				router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
			}
		}, [state, router]);

		return <WrappedComponent {...props} />;
	};
}
