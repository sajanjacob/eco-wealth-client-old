import withAuth from "@/utils/withAuth";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
function Dashboard(props) {
	const targetTotalUserTreeCount = 5000;
	const targetUserTreeCount = 45;
	const [totalUserTreeCount, setTotalUserTreeCount] = useState(0);
	const [userTreeCount, setUserTreeCount] = useState(0);

	const animateValue = (start, end, baseDuration, callback) => {
		const range = end - start;
		let current = start;
		const increment = range / Math.abs(baseDuration / 10);
		const stepTime = baseDuration / (range / increment);
		const timer = setInterval(() => {
			current += increment;
			if (current >= end) {
				current = end;
				clearInterval(timer);
			}
			callback(Math.floor(current));
		}, stepTime);
	};

	useEffect(() => {
		const baseDuration = 2000; // You can adjust this value to control the overall animation duration

		animateValue(
			0,
			targetTotalUserTreeCount,
			baseDuration,
			setTotalUserTreeCount
		);
		animateValue(0, targetUserTreeCount, baseDuration, setUserTreeCount);
	}, [targetTotalUserTreeCount, targetUserTreeCount]);

	const CO2RemovalRate = 4.5;
	const ConvertToKGFromTonness = 1016.04691;
	return (
		<Container>
			<h1>Investor Dashboard</h1>
			<DashboardGrid>
				<DashboardItem>
					<ItemDescription>Total Trees Planted</ItemDescription>
					<ItemValue>{totalUserTreeCount}</ItemValue>
				</DashboardItem>
				<DashboardItem>
					<ItemDescription>Your Trees Planted</ItemDescription>
					<ItemValue>{userTreeCount}</ItemValue>
				</DashboardItem>
				<DashboardItem>
					<ItemDescription>Together We&apos;ve Offset:</ItemDescription>
					<ItemValue>
						{Math.floor(
							totalUserTreeCount * CO2RemovalRate * ConvertToKGFromTonness
						)}{" "}
						kg of CO²
					</ItemValue>
				</DashboardItem>
				<DashboardItem>
					<ItemDescription>You&apos;ve Offset:</ItemDescription>
					<ItemValue>
						{Math.floor(
							userTreeCount * CO2RemovalRate * ConvertToKGFromTonness
						)}{" "}
						kg of CO²
					</ItemValue>
				</DashboardItem>
				{/* Add two more elements here */}
			</DashboardGrid>
		</Container>
	);
}
export default withAuth(Dashboard);
const Container = styled.div`
	width: 75%;
	margin: 0 auto;
	border: 1px solid whitesmoke;
	margin: 2rem auto;
	border-radius: 16px;
	padding: 16px 40px;
	> h1 {
		margin-bottom: 48px;
	}
`;
const DashboardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 2rem;
`;

const DashboardItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ItemDescription = styled.p`
	margin-bottom: 0.5rem;
`;

const ItemValue = styled.h2`
	margin-top: 0;
`;
