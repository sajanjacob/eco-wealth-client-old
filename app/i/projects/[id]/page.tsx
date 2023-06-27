"use client";
import ProjectDetails from "@/components/ProjectDetails";
import withAuth from "@/utils/withAuth";
import React from "react";
function Projects({}) {
	return (
		<div>
			<ProjectDetails />
		</div>
	);
}
export default withAuth(Projects);
