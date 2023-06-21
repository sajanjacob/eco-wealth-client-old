import React from "react";

type Props = {
	project: EnergyProject | null | undefined;
};

export default function EnergyProject({ project }: Props) {
	return (
		<div>
			{/* <p>Total funds requested: ${project.totalFundsRequested}</p>
			<p>Energy production target: {project.energyProductionTarget} kWh</p>
			<p>Actual energy production: {project.actualEnergyProduction} kWh</p>
			<p>Average yearly production: {project.averageYearlyProduction} kWh</p>
			<p>Target number of arrays: {project.targetArrays}</p>
			<p>System size: {project.systemSize} kWh</p>
			<p>System capacity: {project.systemCapacity} kWh</p>
			<p>Labour cost: ${project.labourCost}</p>
			<p>System cost: ${project.systemCost}</p>
			<p>Maintenance cost: ${project.maintenanceCost}</p>
			<p>Installer details: {project.installerDetails.name}</p> */}
			{/* <p>
				Installer type:{" "}
				{project.installerType === "thirdParty"
					? "Third Party"
					: "Eco Wealth Partner"}
			</p> */}
		</div>
	);
}
