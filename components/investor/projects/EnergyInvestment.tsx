import React from "react";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import InvestPopup from "@/components/investor/projects/ProceedToCheckoutButton";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ProceedToCheckoutButton from "@/components/investor/projects/ProceedToCheckoutButton";
type Props = {
	project: Project;
};

export default function EnergyInvestment({ project }: Props) {
	const router = useRouter();
	const [numberOfTrees, setNumberOfTrees] = useState(1);
	const [amountPerTree, setAmountPerTree] = useState(1);
	const { title, description, imageUrl, energyProjects } = project;

	// useEffect(() => {
	// 	if (!project) return;
	// 	if (project && numberOfTrees > treeProjects[0].treeTarget) {
	// 		setNumberOfTrees(treeProjects[0].treeTarget);
	// 		toast.info(
	// 			`Note: The maximum number of trees you can invest in for this project is ${treeProjects[0].treeTarget}`
	// 		);
	// 	}
	// }, [numberOfTrees, treeProjects, project]);
	// useEffect(() => {
	// 	if (!project) return;
	// 	if (amountPerTree > treeProjects[0].fundsRequestedPerTree) {
	// 		setAmountPerTree(treeProjects[0].fundsRequestedPerTree);
	// 		toast.info(
	// 			`Note: The maximum investment amount per tree for this project is $${treeProjects[0].fundsRequestedPerTree}`
	// 		);
	// 	}
	// }, [amountPerTree, treeProjects, project]);

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

	const onInvestmentSuccess = () => {
		toast.success("Investment successful!");
		router.push("/i/portfolio");
	};

	return (
		<div className='flex mx-auto lg:w-[60%]'>
			<div>
				<span className='flex justify-center mb-2'>
					<Image
						width={400}
						height={150}
						src={imageUrl}
						alt={title}
						className='rounded-xl'
					/>
				</span>
				<h1 className='text-3xl font-light'>{title}</h1>
				<p className='text-lg font-light mb-4'>{description}</p>
			</div>

			<form className='px-8 flex-1'>
				<h2 className='text-xl font-semibold'>
					Choose how much to invest in this project:
				</h2>
				<div className='flex flex-col my-4'>
					<label htmlFor='numberOfTrees'>Number of trees:</label>
					<div className='bg-white text-gray-500 p-[4px] rounded flex flex-nowrap'>
						<span className='text-lg'>🌳</span>
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
				<div className='flex flex-col my-4'>
					<label htmlFor='amountPerTree'>Amount per tree:</label>
					<div className='bg-white text-gray-500 p-[4px] rounded  flex flex-nowrap'>
						<span className='font-bold text-lg'>$</span>
						<input
							type='number'
							id='amountPerTree'
							value={amountPerTree}
							onChange={handleAmountPerTreeChange}
							min='1'
							// max={`${treeProjects[0].fundsRequestedPerTree}`}
							className='text-left w-full outline-none ml-2'
						/>
					</div>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-sm'>Potential ROI on produce sales:</span>{" "}
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
									${Number(calculateProcessingFees()).toLocaleString("en-US")}
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
				{/* <ProceedToCheckoutButton
					numOfUnits={}
					amountPerUnit={}
					isNonProfit={}
					projectName={}
					type={}
					projectId={}
					project={}
				/> */}
			</form>
		</div>
	);
}
