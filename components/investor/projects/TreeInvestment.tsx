import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import TreeInvestmentLeft from "./TreeInvestmentLeft";
import TreeInvestmentCheckout from "./TreeInvestmentCheckout";
import ProceedToCheckoutButton from "@/components/investor/projects/ProceedToCheckoutButton";
import { GiPieChart } from "react-icons/gi";
import moment from "moment";

type Props = {
	project: Project;
};

export default function TreeInvestment({ project }: Props) {
	const {
		title,
		description,
		imageUrl,
		treeProjects,
		projectFinancials,
		treeProjectType,
	} = project;
	const router = useRouter();
	const [numberOfShares, setNumberOfShares] = useState(1);
	const [amountPerShare, setAmountPerShare] = useState(
		projectFinancials.amountPerShare
	);
	const [checkoutStep, setCheckoutStep] = useState(1);

	useEffect(() => {
		if (!project) return;

		setAmountPerShare(projectFinancials.amountPerShare);
	}, [project, projectFinancials]);

	// TODO: get number of shares acquired by all investors and subtract from total number of shares to get
	// remaining # of shares that can be acquired.
	useEffect(() => {
		if (!project) return;
		if (project && numberOfShares > projectFinancials.numOfShares) {
			setNumberOfShares(projectFinancials.numOfShares);
			toast.info(
				`Note: The maximum number of trees you can invest in for this project is ${projectFinancials.numOfShares}`
			);
		}
	}, [numberOfShares, treeProjects, project, projectFinancials]);

	const handleInvestment = () => {
		// Perform investment logic here
	};
	const calculateROI = () => {
		const estRoiPercentage =
			parseInt(projectFinancials.estRoiPercentagePerShare) / 100;
		const amount = numberOfShares * amountPerShare * estRoiPercentage;
		return amount.toFixed(2);
	};
	const merchantFeePercentage = 0.03;
	const merchantFeePercentageFinal = 1 + merchantFeePercentage;
	const transactionFee = 1;
	const calculateInvestmentSubtotalAmount = () => {
		const amount = numberOfShares * amountPerShare;
		return amount.toFixed(2);
	};
	const calculateInvestmentTotalAmount = () => {
		const amount =
			(numberOfShares * amountPerShare + transactionFee) *
			merchantFeePercentageFinal;
		return amount.toFixed(2).toLocaleString();
	};
	const calculateProcessingFees = () => {
		const amount =
			(numberOfShares * amountPerShare + transactionFee) *
			merchantFeePercentage;
		return amount.toFixed(2);
	};

	if (!project) {
		return <div>Loading...</div>;
	}

	// Rest of the InvestmentPage component code
	const handleNumberOfTreesChange = (e: any) => {
		setNumberOfShares(e.target.value);
	};
	const handleAmountPerTreeChange = (e: any) => {
		setAmountPerShare(e.target.value);
	};

	const handleInvestmentSuccess = () => {
		toast.success("Investment successful!");
		router.push("/i/portfolio");
	};

	const handleGoBack = () => {
		setCheckoutStep(1);
	};

	const estimatedMaturityDate = moment(treeProjects?.estMaturityDate).format(
		"MMMM Do, YYYY"
	); // 'July 15th, 2021
	switch (checkoutStep) {
		case 1:
			if (!treeProjects) return <div>Loading...</div>;
			return (
				<div className='flex mx-auto lg:w-[60%]'>
					<TreeInvestmentLeft
						title={title}
						description={description}
						imageUrl={imageUrl}
						treeProjectType={treeProjects.type}
						estPlantingDate={treeProjects.estPlantingDate}
						estimatedMaturityDate={estimatedMaturityDate}
					/>

					<form className='px-8 flex-1'>
						<h2 className='text-xl font-semibold'>
							Choose how many shares to acquire:
						</h2>
						<div className='flex flex-col my-4'>
							<label htmlFor='numberOfShares'>Number of shares:</label>
							<div className='bg-white text-gray-500 p-[4px] rounded flex flex-nowrap items-center mt-[2px]'>
								<span className='text-lg text-green-600 ml-2'>
									<GiPieChart />
								</span>
								<input
									type='number'
									id='numberOfShares'
									value={numberOfShares}
									onChange={handleNumberOfTreesChange}
									min='1'
									// max={`${treeTarget}`}
									className='text-left w-full outline-none ml-2 text-2xl font-semibold'
								/>
							</div>
						</div>
						<div className='flex justify-between items-center my-2'>
							<label htmlFor='amountPerShare'>Amount per share:</label>
							<p>
								$
								{Number(projectFinancials.amountPerShare).toLocaleString(
									"en-US"
								)}
							</p>
						</div>
						<div className='flex justify-between items-center text-green-500'>
							<span className='text-sm'>Estimated Return ($)</span>{" "}
							<span className='font-bold text-2xl '>
								${Number(calculateROI()).toLocaleString("en-US")}
							</span>
						</div>
						<div className='flex justify-between items-center text-green-500'>
							<span className='text-sm'>Potential ROI (%)</span>{" "}
							<span className='font-bold'>
								{projectFinancials.estRoiPercentagePerShare}%
							</span>
						</div>

						<hr className='mt-2' />
						{numberOfShares > 0 && (
							<>
								<div className='flex justify-between items-center mt-2'>
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
										<span className='text-sm'>Merchant Fee:</span>
										<span className='text-sm'>
											$
											{Number(calculateProcessingFees()).toLocaleString(
												"en-US"
											)}
										</span>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm'>Administrative Fee:</span>{" "}
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
							numOfShares={numberOfShares}
							projectId={project.id}
							project={project}
						/>
					</form>
				</div>
			);

		// TODO: bring payment step in-house
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
