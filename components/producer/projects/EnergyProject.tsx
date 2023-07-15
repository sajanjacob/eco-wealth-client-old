import React from "react";

type Props = {
	project: Project;
};

export default function EnergyProject({ project }: Props) {
	const { energyProjects, solarProjects } = project;

	return (
		<div>
			<p>Project type: {solarProjects[0].locationType}</p>
			<p>Total funds requested: ${project.requestedAmountTotal}</p>
			<p>
				Energy production target: {energyProjects[0].energyProductionTarget} kWh
			</p>
			<p>Actual energy production: {energyProjects[0].energyProduced} kWh</p>
			<p>
				Average yearly production: {energyProjects[0].avgYearlyProduction} kWh
			</p>
			<p>Target number of arrays: {solarProjects[0].numOfArrays}</p>
			<p>System size: {solarProjects[0].systemSizeInKw} kWh</p>
			<p>System capacity: {solarProjects[0].systemCapacity} kWh</p>
			<p>Labour cost: ${solarProjects[0].labourCost}</p>
			<p>System cost: ${solarProjects[0].systemCost}</p>
			<p>Maintenance cost: ${solarProjects[0].maintenanceCost}</p>
			{/* <p>Installer details: {project.installerDetails.name}</p>  */}
			<p>
				Installer type:{" "}
				{energyProjects[0].installationTeam === "thirdParty"
					? "Third Party"
					: "Eco Wealth Partner"}
			</p>
		</div>
	);
}
