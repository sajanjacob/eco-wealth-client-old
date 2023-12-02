"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import EducationCard from "@/components/education/EducationCard";
import categories from "@/lib/getCategories";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
import { BASE_URL } from "@/constants";
type EduCard = {
	id: string;
	title: string;
	url: string;
	imgUrl: string;
	shortDescription: string;
	category: string;
	role: string;
};

type Category = {
	category: string;
	role: "producer" | "investor" | "all";
	isVisible: boolean;
};
export async function getServerSideProps(context: any) {
	const { query } = context;
	const { category = "" } = query;
	const apiUrl = `${BASE_URL}/api/edu/?category=${category}`; // Adjust the URL as needed
	let cards = [];

	try {
		const response = await axios.get(apiUrl);
		cards = response.data;
	} catch (error) {
		console.error("Error fetching data: ", error);
	}

	// Determine which categories to show based on user role or other criteria
	const categoryLinks = categories; // Adjust this as per your application's logic

	return { props: { initialCards: cards, categoryLinks } };
}
const EducationCenter = ({
	initialCards,
	categoryLinks,
}: {
	initialCards: any;
	categoryLinks: any;
}) => {
	const [cards, setCards] = useState<EduCard[]>(initialCards);
	const activeRole = useAppSelector((state) =>
		state.user?.activeRole?.toLowerCase()
	);
	const [selectedCategory, setSelectedCategory] = useState("");
	const fetchCards = async (category: string) => {
		const apiUrl = "/api/edu/";
		let response: EduCard[] | null = null;
		if (category === "") {
			console.log("fetching all ", category);
			await axios
				.get<EduCard[]>(`${apiUrl}?category=all`)
				.then((res) => {
					response = res.data as EduCard[];
					console.log(res.data);
				})
				.catch((err) => console.log(err));
		} else {
			await axios
				.get<EduCard[]>(`${apiUrl}?category=${category}`)
				.then((res) => (response = res.data as EduCard[]))
				.catch((err) => {
					console.log(err);
					return setCards([]);
				});
		}
		if (response && (response as EduCard[]).length > 0) {
			const filteredCards = (response as EduCard[]).filter(
				(card) => card.role === activeRole || card.role === "all"
			);
			console.log("response >>> ", response);
			console.log("filteredCards >>> ", filteredCards);
			setCards(filteredCards);
		}
	};
	// Compute filtered categories directly based on the activeRole
	const filteredCategoryLinks = React.useMemo(() => {
		return categoryLinks.filter(
			(category: any) => category.role === activeRole || category.role === "all"
		);
	}, [categoryLinks, activeRole]);

	useEffect(() => {
		// Fetch initial data
		fetchCards("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedCategory) {
			// Re-fetch data when category changes
			fetchCards(selectedCategory);
			return;
		}
		fetchCards("");
	}, [selectedCategory]);

	const handleCategoryClick = (category: string) => {
		if (category === selectedCategory) {
			console.log("setting category >>> ");
			setSelectedCategory("");
		} else {
			console.log("setting category >>> ", category);

			setSelectedCategory(category);
		}
	};

	return (
		<div className='flex md:flex-row flex-col'>
			<div className='custom-scrollbar flex md:flex-col p-2 md:p-4 lg:w-[14%] bg-[var(--bg-one)] overflow-x-scroll md:overflow-x-hidden md:overflow-y-scroll md:h-screen'>
				{filteredCategoryLinks.map(
					({
						category,
						isVisible,
						role,
					}: {
						category: any;
						isVisible: boolean;
						role: string;
					}) =>
						((isVisible && role === activeRole) ||
							(isVisible && role === "all")) && (
							<button
								key={category}
								onClick={() => handleCategoryClick(category)}
								className={`h-[max-content] text-sm md:text-base p-2 m-2 text-white rounded-full border-[1px] border-gray-700 hover:border-[var(--cta-one-hover)] transition-colors ${
									selectedCategory === category
										? "bg-[var(--cta-one)] border-[var(--cta-one)] hover:border-green-800 "
										: "bg-[var(--bg-one)]"
								}`}
							>
								{category}
							</button>
						)
				)}
			</div>

			<div className='card-list flex flex-wrap p-4 justify-start md:w-3/4 m-2'>
				{cards.length > 0 ? (
					cards.map((card: EduCard) => (
						<EducationCard
							key={card.id}
							title={card.title}
							url={card.url}
							imgUrl={card.imgUrl}
							shortDescription={card.shortDescription}
							category={card.category}
						/>
					))
				) : (
					<div className='flex flex-col items-center justify-center w-full h-full'>
						<h1 className='text-2xl font-bold text-center mb-2'>
							No lessons or resources found under {selectedCategory} yet.
						</h1>
						<p className='text-center'>Try changing your category.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default withAuth(EducationCenter);
