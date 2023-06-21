import React from "react";

type Props = {
	project: TreeProject | null | undefined;
};

export default function TreeProject({ project }: Props) {
	return (
		<div>
			<p>Tree Project Type: {project?.type}</p>
			<p>Target Trees: {project?.treeTarget}</p>
			<p>Planted Trees: {project?.treeCount}</p>
			<p>Funds requested per tree: ${project?.fundsRequestedPerTree}</p>
			<p>
				Total funds requested: $
				{project &&
					(
						project?.treeTarget * project?.fundsRequestedPerTree
					).toLocaleString()}
			</p>
		</div>
	);
}
