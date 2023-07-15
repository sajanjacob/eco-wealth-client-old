"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import EducationCard from "@/components/education/EducationCard";
import categories from "@/lib/getCategories";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
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

const EducationCenter = () => {
	const [cards, setCards] = useState<EduCard[]>([]);
	const [categoryLinks, setCategoryLinks] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const activeRole = useAppSelector((state) =>
		state.user?.activeRole?.toLowerCase()
	);

	useEffect(() => {
		let filteredCategories = [] as Category[];
		if (activeRole === "producer") {
			filteredCategories = categories.filter(
				(category) => category.role === "producer" || category.role === "all"
			);
		} else if (activeRole === "investor") {
			filteredCategories = categories.filter(
				(category) => category.role === "investor" || category.role === "all"
			);
		}
		setCategoryLinks(filteredCategories);
	}, [activeRole]);

	useEffect(() => {
		// Fetch initial data
		fetchCards("");
	}, []);

	useEffect(() => {
		if (selectedCategory) {
			// Re-fetch data when category changes
			fetchCards(selectedCategory);
			return;
		}
		fetchCards("");
	}, [selectedCategory]);

	const fetchCards = async (category: string) => {
		const apiUrl = "/api/edu";
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
				.catch((err) => console.log(err));
		}
		if (response && (response as EduCard[]).length > 0) {
			const filteredCards = (response as EduCard[]).filter(
				(card) => card.role === activeRole || card.role === "all"
			);
			setCards(filteredCards);
		}
	};

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
		<div className='education-center flex'>
			<div className='category-pane custom-scrollbar flex flex-col p-4 w-1/4 bg-green-950 overflow-y-scroll h-screen'>
				{categoryLinks.map(
					({ category, isVisible, role }) =>
						((isVisible && role === activeRole) ||
							(isVisible && role === "all")) && (
							<button
								key={category}
								onClick={() => handleCategoryClick(category)}
								className={`p-2 m-2 text-white rounded-full ${
									selectedCategory === category
										? "bg-green-500"
										: "bg-green-800"
								}`}
							>
								{category}
							</button>
						)
				)}
			</div>

			<div className='card-list flex flex-wrap p-4 justify-start w-3/4 m-4'>
				{cards.length > 0 &&
					cards.map((card: EduCard) => (
						<EducationCard
							key={card.id}
							title={card.title}
							url={card.url}
							imgUrl={card.imgUrl}
							shortDescription={card.shortDescription}
							category={card.category}
						/>
					))}
			</div>
		</div>
	);
};

export default withAuth(EducationCenter);
