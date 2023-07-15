type Category = {
	category: string;
	isVisible: boolean;
	role: "producer" | "investor" | "all";
};

const categories: Category[] = [
	{
		category: "Investing",
		isVisible: true,
		role: "investor",
	},
	{
		category: "Real Estate",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Business",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Personal Finance",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Economics",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Marketing",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Accounting",
		isVisible: false,
		role: "all",
	},
	{
		category: "Management",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Sales",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Leadership",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Public Relations",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Operations",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Human Resources",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Project Management",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Finance",
		isVisible: false,
		role: "all",
	},
	{
		category: "Entrepreneurship",
		isVisible: true,
		role: "producer",
	},
	{
		category: "Communication",
		isVisible: false,
		role: "producer",
	},
	{
		category: "Information Technology",
		isVisible: false,
		role: "all",
	},

	{
		category: "Environmental Science",
		isVisible: true,
		role: "all",
	},
	{
		category: "Geological History",
		isVisible: false,
		role: "all",
	},
];

export default categories;
