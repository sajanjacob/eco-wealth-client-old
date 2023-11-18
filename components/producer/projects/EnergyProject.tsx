import React from "react";

type Props = {
	project: Project;
};

export default function EnergyProject({ project }: Props) {
	const { energyProjects, solarProjects } = project;

	return (
		<div>
			<p>Project type: {solarProjects.locationType}</p>
			<p>Total funds requested: ${project.requestedAmountTotal}</p>
			<p>
				Energy production target: {energyProjects.targetKwhProductionPerYear}{" "}
				kWh
			</p>
			<p>Actual energy production: {energyProjects.energyProduced} kWh</p>
			<p>Average yearly production: {energyProjects.avgYearlyProduction} kWh</p>
			<p>Target number of arrays: {solarProjects.numOfArrays}</p>
			<p>System size: {solarProjects.systemSizeInKw} kWh</p>
			<p>System capacity: {solarProjects.systemCapacity} kWh</p>
			<p>Labour cost: ${solarProjects.labourCost}</p>
			<p>System cost: ${solarProjects.systemCost}</p>
			<p>Maintenance cost: ${solarProjects.maintenanceCost}</p>
			{/* <p>Installer details: {project.installerDetails.name}</p>  */}
			<p>
				Installer type:{" "}
				{energyProjects.installationTeam === "thirdParty"
					? "Third Party"
					: "Eco Wealth Partner"}
			</p>
		</div>
	);
}
