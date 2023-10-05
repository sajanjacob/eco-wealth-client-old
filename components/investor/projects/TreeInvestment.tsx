import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import TreeInvestmentLeft from "./TreeInvestmentLeft";
import TreeInvestmentCheckout from "./TreeInvestmentCheckout";
import ProceedToCheckoutButton from "@/components/investor/projects/ProceedToCheckoutButton";
import { GiPieChart } from "react-icons/gi";

type Props = {
	project: Project;
};

export default function TreeInvestment({ project }: Props) {
	const router = useRouter();
	const [numberOfTrees, setNumberOfTrees] = useState(1);
	const [amountPerTree, setAmountPerTree] = useState(1);
	const [checkoutStep, setCheckoutStep] = useState(1);
	const { title, description, imageUrl, treeProjects } = project;

	useEffect(() => {
		if (!project) return;
		if (project && numberOfTrees > treeProjects[0].treeTarget) {
			setNumberOfTrees(treeProjects[0].treeTarget);
			toast.info(
				`Note: The maximum number of trees you can invest in for this project is ${treeProjects[0].treeTarget}`
			);
		}
	}, [numberOfTrees, treeProjects, project]);
	useEffect(() => {
		if (!project) return;
		if (amountPerTree > treeProjects[0].fundsRequestedPerTree) {
			setAmountPerTree(treeProjects[0].fundsRequestedPerTree);
			toast.info(
				`Note: The maximum investment amount per tree for this project is $${treeProjects[0].fundsRequestedPerTree}`
			);
		}
	}, [amountPerTree, treeProjects, project]);

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

	if (!project) {
		return <div>Loading...</div>;
	}

	// Rest of the InvestmentPage component code
	const handleNumberOfTreesChange = (e: any) => {
		setNumberOfTrees(e.target.value);
	};
	const handleAmountPerTreeChange = (e: any) => {
		setAmountPerTree(e.target.value);
	};

	const handleInvestmentSuccess = () => {
		toast.success("Investment successful!");
		router.push("/i/portfolio");
	};

	const handleGoBack = () => {
		setCheckoutStep(1);
	};

	switch (checkoutStep) {
		case 1:
			return (
				<div className='flex mx-auto lg:w-[60%]'>
					<TreeInvestmentLeft
						title={title}
						description={description}
						imageUrl={imageUrl}
					/>

					<form className='px-8 flex-1'>
						<h2 className='text-xl font-semibold'>
							Choose how much to invest in this project:
						</h2>
						<div className='flex flex-col my-4'>
							<label htmlFor='numberOfTrees'>Number of shares:</label>
							<div className='bg-white text-gray-500 p-[4px] rounded flex flex-nowrap items-center'>
								<span className='text-lg text-green-600'>
									<GiPieChart />
								</span>
								<input
									type='number'
									id='numberOfTrees'
									value={numberOfTrees}
									onChange={handleNumberOfTreesChange}
									min='1'
									// max={`${treeTarget}`}
									className='text-left w-full outline-none ml-2'
								/>
							</div>
						</div>
						<div className='flex justify-between items-center my-4'>
							<label htmlFor='amountPerTree'>Amount per share:</label>
							<p>$1.00</p>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-sm'>Potential ROI:</span>{" "}
							<span className='font-bold'>{calculateROI()}%</span>
						</div>
						{numberOfTrees > 0 && (
							<>
								<div className='flex justify-between items-center'>
									<span className='text-sm'>Investment Subtotal: </span>
									<span className='text-sm'>
										$
										{Number(calculateInvestmentSubtotalAmount()).toLocaleString(
											"en-US"
										)}
									</span>
								</div>
								<div className='my-2'>
									<span>Processing Fees: </span>
									<div className='flex justify-between items-center'>
										<span className='text-sm'>Merchant Fees:</span>
										<span className='text-sm'>
											$
											{Number(calculateProcessingFees()).toLocaleString(
												"en-US"
											)}
										</span>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm'>Administrative Fees:</span>{" "}
										<span>$1.00</span>
									</div>
								</div>
								<hr className='my-2' />
								<div className='flex justify-between items-center'>
									<span>Total Investment Today: </span>
									<span className='font-bold'>
										$
										{Number(calculateInvestmentTotalAmount()).toLocaleString(
											"en-US"
										)}
									</span>
								</div>
							</>
						)}
						<ProceedToCheckoutButton
							setCheckoutStep={setCheckoutStep}
							numOfUnits={numberOfTrees}
							amountPerUnit={amountPerTree}
							projectName={title}
							type={project.type}
							project={project}
						/>
					</form>
				</div>
			);

		// case 2:
		// 	return (
		// 		<div className='flex mx-auto lg:w-[60%]'>
		// 			<TreeInvestmentLeft
		// 				title={title}
		// 				description={description}
		// 				imageUrl={imageUrl}
		// 			/>
		// 			<TreeInvestmentCheckout
		// 				calculateInvestmentTotalAmount={parseFloat(
		// 					calculateInvestmentTotalAmount()
		// 				)}
		// 				handleInvestmentSuccess={handleInvestmentSuccess}
		// 				handleGoBack={handleGoBack}
		// 			/>
		// 		</div>
		// 	);
	}
}
