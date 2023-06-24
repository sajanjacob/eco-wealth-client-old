import supabase from "@/utils/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
	project: TreeProject | null | undefined;
	treeInvestments: [] | null | undefined;
};

export default function TreeProject({ project, treeInvestments }: Props) {
	return (
		<div>
			<p>Tree Project Type: {project?.type}</p>
			<p>Target Trees: {project?.treeTarget?.toLocaleString()}</p>
			<p>Planted Trees: {project?.treeCount?.toLocaleString()}</p>
			<p>Funds requested per tree: ${project?.fundsRequestedPerTree}</p>
			<p>
				Total funds requested: $
				{project &&
					(
						project?.treeTarget * project?.fundsRequestedPerTree
					).toLocaleString()}
			</p>
			<p>
				Total Number of Investments:{" "}
				{treeInvestments?.length ? treeInvestments?.length : 0}
			</p>
			<p>Total Number of Investors: {project?.totalNumberOfInvestors}</p>
			<p>Total Funds Raised: ${project?.totalAmountRaised}</p>
		</div>
	);
}
