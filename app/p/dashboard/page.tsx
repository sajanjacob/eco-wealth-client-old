"use client";
import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	const handleNewProjectClick = () => {
		router.push("/p/add-project");
	};

	return (
		<div className='h-[100vh] w-[100%]'>
			<h1 className='mb-12 pt-12 ml-8 text-2xl'>
				Producer Dashboard | Hello {user.name}!
			</h1>
			<div className='flex justify-between items-center mb-4 w-3/4 mx-auto border border-gray-700  rounded-lg p-8 '>
				<h2>Create a new project today</h2>
				<button
					onClick={handleNewProjectClick}
					className='mt-[16px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
				>
					Create new project
				</button>
			</div>
		</div>
	);
};

export default withAuth(Dashboard);
