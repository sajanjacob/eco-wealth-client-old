import React from "react";

type Props = {
	project: Project | null | undefined;
	treeInvestments: [] | null | undefined;
	treeProject: TreeProject | null | undefined;
};

export default function TreeProject({
	project,
	treeProject,
	treeInvestments,
}: Props) {
	console.log("project", project);
	return (
		<div>
			<p>Tree Project Type: {treeProject?.projectType}</p>
			<p>Target Trees: {treeProject?.treeTarget?.toLocaleString()}</p>
			<p>Planted Trees: {treeProject?.treeCount?.toLocaleString() || 0}</p>
			<p>Funds requested per tree: ${treeProject?.fundsRequestedPerTree}</p>
			<p>
				Total funds requested: $
				{treeProject &&
					(
						treeProject?.treeTarget * treeProject?.fundsRequestedPerTree
					).toLocaleString()}
			</p>
			<p>
				Total Number of Investments:{" "}
				{treeInvestments?.length ? treeInvestments?.length : 0}
			</p>
			<p>
				Total Number of Investors:{" "}
				{project?.projectFinancials.totalNumberOfInvestors}
			</p>
			<p>Total Funds Raised: ${project?.projectFinancials.totalAmountRaised}</p>
		</div>
	);
}
