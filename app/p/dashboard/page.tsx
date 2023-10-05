"use client";
import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import { setProducer } from "@/redux/features/producerSlice";
import { MdWarning } from "react-icons/md";
import convertToCamelCase from "@/utils/convertToCamelCase";
import UrgentNotification from "@/components/UrgentNotification";
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	const handleNewProjectClick = () => {
		router.push("/p/add-project");
	};
	const userId = user.id;
	const dispatch = useAppDispatch();
	const producer = useAppSelector((state) => state.producer);
	const fetchProducerData = async () => {
		const res = await axios.get(
			`${getBasePath()}/api/producer?user_id=${userId}`
		);
		const data = await res.data;
		const producerData = convertToCamelCase(data?.producerData[0]);
		dispatch(
			setProducer({
				...data,
				id: producerData.id,
				producerProperties: producerData.producerProperties,
			})
		);
	};

	useEffect(
		() => {
			if (user && userId) {
				fetchProducerData();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user, userId]
	);
	const [urgentNotification, setUrgentNotification] = useState<{
		message: string;
		actionUrl: string;
		actionType: string;
	}>({ message: "", actionUrl: "", actionType: "" });

	const [allPropertiesUnverified, setAllPropertiesUnverified] = useState(false);

	useEffect(() => {
		if (producer && producer.id) {
			if (producer.producerProperties.length === 0) {
				setUrgentNotification({
					message: "You need to submit an address to create new projects.",
					actionUrl: "/settings?tab=addresses",
					actionType: "Resolve",
				});
			} else {
				setUrgentNotification({ message: "", actionUrl: "", actionType: "" });
			}
		}

		let numUnverifiedAddresses = 0;
		for (let i = 0; i < producer.producerProperties.length; i++) {
			if (producer.producerProperties[i].isVerified === false) {
				setUrgentNotification({
					message: `Your submitted property at ${producer.producerProperties[i].address.addressLineOne} in or near ${producer.producerProperties[i].address.city} is pending verification.`,
					actionUrl: "/settings?tab=addresses",
					actionType: "View",
				});
				numUnverifiedAddresses++;
			}
		}

		if (numUnverifiedAddresses === producer.producerProperties.length) {
			setAllPropertiesUnverified(true);
			setUrgentNotification({
				message: `All of your submitted properties are pending verification.`,
				actionUrl: "/settings?tab=addresses",
				actionType: "View",
			});
		} else if (numUnverifiedAddresses < producer.producerProperties.length) {
			setAllPropertiesUnverified(false);
		}
		if (numUnverifiedAddresses === 0) {
			setUrgentNotification({ message: "", actionUrl: "", actionType: "" });
		}
	}, [producer]);

	return (
		<div className='h-[100vh] w-[100%]'>
			<h1 className='mb-12 pt-12 ml-8 text-2xl'>
				Producer Dashboard | Hello {user.name}!
			</h1>
			{urgentNotification.message !== "" && (
				<UrgentNotification urgentNotification={urgentNotification} />
			)}
			{producer.producerProperties.length > 0 && !allPropertiesUnverified && (
				<div className='flex justify-between items-center mb-4 w-3/4 mx-auto border border-gray-700  rounded-lg p-8 '>
					<h2>Create a new project today</h2>
					<button
						onClick={handleNewProjectClick}
						className='mt-[16px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						Create new project
					</button>
				</div>
			)}
		</div>
	);
};

export default withAuth(Dashboard);
