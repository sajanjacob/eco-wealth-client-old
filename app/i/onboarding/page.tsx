import React, { FC } from "react";
import withAuth from "@/utils/withAuth";

function Onboarding() {
	// ... component code ...
	return (
		<div>
			<h1>Investor Onboarding</h1>
		</div>
	);
}

export default withAuth(Onboarding);
