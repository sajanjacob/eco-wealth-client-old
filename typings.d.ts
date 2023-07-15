interface User {
	name: string;
	email: string;
	phoneNumber: string;
	isVerified: boolean;
	roles: string[];
	id: string;
	activeRole: string;
	totalUserTreeCount: number;
	userTreeCount: number;
	onboardingComplete: boolean;
	emailNotification: boolean;
	smsNotification: boolean;
	pushNotification: boolean;
	investorOnboardingComplete: boolean;
	producerOnboardingComplete: boolean;
}
interface UserState {
	roles: string[];
	loggedIn: boolean;
	roles: string[];
	id: string | null;
	producerId: string | null;
	investorId: string | null;
	activeRole: string | null;
	currentTheme: string | null;
	email: string | null;
	name: string | null;
	phoneNumber: string | null;
	isVerified: boolean;
	totalUserTreeCount: number;
	userTreeCount: number;
	onboardingComplete: boolean;
	emailNotification: boolean;
	smsNotification: boolean;
	pushNotification: boolean;
	investorOnboardingComplete: boolean;
	producerOnboardingComplete: boolean;
}

interface OnboardingState {
	addressLineOne: string;
	addressLineTwo: string;
	city: string;
	country: string;
	postalCode: string;
	stateProvince: string;
	operationType: string[];
	treeTypes: string;
	solarTypes: string;
	treeOpSize: string;
	solarOpSize: string;
	producerGoal: string;
	propertyZoneMap: string;
	hasSolarFarmOperation: string;
	hasTreeFarmOperation: string;
	loadingMsg: string;
}

interface Project {
	id: string;
	userId: string | null;
	producerId: string | null;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	treeTarget: number;
	treeCount: number;
	imageUrl: string;
	status: string;

	fundsRequestedPerTree: number;
	projectType?: string;
	treeProjectType: string;
	energyProjectType: string;
	projectId: string;
	projectCoordinatorContact: {
		name: string;
		phone: string;
	};
	totalArea: number;
	agreementAccepted: boolean;

	propertyAddressId: string;
	fundsCollected: number;
	producerProperties: Property;
	investorCount: number;
	totalAreaSqkm: number;
	treeProjects: TreeProject[];
	energyProjects: EnergyProject[];
	projectMilestones: ProjectMilestone[];
	treeInvestments: [];
	energyInvestments: [];
	totalNumberOfInvestors: number;
	totalAmountRaised: number;
	isVerified: boolean;
	currentSoilOrganicContentPercentage?: number;
	targetSoilOrganicContentPercentage?: number;
	requestedAmountTotal?: number;
	unitsContributed?: number;
	averageROI?: number;
	percentFunded?: number;
}

interface ProjectMilestone {
	id: string;
	projectId: string;
	title: string;
	shortDescription: string;
	createdAt: string;
	updatedAt: string;
	body: string;
	isDeleted: boolean;
	deletedAt: string;
}

interface EnergyProject extends Project {
	totalFundsRequested: number;
	totalFundsRaised?: number;
	energyProductionTarget: number;
	actualEnergyProduction?: number;
	energyProductionUnit?: string;
	energyProductionUnitValue?: number;
	averageYearlyProduction?: number;
	targetArrays: number;
	systemSize: number;
	systemCapacity: number;
	labourCost: number;
	systemCost: number;
	maintenanceCost: number;
	installerDetails?: {
		name: string;
	};
	installerType: string;
	connectWithSolarPartner: string;
	locationType: string;
}

interface TreeProject extends Project {
	treeTarget: number;
	treeCount: number;
	fundsRequestedPerTree: number;
	treeProjectType: string;
	projectId: string;
	type: string;
}
interface Property {
	id: string;
	createdAt: string;
	producerId: string;
	address: {
		addressLineOne: string;
		addressLineTwo: string;
		city: string;
		country: string;
		postalCode: string;
		stateProvince: string;
	};
	updatedAt: string;
	isVerified: boolean;
}
type Projects = Project[];
