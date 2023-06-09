import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import InvestPopup from "@/components/InvestPopup";
function Invest() {
	const router = useRouter();
	const { id } = router.query;
	const [project, setProject] = useState(null);
	const [numberOfTrees, setNumberOfTrees] = useState(1);
	const [amountPerTree, setAmountPerTree] = useState(1);
	useEffect(() => {
		if (project && amountPerTree > project.funds_requested_per_tree) {
			setAmountPerTree(project.funds_requested_per_tree);
			toast.info(
				`Note: The maximum investment amount per tree for this project is $${project.funds_requested_per_tree}`
			);
		}
	}, [amountPerTree, project]);
	useEffect(() => {
		if (project && numberOfTrees > project.tree_target) {
			setNumberOfTrees(project.tree_target);
			toast.info(
				`Note: The maximum number of trees you can invest in for this project is ${project.tree_target}`
			);
		}
	}, [numberOfTrees, project]);
	const handleInvestment = () => {
		// Perform investment logic here
	};
	const calculateROI = () => {
		const amount = (amountPerTree / 10) * 0.01 * 100;
		return amount.toFixed(2);
	};
	const merchantFeePercentage = 0.03;
	const merchantFeePercentageFinal = 1 + merchantFeePercentage;
	const transactionFee = 1;
	const calculateInvestmentSubtotalAmount = () => {
		const amount = numberOfTrees * amountPerTree;
		return amount.toFixed(2);
	};
	const calculateInvestmentTotalAmount = () => {
		const amount =
			(numberOfTrees * amountPerTree + transactionFee) *
			merchantFeePercentageFinal;
		return amount.toFixed(2);
	};
	const calculateProcessingFees = () => {
		const amount =
			(numberOfTrees * amountPerTree + transactionFee) * merchantFeePercentage;
		return amount.toFixed(2);
	};
	useEffect(() => {
		const fetchProject = async () => {
			const { data, error } = await supabase
				.from("projects")
				.select("*")
				.eq("id", id)
				.single();
			if (error) {
				console.error("Error fetching project:", error.message);
			} else {
				setProject(data);
			}
		};
		if (id) {
			fetchProject();
		}
	}, [id]);
	if (!project) {
		return <div>Loading...</div>;
	}
	const {
		title,
		description,
		image_url,
		tree_target,
		funds_requested_per_tree,
	} = project;
	// Rest of the InvestmentPage component code
	const handleNumberOfTreesChange = (e) => {
		setNumberOfTrees(e.target.value);
	};
	const handleAmountPerTreeChange = (e) => {
		setAmountPerTree(e.target.value);
	};

	const onInvestmentSuccess = () => {
		toast.success("Investment successful!");
		router.push("/i/portfolio");
	};
	return (
		<Container>
			<ProjectInfo>
				<img src={image_url} alt={title} />
				<h1>{title}</h1>
				<p>{description}</p>
			</ProjectInfo>
			<InvestmentForm>
				<h2>Choose how much to invest in this project:</h2>
				<label htmlFor='numberOfTrees'>Number of trees:</label>
				<input
					type='number'
					id='numberOfTrees'
					value={numberOfTrees}
					onChange={handleNumberOfTreesChange}
					min='1'
					max={`${tree_target}`}
				/>
				<label htmlFor='amountPerTree'>Amount per tree:</label>
				<AmountPerTree>
					$
					<input
						type='number'
						id='amountPerTree'
						value={amountPerTree}
						onChange={handleAmountPerTreeChange}
						min='1'
						max={`${funds_requested_per_tree}`}
					/>
				</AmountPerTree>
				<p>
					Potential ROI on produce sales: <strong>{calculateROI()}%</strong>
				</p>
				{numberOfTrees > 0 && (
					<>
						<p>
							Investment Subtotal:{" "}
							<strong>
								$
								{Number(calculateInvestmentSubtotalAmount()).toLocaleString(
									"en-US"
								)}
							</strong>
						</p>
						<p>
							Processing Fees:{" "}
							<strong>
								${Number(calculateProcessingFees()).toLocaleString("en-US")} +
								$1.00
							</strong>
						</p>
						<p>
							Total Investment Today:{" "}
							<strong>
								$
								{Number(calculateInvestmentTotalAmount()).toLocaleString(
									"en-US"
								)}
							</strong>
						</p>
					</>
				)}
				<InvestPopup
					calculateInvestmentTotalAmount={calculateInvestmentTotalAmount}
					onInvestmentSuccess={onInvestmentSuccess}
				/>
			</InvestmentForm>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ProjectInfo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 2rem;
	width: 100%;
	> img {
		width: 100%;
		height: 40vh;
		object-fit: cover;
	}
`;

const InvestmentForm = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 64px;
`;
const AmountPerTree = styled.div`
	display: flex;
	align-items: center;
	> input {
		margin-left: 2px;
	}
`;

export default Invest;

// Styled components
